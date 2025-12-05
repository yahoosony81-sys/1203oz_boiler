/**
 * @file app/api/webhooks/toss/route.ts
 * @description Toss Payments Webhook 처리
 * 
 * Toss Payments에서 결제 상태 변경 시 호출되는 webhook입니다.
 * 중복 호출을 방지하기 위한 idempotency 처리가 포함되어 있습니다.
 * 
 * Webhook 이벤트:
 * - DONE: 결제 완료
 * - CANCELED: 결제 취소
 * - PARTIAL_CANCELED: 부분 취소
 * - WAITING_FOR_DEPOSIT: 입금 대기
 * - EXPIRED: 만료
 * - ABORTED: 중단
 * 
 * @see https://docs.tosspayments.com/reference/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import crypto from "crypto";

// Webhook Secret (Toss에서 제공)
const WEBHOOK_SECRET = process.env.TOSS_WEBHOOK_SECRET;

// Webhook 이벤트 타입
type WebhookEventType = 
  | "DONE" 
  | "CANCELED" 
  | "PARTIAL_CANCELED" 
  | "WAITING_FOR_DEPOSIT" 
  | "EXPIRED" 
  | "ABORTED";

interface WebhookPayload {
  eventType: string;
  createdAt: string;
  data: {
    paymentKey: string;
    orderId: string;
    status: string;
    transactionKey?: string;
    approvedAt?: string;
    cancels?: Array<{
      cancelReason: string;
      canceledAt: string;
      cancelAmount: number;
    }>;
  };
}

// 이벤트 처리 기록 (메모리 캐시 - 프로덕션에서는 Redis 권장)
const processedEvents = new Map<string, number>();
const EVENT_TTL = 60 * 60 * 1000; // 1시간

/**
 * Webhook 서명 검증
 */
function verifySignature(body: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    console.log("[Webhook] 서명 검증 스킵 (시크릿 또는 서명 없음)");
    return true; // 개발 모드에서는 스킵
  }
  
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("base64");
  
  return signature === expectedSignature;
}

/**
 * Idempotency 체크 - 중복 이벤트 방지
 */
function isProcessed(eventKey: string): boolean {
  const now = Date.now();
  
  // 오래된 이벤트 정리
  for (const [key, timestamp] of processedEvents.entries()) {
    if (now - timestamp > EVENT_TTL) {
      processedEvents.delete(key);
    }
  }
  
  if (processedEvents.has(eventKey)) {
    return true;
  }
  
  processedEvents.set(eventKey, now);
  return false;
}

/**
 * POST /api/webhooks/toss
 * Toss Payments Webhook 처리
 */
export async function POST(request: NextRequest) {
  console.group("[Toss Webhook] 이벤트 수신");
  
  try {
    const body = await request.text();
    const signature = request.headers.get("x-tosspayments-signature");
    
    // 1. 서명 검증
    if (!verifySignature(body, signature)) {
      console.error("서명 검증 실패");
      console.groupEnd();
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    // 2. Payload 파싱
    const payload: WebhookPayload = JSON.parse(body);
    console.log("이벤트 타입:", payload.eventType);
    console.log("주문 ID:", payload.data.orderId);
    console.log("결제 키:", payload.data.paymentKey);
    
    // 3. Idempotency 체크
    const eventKey = `${payload.data.paymentKey}_${payload.eventType}_${payload.createdAt}`;
    if (isProcessed(eventKey)) {
      console.log("중복 이벤트 - 스킵");
      console.groupEnd();
      return NextResponse.json({ message: "Already processed" });
    }
    
    // 4. Supabase 클라이언트 (Service Role)
    const supabase = createServiceRoleClient();
    
    // 5. 이벤트 타입별 처리
    const { orderId, paymentKey, status } = payload.data;
    
    // order_id로 예약 조회
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, payment_status")
      .eq("order_id", orderId)
      .single();
    
    if (bookingError || !booking) {
      console.error("예약 조회 실패:", bookingError);
      console.groupEnd();
      // 예약을 찾지 못해도 200 반환 (Toss 재시도 방지)
      return NextResponse.json({ message: "Booking not found" });
    }
    
    switch (payload.eventType as WebhookEventType) {
      case "DONE":
        // 결제 완료
        if (booking.payment_status !== "paid") {
          await supabase
            .from("bookings")
            .update({
              payment_status: "paid",
              payment_id: paymentKey,
              approved_at: payload.data.approvedAt || new Date().toISOString(),
            })
            .eq("id", booking.id);
          console.log("결제 완료 처리됨");
        }
        break;
        
      case "CANCELED":
      case "PARTIAL_CANCELED":
        // 결제 취소
        await supabase
          .from("bookings")
          .update({
            payment_status: "failed",
            status: "cancelled",
          })
          .eq("id", booking.id);
        console.log("결제 취소 처리됨");
        break;
        
      case "EXPIRED":
      case "ABORTED":
        // 결제 만료/중단
        await supabase
          .from("bookings")
          .update({
            payment_status: "failed",
          })
          .eq("id", booking.id);
        console.log("결제 실패 처리됨");
        break;
        
      case "WAITING_FOR_DEPOSIT":
        // 입금 대기 (가상계좌 등)
        console.log("입금 대기 상태 - 별도 처리 없음");
        break;
        
      default:
        console.log("알 수 없는 이벤트 타입:", payload.eventType);
    }
    
    console.log("Webhook 처리 완료");
    console.groupEnd();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Webhook 처리 오류:", error);
    console.groupEnd();
    
    // 오류가 발생해도 200 반환 (Toss 재시도 방지)
    return NextResponse.json({ 
      error: "Internal error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}

/**
 * GET /api/webhooks/toss
 * Webhook 상태 확인용 (테스트)
 */
export async function GET() {
  return NextResponse.json({ 
    status: "active",
    message: "Toss Payments Webhook endpoint is ready",
  });
}

