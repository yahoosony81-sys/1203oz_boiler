/**
 * @file components/payment-button.tsx
 * @description Toss Payments 결제 버튼 컴포넌트
 * 
 * 승인된 예약에 대해 결제를 진행할 수 있는 버튼입니다.
 * Toss Payments SDK를 사용하여 결제창을 호출합니다.
 */

"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

import { Button } from "@/components/ui/button";
import { createPaymentIntent } from "@/actions/payment-actions";

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  disabled?: boolean;
}

// Toss 클라이언트 키 (환경 변수 또는 테스트 키)
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

export function PaymentButton({ bookingId, amount, disabled }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tossPayments, setTossPayments] = useState<TossPaymentsWidgets | null>(null);

  // Toss Payments SDK 초기화
  useEffect(() => {
    async function initToss() {
      try {
        const toss = await loadTossPayments(TOSS_CLIENT_KEY);
        // widgets 사용
        const widgets = toss.widgets({ customerKey: "ANONYMOUS" });
        setTossPayments(widgets);
      } catch (err) {
        console.error("Toss Payments 초기화 실패:", err);
      }
    }
    initToss();
  }, []);

  const handlePayment = async () => {
    setIsLoading(true);
    console.group("[PaymentButton] 결제 시작");
    
    try {
      // 1. 결제 준비 데이터 생성
      const result = await createPaymentIntent(bookingId);
      
      if (!result.success || !result.data) {
        console.error("결제 준비 실패:", result.error);
        alert(result.error || "결제 준비에 실패했습니다.");
        setIsLoading(false);
        console.groupEnd();
        return;
      }
      
      const paymentData = result.data;
      console.log("결제 데이터:", paymentData);
      
      // 2. Toss Payments 결제창 호출
      if (tossPayments) {
        // 금액 설정
        await tossPayments.setAmount({
          currency: "KRW",
          value: paymentData.amount,
        });
        
        // 결제 요청
        await tossPayments.requestPayment({
          orderId: paymentData.orderId,
          orderName: paymentData.orderName,
          customerName: paymentData.customerName,
          successUrl: paymentData.successUrl,
          failUrl: paymentData.failUrl,
        });
      } else {
        // SDK 초기화 실패 시 직접 리다이렉트 (테스트용)
        console.log("SDK 없음 - 테스트 모드로 진행");
        window.location.href = `${paymentData.successUrl}&paymentKey=TEST_KEY&amount=${paymentData.amount}`;
      }
      
    } catch (err) {
      console.error("결제 요청 실패:", err);
      
      // 사용자가 취소한 경우
      if ((err as Error).message?.includes("User cancelled")) {
        console.log("사용자가 결제를 취소함");
      } else {
        alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          결제 처리 중...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {amount.toLocaleString()}원 결제하기
        </>
      )}
    </Button>
  );
}

