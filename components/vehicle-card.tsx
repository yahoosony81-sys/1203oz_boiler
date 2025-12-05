/**
 * @file vehicle-card.tsx
 * @description 차량 카드 컴포넌트
 * 
 * 차량 정보를 카드 형태로 표시합니다.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Car } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types/vehicle";

// 예약 현황 summary 타입
interface BookingSummary {
  pending: number;
  approved: number;
  completed: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  showActions?: boolean;
  bookingSummary?: BookingSummary;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, status: "active" | "unavailable") => void;
}

export function VehicleCard({
  vehicle,
  showActions = false,
  bookingSummary,
  onEdit,
  onDelete,
  onToggleStatus,
}: VehicleCardProps) {
  const statusColor = {
    active: "bg-green-100 text-green-700",
    reserved: "bg-yellow-100 text-yellow-700",
    unavailable: "bg-gray-100 text-gray-700",
  };

  const statusText = {
    active: "이용 가능",
    reserved: "예약 중",
    unavailable: "비활성",
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* 이미지 */}
      <div className="relative aspect-[16/10] bg-gray-100">
        {vehicle.images && vehicle.images.length > 0 ? (
          <Image
            src={vehicle.images[0]}
            alt={vehicle.model}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-300" />
          </div>
        )}
        
        {/* 상태 배지 */}
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            statusColor[vehicle.status]
          }`}
        >
          {statusText[vehicle.status]}
        </span>
      </div>

      <CardContent className="p-4">
        {/* 차량 정보 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{vehicle.model}</h3>
            <span className="text-blue-600 font-bold">
              {vehicle.price_per_day.toLocaleString()}원/일
            </span>
          </div>
          
          <p className="text-sm text-gray-500">
            {vehicle.year}년식 · {vehicle.plate_number}
          </p>
          
          {/* 위치 */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{vehicle.airport_location}</span>
          </div>
          
          {/* 이용 가능 기간 */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(vehicle.available_from), "M/d", { locale: ko })} ~{" "}
              {format(new Date(vehicle.available_until), "M/d", { locale: ko })}
            </span>
          </div>

          {/* 예약 현황 (showActions 모드에서만 표시) */}
          {showActions && bookingSummary && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500 mb-2">예약 현황</p>
              <div className="flex gap-3 text-xs">
                {bookingSummary.pending > 0 && (
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    대기 {bookingSummary.pending}
                  </span>
                )}
                {bookingSummary.approved > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    승인 {bookingSummary.approved}
                  </span>
                )}
                {bookingSummary.completed > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    완료 {bookingSummary.completed}
                  </span>
                )}
                {bookingSummary.pending === 0 && 
                 bookingSummary.approved === 0 && 
                 bookingSummary.completed === 0 && (
                  <span className="text-gray-400">예약 없음</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {showActions ? (
          // 관리 모드 버튼들
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit?.(vehicle.id)}
            >
              수정
            </Button>
            <Button
              variant={vehicle.status === "active" ? "secondary" : "default"}
              size="sm"
              className="flex-1"
              onClick={() =>
                onToggleStatus?.(
                  vehicle.id,
                  vehicle.status === "active" ? "unavailable" : "active"
                )
              }
            >
              {vehicle.status === "active" ? "비활성화" : "활성화"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(vehicle.id)}
            >
              삭제
            </Button>
          </>
        ) : (
          // 일반 모드 버튼
          <Button asChild className="w-full">
            <Link href={`/vehicles/${vehicle.id}`}>상세 보기</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

