/**
 * @file components/payment-button.tsx
 * @description Toss Payments v1 결제창 버튼 컴포넌트
 * 
 * 승인된 예약에 대해 결제를 진행할 수 있는 버튼입니다.
 * Toss Payments v1 결제창 방식으로 결제창을 호출합니다.
 * 
 * v1 결제창 방식:
 * - 서버에서 결제창 URL 생성
 * - 클라이언트에서 결제창 URL로 리다이렉트
 * - 결제 완료 후 successUrl/failUrl로 리다이렉트
 */

"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createPaymentIntent } from "@/actions/payment-actions";

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  disabled?: boolean;
}

export function PaymentButton({ bookingId, amount, disabled }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    console.group("[PaymentButton] 결제 시작 (v1 결제창)");
    
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
      
      // 2. Toss Payments v1 결제창 호출 (form submit 방식)
      // v1 결제창은 form을 submit하여 결제창 페이지로 이동합니다.
      
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
      
      // 결제창 form 생성 및 submit
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://api.tosspayments.com/v1/payments/card";
      form.target = "_self";
      
      // form 필드 추가
      const fields = {
        clientKey,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        amount: paymentData.amount.toString(),
        customerName: paymentData.customerName,
        successUrl: paymentData.successUrl,
        failUrl: paymentData.failUrl,
      };
      
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      console.log("결제창 form 생성 완료, submit 시작");
      
      // form을 body에 추가하고 submit
      document.body.appendChild(form);
      form.submit();
      
      // form은 submit 후 자동으로 제거됨 (페이지 이동)
      
    } catch (err) {
      console.error("결제 요청 실패:", err);
      alert("결제 요청에 실패했습니다. 다시 시도해주세요.");
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

