/**
 * @file app/payments/success/page.tsx
 * @description 결제 성공 페이지
 * 
 * Toss Payments에서 결제 성공 후 리다이렉트되는 페이지입니다.
 * 결제를 최종 승인하고 성공 메시지를 표시합니다.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { confirmPayment } from "@/actions/payment-actions";

export const dynamic = "force-dynamic";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // URL 파라미터
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const bookingIdParam = searchParams.get("bookingId");

  useEffect(() => {
    async function processPayment() {
      console.group("[PaymentSuccess] 결제 승인 처리");
      console.log("paymentKey:", paymentKey);
      console.log("orderId:", orderId);
      console.log("amount:", amount);
      
      if (!orderId) {
        console.error("필수 파라미터 없음");
        setError("결제 정보가 올바르지 않습니다.");
        setIsProcessing(false);
        console.groupEnd();
        return;
      }
      
      try {
        // 테스트 모드에서는 paymentKey가 없을 수 있음
        const result = await confirmPayment(
          paymentKey || "TEST_KEY",
          orderId,
          parseInt(amount || "0")
        );
        
        if (result.success && result.data) {
          console.log("결제 승인 성공");
          setIsSuccess(true);
          setBookingId(result.data.bookingId);
        } else {
          console.error("결제 승인 실패:", result.error);
          setError(result.error || "결제 처리에 실패했습니다.");
        }
      } catch (err) {
        console.error("예외 발생:", err);
        setError("결제 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
        console.groupEnd();
      }
    }
    
    processPayment();
  }, [paymentKey, orderId, amount]);

  // 처리 중
  if (isProcessing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold mb-2">결제 처리 중...</h2>
            <p className="text-gray-500">잠시만 기다려주세요.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">결제 처리 실패</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.back()}>
                돌아가기
              </Button>
              <Button asChild>
                <Link href="/bookings/my">내 예약 확인</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 성공
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-4" />
          <CardTitle className="text-2xl">결제 완료!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            결제가 성공적으로 완료되었습니다.
            <br />
            예약이 확정되었습니다.
          </p>
          
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">결제 금액</p>
              <p className="text-2xl font-bold text-blue-600">
                {parseInt(amount).toLocaleString()}원
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="w-full">
              <Link href="/bookings/my">예약 내역 확인하기</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

