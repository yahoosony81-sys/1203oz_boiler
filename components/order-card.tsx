/**
 * @file order-card.tsx
 * @description 주문 카드 컴포넌트
 * 
 * 마이페이지에서 주문 내역(결제 완료된 예약)을 카드 형태로 표시합니다.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, MapPin, CreditCard, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import type { OrderWithDetails } from "@/actions/my-page-actions";

interface OrderCardProps {
  order: OrderWithDetails;
}

export function OrderCard({ order }: OrderCardProps) {
  const vehicle = order.vehicle;
  
  // 대여 일수 계산 (최소 1일 보장 - getOrderDetail과 일관성 유지)
  const startDate = new Date(order.start_date);
  const endDate = new Date(order.end_date);
  const rentalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const days = Math.max(rentalDays, 1);
  
  // 차량 이미지 (첫 번째 이미지 또는 기본 이미지)
  const vehicleImage = vehicle?.images && vehicle.images.length > 0
    ? vehicle.images[0]
    : "/car_og.jpg";
  
  // 주문 번호 (order_id 또는 booking id)
  const orderNumber = order.order_id || order.id.substring(0, 8).toUpperCase();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* 차량 이미지 */}
          <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
            <Image
              src={vehicleImage}
              alt={vehicle?.model || "차량 이미지"}
              fill
              className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
          </div>
          
          {/* 주문 정보 */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle?.model || "차량 정보 없음"}
                  </h3>
                  {vehicle && (
                    <span className="text-sm text-gray-500">
                      {vehicle.year}년식
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  주문번호: {orderNumber}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <StatusBadge status={order.status} type="booking" />
                <StatusBadge status={order.payment_status} type="payment" size="sm" />
              </div>
            </div>
            
            {/* 대여 기간 */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(order.start_date), "yyyy년 MM월 dd일", { locale: ko })} ~{" "}
                {format(new Date(order.end_date), "yyyy년 MM월 dd일", { locale: ko })}
              </span>
              <span className="text-gray-400">({days}일)</span>
            </div>
            
            {/* 위치 정보 */}
            {vehicle?.airport_location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{vehicle.airport_location}</span>
              </div>
            )}
            
            {/* 결제 금액 */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">결제 금액</span>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {order.total_price.toLocaleString()}원
              </span>
            </div>
            
            {/* 주문일시 */}
            <div className="mt-2 text-xs text-gray-400">
              주문일: {format(new Date(order.created_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
            </div>
          </div>
          
          {/* 주문 상세 보기 버튼 */}
          <div className="px-6 pb-6 md:px-0 md:pb-0 md:pt-6 md:pr-6 md:flex md:items-center">
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto"
            >
              <Link href={`/my/orders/${order.id}`}>
                상세 보기
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
