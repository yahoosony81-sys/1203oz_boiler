/**
 * @file status-badge.tsx
 * @description 상태 배지 컴포넌트
 * 
 * 예약 상태, 결제 상태 등을 시각적으로 표시하는 배지 컴포넌트입니다.
 */

"use client";

import { cn } from "@/lib/utils";
import type { BookingStatus, PaymentStatus, VehicleStatus } from "@/types/vehicle";

// 예약 상태 설정
const BOOKING_STATUS_CONFIG = {
  pending: {
    label: "승인 대기",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  approved: {
    label: "승인됨",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  rejected: {
    label: "거절됨",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  completed: {
    label: "완료",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "취소됨",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
} as const;

// 결제 상태 설정
const PAYMENT_STATUS_CONFIG = {
  unpaid: {
    label: "미결제",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  paid: {
    label: "결제완료",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  failed: {
    label: "결제실패",
    className: "bg-red-100 text-red-800 border-red-200",
  },
} as const;

// 차량 상태 설정
const VEHICLE_STATUS_CONFIG = {
  active: {
    label: "이용 가능",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  reserved: {
    label: "예약 중",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  unavailable: {
    label: "비활성",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
} as const;

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | VehicleStatus;
  type?: "booking" | "payment" | "vehicle";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusBadge({
  status,
  type = "booking",
  size = "md",
  className,
}: StatusBadgeProps) {
  // 상태 설정 선택
  const config = (() => {
    switch (type) {
      case "payment":
        return PAYMENT_STATUS_CONFIG[status as PaymentStatus];
      case "vehicle":
        return VEHICLE_STATUS_CONFIG[status as VehicleStatus];
      case "booking":
      default:
        return BOOKING_STATUS_CONFIG[status as BookingStatus];
    }
  })();

  if (!config) {
    return null;
  }

  // 크기별 스타일
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {config.label}
    </span>
  );
}

