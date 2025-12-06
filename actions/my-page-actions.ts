/**
 * @file my-page-actions.ts
 * @description 마이페이지 관련 Server Actions
 * 
 * 마이페이지에서 사용하는 데이터 조회를 위한 Server Actions를 정의합니다.
 * - getMyOrders: 결제 완료된 주문 내역 조회
 * - getOrderDetail: 주문 상세 정보 조회
 * - getMyProfileStats: 사용자 통계 정보 조회
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { Booking, Vehicle } from "@/types/vehicle";

// 응답 타입
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// 주문 내역 타입 (차량 정보 및 차주 정보 포함)
export interface OrderWithDetails extends Booking {
  vehicle?: Vehicle;
  owner?: {
    name: string;
    phone: string | null;
  };
}

// 주문 상세 타입
export interface OrderDetail extends OrderWithDetails {
  rentalDays?: number;
}

// 사용자 통계 타입
export interface ProfileStats {
  totalOrders: number;
  totalAmount: number;
  activeBookings: number;
  registeredVehicles: number;
}

/**
 * 결제 완료된 주문 내역 조회
 * payment_status = 'paid'인 예약만 조회
 */
export async function getMyOrders(): Promise<ActionResult<OrderWithDetails[]>> {
  console.group("[getMyOrders] 주문 내역 조회");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 결제 완료된 예약 조회 (vehicles 테이블 조인)
    const { data: bookings, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq("renter_id", userId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false });
    
    if (bookingError) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      return { success: false, error: `조회 실패: ${bookingError.message}` };
    }
    
    if (!bookings || bookings.length === 0) {
      console.log("주문 내역 없음");
      console.groupEnd();
      return { success: true, data: [] };
    }
    
    // 각 주문의 차주 정보 조회
    const ordersWithDetails: OrderWithDetails[] = [];
    
    for (const booking of bookings) {
      const vehicle = booking.vehicle as Vehicle | undefined;
      
      if (vehicle) {
        // 차주 정보 조회
        const { data: owner } = await supabase
          .from("users")
          .select("name, phone")
          .eq("clerk_id", vehicle.owner_id)
          .single();
        
        ordersWithDetails.push({
          ...booking,
          vehicle,
          owner: owner || { name: "알 수 없음", phone: null },
        } as OrderWithDetails);
      } else {
        // 차량 정보가 없는 경우 (삭제된 차량)
        ordersWithDetails.push({
          ...booking,
          vehicle: undefined,
          owner: { name: "알 수 없음", phone: null },
        } as OrderWithDetails);
      }
    }
    
    console.log("조회 성공:", ordersWithDetails.length, "건");
    console.groupEnd();
    
    return { success: true, data: ordersWithDetails };
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
 * 주문 상세 정보 조회
 */
export async function getOrderDetail(
  bookingId: string
): Promise<ActionResult<OrderDetail>> {
  console.group("[getOrderDetail] 주문 상세 조회");
  console.log("bookingId:", bookingId);
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 예약 상세 조회 (vehicles 테이블 조인)
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq("id", bookingId)
      .eq("renter_id", userId)
      .single();
    
    if (bookingError || !booking) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      return { success: false, error: "주문을 찾을 수 없습니다." };
    }
    
    const vehicle = booking.vehicle as Vehicle | undefined;
    
    // 차주 정보 조회
    let owner = { name: "알 수 없음", phone: null };
    if (vehicle) {
      const { data: ownerData } = await supabase
        .from("users")
        .select("name, phone")
        .eq("clerk_id", vehicle.owner_id)
        .single();
      
      if (ownerData) {
        owner = ownerData;
      }
    }
    
    // 대여 일수 계산
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const rentalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const orderDetail: OrderDetail = {
      ...booking,
      vehicle,
      owner,
      rentalDays: Math.max(rentalDays, 1),
    };
    
    console.log("조회 성공");
    console.groupEnd();
    
    return { success: true, data: orderDetail };
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
 * 사용자 통계 정보 조회
 */
export async function getMyProfileStats(): Promise<ActionResult<ProfileStats>> {
  console.group("[getMyProfileStats] 사용자 통계 조회");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 총 주문 수 (결제 완료된 예약)
    const { count: totalOrders, error: ordersError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("renter_id", userId)
      .eq("payment_status", "paid");
    
    if (ordersError) {
      console.error("주문 수 조회 실패:", ordersError);
    }
    
    // 총 결제 금액
    const { data: paidBookings, error: amountError } = await supabase
      .from("bookings")
      .select("total_price")
      .eq("renter_id", userId)
      .eq("payment_status", "paid");
    
    if (amountError) {
      console.error("결제 금액 조회 실패:", amountError);
    }
    
    const totalAmount = paidBookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;
    
    // 진행 중인 예약 수 (pending 또는 approved)
    const { count: activeBookings, error: activeError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("renter_id", userId)
      .in("status", ["pending", "approved"]);
    
    if (activeError) {
      console.error("진행 중 예약 조회 실패:", activeError);
    }
    
    // 등록한 차량 수 (owner인 경우)
    const { count: registeredVehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId);
    
    if (vehiclesError) {
      console.error("차량 수 조회 실패:", vehiclesError);
    }
    
    const stats: ProfileStats = {
      totalOrders: totalOrders || 0,
      totalAmount,
      activeBookings: activeBookings || 0,
      registeredVehicles: registeredVehicles || 0,
    };
    
    console.log("통계 조회 성공:", stats);
    console.groupEnd();
    
    return { success: true, data: stats };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

