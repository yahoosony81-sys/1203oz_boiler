/**
 * @file app/payments/fail/page.tsx
 * @description 결제 실패 페이지 (Toss Payments v1)
 * 
 * Toss Payments v1 결제창에서 결제 실패 시 리다이렉트되는 페이지입니다.
 * 요구사항: DB 변경 없이 안내 메시지만 표시합니다.
 */

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

// 에러 코드별 메시지
const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제가 취소되었습니다.",
  PAY_PROCESS_ABORTED: "결제가 중단되었습니다.",
  REJECT_CARD_COMPANY: "카드사에서 결제가 거절되었습니다.",
  INVALID_CARD_NUMBER: "잘못된 카드 번호입니다.",
  EXCEED_MAX_DAILY_PAYMENT_COUNT: "일일 결제 한도를 초과했습니다.",
  EXCEED_MAX_PAYMENT_AMOUNT: "결제 금액 한도를 초과했습니다.",
  NOT_AVAILABLE_PAYMENT: "현재 사용할 수 없는 결제 수단입니다.",
  INVALID_STOPPED_CARD: "정지된 카드입니다.",
  EXCEED_MAX_AMOUNT: "한도 초과",
  NOT_FOUND_PAYMENT_SESSION: "결제 세션이 만료되었습니다.",
};

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL 파라미터
  const bookingId = searchParams.get("bookingId");
  const code = searchParams.get("code") || "UNKNOWN";
  const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";

  // 결제 실패 처리: DB 변경 없이 안내 메시지만 표시 (요구사항)

  // 에러 메시지 결정
  const errorMessage = ERROR_MESSAGES[code] || message;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="w-20 h-20 mx-auto text-red-500 mb-4" />
          <CardTitle className="text-2xl">결제 실패</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{errorMessage}</p>
          
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-500 mb-1">오류 코드</p>
            <p className="text-sm font-mono">{code}</p>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            {bookingId && (
              <Button 
                className="w-full"
                onClick={() => router.push(`/bookings/my`)}
              >
                다시 결제하기
              </Button>
            )}
            <Button variant="outline" asChild className="w-full">
              <Link href="/bookings/my">예약 내역으로 돌아가기</Link>
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}

