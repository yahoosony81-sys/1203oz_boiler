/**
 * @file payment-actions.ts
 * @description 결제 관련 Server Actions
 * 
 * Toss Payments 연동을 위한 Server Actions를 정의합니다.
 * - createPaymentIntent: 결제 준비
 * - confirmPayment: 결제 승인
 * - cancelPayment: 결제 취소
 * 
 * 환경 변수:
 * - TOSS_CLIENT_KEY: 클라이언트 키 (NEXT_PUBLIC_TOSS_CLIENT_KEY)
 * - TOSS_SECRET_KEY: 시크릿 키
 * 
 * @see https://docs.tosspayments.com/reference
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Toss API Base URL
const TOSS_API_URL = "https://api.tosspayments.com/v1";

// 응답 타입
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// 결제 준비 응답 타입
interface PaymentIntent {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

/**
 * 결제 준비 (결제창 호출 전 데이터 생성)
 */
export async function createPaymentIntent(
  bookingId: string
): Promise<ActionResult<PaymentIntent>> {
  console.group("[createPaymentIntent] 결제 준비 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 예약 정보 조회
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicles (model, plate_number)
      `)
      .eq("id", bookingId)
      .single();
    
    if (bookingError || !booking) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 본인 예약 확인
    if (booking.renter_id !== userId) {
      console.groupEnd();
      return { success: false, error: "결제 권한이 없습니다." };
    }
    
    // 결제 가능 상태 확인
    if (booking.status !== "approved") {
      console.groupEnd();
      return { success: false, error: "승인된 예약만 결제할 수 있습니다." };
    }
    
    if (booking.payment_status === "paid") {
      console.groupEnd();
      return { success: false, error: "이미 결제가 완료된 예약입니다." };
    }
    
    // 주문 ID 생성 (고유값)
    const orderId = `ORDER_${bookingId.replace(/-/g, "").substring(0, 20)}_${Date.now()}`;
    
    // 주문명 생성
    const vehicle = booking.vehicles;
    const orderName = vehicle 
      ? `${vehicle.model} 차량 대여` 
      : "차량 대여";
    
    // order_id 저장
    await supabase
      .from("bookings")
      .update({ order_id: orderId })
      .eq("id", bookingId);
    
    // 결제 정보 반환
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    const paymentIntent: PaymentIntent = {
      orderId,
      orderName,
      amount: booking.total_price,
      customerName: "고객", // TODO: Clerk에서 사용자 이름 가져오기
      successUrl: `${baseUrl}/payments/success?orderId=${orderId}&bookingId=${bookingId}`,
      failUrl: `${baseUrl}/payments/fail?orderId=${orderId}&bookingId=${bookingId}`,
    };
    
    console.log("결제 준비 완료:", paymentIntent);
    console.groupEnd();
    
    return { success: true, data: paymentIntent };
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
 * 결제 승인 (Toss에서 리다이렉트 후 호출)
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<ActionResult<{ bookingId: string }>> {
  console.group("[confirmPayment] 결제 승인 시작");
  console.log("paymentKey:", paymentKey);
  console.log("orderId:", orderId);
  console.log("amount:", amount);
  
  try {
    const supabase = await createClerkSupabaseClient();
    
    // order_id로 예약 조회
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, total_price, payment_status")
      .eq("order_id", orderId)
      .single();
    
    if (bookingError || !booking) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 금액 검증
    if (booking.total_price !== amount) {
      console.error("금액 불일치:", booking.total_price, "!=", amount);
      console.groupEnd();
      return { success: false, error: "결제 금액이 일치하지 않습니다." };
    }
    
    // 이미 결제된 경우
    if (booking.payment_status === "paid") {
      console.log("이미 결제됨");
      console.groupEnd();
      return { success: true, data: { bookingId: booking.id } };
    }
    
    // Toss Payments 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    
    if (!secretKey) {
      // 테스트 모드: API 키가 없으면 바로 성공 처리
      console.log("테스트 모드: Toss API 키 없음, 바로 성공 처리");
      
      await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payment_id: `TEST_${paymentKey}`,
          approved_at: new Date().toISOString(),
        })
        .eq("id", booking.id);
      
      console.log("결제 완료 (테스트 모드)");
      console.groupEnd();
      
      revalidatePath("/bookings/my");
      revalidatePath("/bookings/received");
      
      return { success: true, data: { bookingId: booking.id } };
    }
    
    // 실제 Toss API 호출
    const response = await fetch(`${TOSS_API_URL}/payments/confirm`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("Toss API 에러:", responseData);
      console.groupEnd();
      return { 
        success: false, 
        error: responseData.message || "결제 승인에 실패했습니다." 
      };
    }
    
    // 결제 성공 - DB 업데이트
    await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_id: paymentKey,
        approved_at: new Date().toISOString(),
      })
      .eq("id", booking.id);
    
    console.log("결제 승인 완료");
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    revalidatePath("/bookings/received");
    
    return { success: true, data: { bookingId: booking.id } };
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
 * 결제 실패 처리
 */
export async function handlePaymentFailure(
  orderId: string,
  errorCode: string,
  errorMessage: string
): Promise<ActionResult> {
  console.group("[handlePaymentFailure] 결제 실패 처리");
  console.log("orderId:", orderId);
  console.log("errorCode:", errorCode);
  console.log("errorMessage:", errorMessage);
  
  try {
    const supabase = await createClerkSupabaseClient();
    
    // order_id로 예약 조회
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id")
      .eq("order_id", orderId)
      .single();
    
    if (bookingError || !booking) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    // 결제 실패 상태로 업데이트
    await supabase
      .from("bookings")
      .update({
        payment_status: "failed",
      })
      .eq("id", booking.id);
    
    console.log("결제 실패 처리 완료");
    console.groupEnd();
    
    revalidatePath("/bookings/my");
    
    return { success: true };
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
 * 예약의 결제 정보 조회
 */
export async function getPaymentInfo(
  bookingId: string
): Promise<ActionResult<{ 
  orderId: string | null; 
  paymentId: string | null; 
  paymentStatus: string;
  amount: number;
}>> {
  try {
    const supabase = await createClerkSupabaseClient();
    
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("order_id, payment_id, payment_status, total_price")
      .eq("id", bookingId)
      .single();
    
    if (error || !booking) {
      return { success: false, error: "예약을 찾을 수 없습니다." };
    }
    
    return { 
      success: true, 
      data: {
        orderId: booking.order_id,
        paymentId: booking.payment_id,
        paymentStatus: booking.payment_status,
        amount: booking.total_price,
      }
    };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류" 
    };
  }
}

