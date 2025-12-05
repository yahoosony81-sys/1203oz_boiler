/**
 * @file booking-actions.ts
 * @description 예약 관련 Server Actions
 * 
 * 예약 CRUD 작업을 위한 Server Actions를 정의합니다.
 * - createBooking: 예약 생성
 * - approveBooking: 예약 승인
 * - rejectBooking: 예약 거절
 * - cancelBooking: 예약 취소
 * - getMyBookings: 내 예약 목록 조회
 * - getReceivedBookings: 받은 예약 목록 조회 (차주용)
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Booking, BookingFormData } from "@/types/vehicle";

// 응답 타입
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 예약 생성
 */
export async function createBooking(
  formData: BookingFormData
): Promise<ActionResult<Booking>> {
  console.group("[createBooking] 예약 생성 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    console.log("사용자 ID:", userId);
    console.log("예약 데이터:", formData);
    
    const supabase = await createClerkSupabaseClient();
    
    // 차량 정보 조회 (가격 계산용)
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .select("owner_id, price_per_day, status")
      .eq("id", formData.vehicle_id)
      .single();
    
    if (vehicleError || !vehicle) {
      console.error("차량 조회 실패:", vehicleError);
      console.groupEnd();
      return { success: false, error: "차량을 찾을 수 없습니다." };
    }
    
    // 자기 차량 예약 방지
    if (vehicle.owner_id === userId) {
      console.error("자기 차량 예약 시도");
      console.groupEnd();
      return { success: false, error: "자신의 차량은 예약할 수 없습니다." };
    }
    
    // 차량 상태 확인
    if (vehicle.status !== "active") {
      console.error("비활성 차량 예약 시도");
      console.groupEnd();
      return { success: false, error: "현재 이용할 수 없는 차량입니다." };
    }
    
    // 날짜 중복 확인
    const { data: overlappingBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("vehicle_id", formData.vehicle_id)
      .eq("status", "approved")
      .or(`and(start_date.lte.${formData.end_date.toISOString()},end_date.gte.${formData.start_date.toISOString()})`);
    
    if (overlappingBookings && overlappingBookings.length > 0) {
      console.error("날짜 중복:", overlappingBookings);
      console.groupEnd();
      return { success: false, error: "해당 기간에 이미 승인된 예약이 있습니다." };
    }
    
    // 총 가격 계산
    const days = Math.ceil(
      (formData.end_date.getTime() - formData.start_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = vehicle.price_per_day * Math.max(days, 1);
    
    console.log("예약 일수:", days, "총 가격:", totalPrice);
    
    // 예약 생성
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        vehicle_id: formData.vehicle_id,
        renter_id: userId,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        pickup_location: formData.pickup_location || null,
        return_location: formData.return_location || null,
        total_price: totalPrice,
        status: "pending",
        payment_status: "unpaid",
      })
      .select()
      .single();
    
    if (error) {
      console.error("예약 생성 실패:", error);
      console.groupEnd();
      return { success: false, error: `예약 생성 실패: ${error.message}` };
    }
    
    console.log("예약 생성 성공:", data);
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    revalidatePath("/bookings/received");
    revalidatePath(`/vehicles/${formData.vehicle_id}`);
    
    return { success: true, data: data as Booking };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 예약 승인 (차주용)
 */
export async function approveBooking(bookingId: string): Promise<ActionResult<Booking>> {
  console.group("[approveBooking] 예약 승인 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 예약 정보 조회
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles (owner_id)
      `)
      .eq("id", bookingId)
      .single();
    
    if (fetchError || !booking) {
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 차주 확인
    if (booking.vehicles.owner_id !== userId) {
      console.groupEnd();
      return { success: false, error: "승인 권한이 없습니다." };
    }
    
    // pending 상태 확인
    if (booking.status !== "pending") {
      console.groupEnd();
      return { success: false, error: "승인 대기 상태의 예약만 승인할 수 있습니다." };
    }
    
    // 예약 승인
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "approved" })
      .eq("id", bookingId)
      .select()
      .single();
    
    if (error) {
      console.error("승인 실패:", error);
      console.groupEnd();
      return { success: false, error: `승인 실패: ${error.message}` };
    }
    
    // 같은 기간의 다른 pending 예약들을 거절
    await supabase
      .from("bookings")
      .update({ status: "rejected" })
      .eq("vehicle_id", booking.vehicle_id)
      .eq("status", "pending")
      .neq("id", bookingId)
      .or(`and(start_date.lte.${booking.end_date},end_date.gte.${booking.start_date})`);
    
    console.log("예약 승인 성공:", data);
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    revalidatePath("/bookings/received");
    
    return { success: true, data: data as Booking };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 예약 거절 (차주용)
 */
export async function rejectBooking(bookingId: string): Promise<ActionResult<Booking>> {
  console.group("[rejectBooking] 예약 거절 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 예약 정보 조회
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles (owner_id)
      `)
      .eq("id", bookingId)
      .single();
    
    if (fetchError || !booking) {
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 차주 확인
    if (booking.vehicles.owner_id !== userId) {
      console.groupEnd();
      return { success: false, error: "거절 권한이 없습니다." };
    }
    
    // pending 상태 확인
    if (booking.status !== "pending") {
      console.groupEnd();
      return { success: false, error: "승인 대기 상태의 예약만 거절할 수 있습니다." };
    }
    
    // 예약 거절
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "rejected" })
      .eq("id", bookingId)
      .select()
      .single();
    
    if (error) {
      console.error("거절 실패:", error);
      console.groupEnd();
      return { success: false, error: `거절 실패: ${error.message}` };
    }
    
    console.log("예약 거절 성공:", data);
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    revalidatePath("/bookings/received");
    
    return { success: true, data: data as Booking };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 예약 취소 (이용자용)
 */
export async function cancelBooking(bookingId: string): Promise<ActionResult<Booking>> {
  console.group("[cancelBooking] 예약 취소 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 예약 정보 조회
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();
    
    if (fetchError || !booking) {
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 본인 예약 확인
    if (booking.renter_id !== userId) {
      console.groupEnd();
      return { success: false, error: "취소 권한이 없습니다." };
    }
    
    // 취소 가능 상태 확인
    if (!["pending", "approved"].includes(booking.status)) {
      console.groupEnd();
      return { success: false, error: "취소할 수 없는 상태입니다." };
    }
    
    // 결제 완료된 경우 취소 불가 (별도 환불 프로세스 필요)
    if (booking.payment_status === "paid") {
      console.groupEnd();
      return { success: false, error: "결제 완료된 예약은 환불 요청이 필요합니다." };
    }
    
    // 예약 취소
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .select()
      .single();
    
    if (error) {
      console.error("취소 실패:", error);
      console.groupEnd();
      return { success: false, error: `취소 실패: ${error.message}` };
    }
    
    console.log("예약 취소 성공:", data);
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    revalidatePath("/bookings/received");
    
    return { success: true, data: data as Booking };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 내 예약 목록 조회 (이용자용)
 */
export async function getMyBookings(): Promise<ActionResult<Booking[]>> {
  console.group("[getMyBookings] 내 예약 조회");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles (*)
      `)
      .eq("renter_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("조회 실패:", error);
      console.groupEnd();
      return { success: false, error: `조회 실패: ${error.message}` };
    }
    
    console.log("조회 성공:", data?.length || 0, "건");
    console.groupEnd();
    
    return { success: true, data: (data || []) as Booking[] };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 받은 예약 목록 조회 (차주용)
 */
export async function getReceivedBookings(): Promise<ActionResult<Booking[]>> {
  console.group("[getReceivedBookings] 받은 예약 조회");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 내 차량의 예약들 조회
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles!inner (*)
      `)
      .eq("vehicles.owner_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("조회 실패:", error);
      console.groupEnd();
      return { success: false, error: `조회 실패: ${error.message}` };
    }
    
    console.log("조회 성공:", data?.length || 0, "건");
    console.groupEnd();
    
    return { success: true, data: (data || []) as Booking[] };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 예약 상세 조회
 */
export async function getBookingById(bookingId: string): Promise<ActionResult<Booking>> {
  console.group("[getBookingById] 예약 상세 조회");
  
  try {
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles (*)
      `)
      .eq("id", bookingId)
      .single();
    
    if (error) {
      console.error("조회 실패:", error);
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    console.log("조회 성공:", data);
    console.groupEnd();
    
    return { success: true, data: data as Booking };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

