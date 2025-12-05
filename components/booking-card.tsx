/**
 * @file booking-card.tsx
 * @description 예약 카드 컴포넌트
 * 
 * 예약 정보를 카드 형태로 표시합니다.
 * 이용자용과 차주용 두 가지 모드를 지원합니다.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, Car, MapPin, CreditCard } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import type { Booking, Vehicle } from "@/types/vehicle";

// 차량 정보가 포함된 예약 타입
interface BookingWithVehicle extends Booking {
  vehicles?: Vehicle;
}

interface BookingCardProps {
  booking: BookingWithVehicle;
  mode?: "renter" | "owner"; // 이용자용 / 차주용
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onPay?: (bookingId: string) => void;
  isLoading?: boolean;
}

export function BookingCard({
  booking,
  mode = "renter",
  onApprove,
  onReject,
  onCancel,
  onPay,
  isLoading = false,
}: BookingCardProps) {
  const vehicle = booking.vehicles;
  
  // 예약 일수 계산
  const days = Math.ceil(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-4">
          {/* 차량 이미지 */}
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {vehicle?.images && vehicle.images.length > 0 ? (
                <Image
                  src={vehicle.images[0]}
                  alt={vehicle.model || "차량"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-10 h-10 text-gray-300" />
                </div>
              )}
            </div>

            {/* 차량 정보 */}
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">
                {vehicle?.model || "차량 정보 없음"}
              </h3>
              <p className="text-sm text-gray-500">
                {vehicle?.year}년식 · {vehicle?.plate_number}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{vehicle?.airport_location}</span>
              </div>
            </div>
          </div>

          {/* 상태 배지들 */}
          <div className="flex flex-col gap-2 items-end">
            <StatusBadge status={booking.status} type="booking" />
            {booking.status === "approved" && (
              <StatusBadge status={booking.payment_status} type="payment" size="sm" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* 예약 기간 */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            {format(new Date(booking.start_date), "M월 d일 (EEE)", { locale: ko })} ~{" "}
            {format(new Date(booking.end_date), "M월 d일 (EEE)", { locale: ko })}
          </span>
          <span className="text-gray-400">({days}일)</span>
        </div>

        {/* 금액 */}
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-blue-600">
            {booking.total_price.toLocaleString()}원
          </span>
        </div>

        {/* 예약 상태별 안내 메시지 */}
        {booking.status === "pending" && mode === "renter" && (
          <p className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
            ⏳ 차주의 승인을 기다리고 있습니다.
          </p>
        )}
        {booking.status === "approved" && booking.payment_status === "unpaid" && (
          <p className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
            💳 예약이 승인되었습니다. 결제를 진행해주세요!
          </p>
        )}
        {booking.status === "approved" && booking.payment_status === "paid" && (
          <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
            ✅ 결제가 완료되었습니다. 예약이 확정되었습니다.
          </p>
        )}
        {booking.status === "rejected" && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
            ❌ 예약이 거절되었습니다.
          </p>
        )}
        {booking.status === "cancelled" && (
          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
            🚫 취소된 예약입니다.
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
        {/* 이용자 모드 버튼들 */}
        {mode === "renter" && (
          <>
            {/* 차량 상세 보기 */}
            {vehicle && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/vehicles/${vehicle.id}`}>차량 상세</Link>
              </Button>
            )}

            {/* 결제 버튼 (승인됨 + 미결제 상태) */}
            {booking.status === "approved" && booking.payment_status === "unpaid" && (
              <Button
                size="sm"
                onClick={() => onPay?.(booking.id)}
                disabled={isLoading}
              >
                결제하기
              </Button>
            )}

            {/* 예약 취소 버튼 (대기중 또는 승인됨 + 미결제) */}
            {(booking.status === "pending" ||
              (booking.status === "approved" && booking.payment_status === "unpaid")) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel?.(booking.id)}
                disabled={isLoading}
              >
                예약 취소
              </Button>
            )}
          </>
        )}

        {/* 차주 모드 버튼들 */}
        {mode === "owner" && (
          <>
            {/* 승인/거절 버튼 (대기중 상태) */}
            {booking.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(booking.id)}
                  disabled={isLoading}
                >
                  승인
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject?.(booking.id)}
                  disabled={isLoading}
                >
                  거절
                </Button>
              </>
            )}

            {/* 차량 상세 보기 */}
            {vehicle && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/vehicles/${vehicle.id}`}>차량 상세</Link>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

