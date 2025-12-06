/**
 * @file app/my/orders/[id]/page.tsx
 * @description 주문 상세 페이지
 * 
 * 주문(결제 완료된 예약)의 상세 정보를 표시하는 페이지입니다.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Car, 
  Phone,
  Loader2,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { getOrderDetail, type OrderDetail } from "@/actions/my-page-actions";

export const dynamic = "force-dynamic";

function OrderDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { isLoaded, isSignedIn } = useUser();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = params.id as string;

  // 주문 상세 조회
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !orderId) return;
    
    async function fetchOrderDetail() {
      console.group("[OrderDetailPage] 주문 상세 조회");
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getOrderDetail(orderId);
        
        if (result.success && result.data) {
          console.log("조회 성공");
          setOrder(result.data);
        } else {
          console.error("조회 실패:", result.error);
          setError(result.error || "주문을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("예외 발생:", err);
        setError("오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    }
    
    fetchOrderDetail();
  }, [isLoaded, isSignedIn, orderId]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <Button onClick={() => router.push("/sign-in")}>로그인</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error || "주문을 찾을 수 없습니다."}</p>
            <Button onClick={() => router.push("/my")}>마이페이지로 이동</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = order.vehicle;
  const owner = order.owner;
  const orderNumber = order.order_id || order.id.substring(0, 8).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
          <p className="text-sm text-gray-500 mt-1">주문번호: {orderNumber}</p>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">주문일시</p>
              <p className="font-medium">
                {format(new Date(order.created_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
              </p>
            </div>
            {order.approved_at && (
              <div>
                <p className="text-sm text-gray-500">결제일시</p>
                <p className="font-medium">
                  {format(new Date(order.approved_at), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} type="booking" />
            <StatusBadge status={order.payment_status} type="payment" />
          </div>
        </CardContent>
      </Card>

      {/* 차량 정보 */}
      {vehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              차량 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 차량 이미지 갤러리 */}
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicle.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={`${vehicle.model} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src="/car_og.jpg"
                    alt={vehicle.model}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* 차량 상세 정보 */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">차종</p>
                  <p className="font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">연식</p>
                  <p className="font-medium">{vehicle.year}년식</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">번호판</p>
                  <p className="font-medium">{vehicle.plate_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">공항 위치</p>
                  <p className="font-medium">{vehicle.airport_location}</p>
                </div>
                {vehicle.parking_location && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">주차 위치</p>
                    <p className="font-medium">{vehicle.parking_location}</p>
                  </div>
                )}
                {vehicle.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">설명</p>
                    <p className="font-medium">{vehicle.description}</p>
                  </div>
                )}
              </div>
              
              <Button variant="outline" asChild className="w-full">
                <Link href={`/vehicles/${vehicle.id}`}>차량 상세 보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 예약 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            예약 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">대여 시작</p>
              <p className="font-medium">
                {format(new Date(order.start_date), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">대여 종료</p>
              <p className="font-medium">
                {format(new Date(order.end_date), "yyyy년 MM월 dd일 HH:mm", { locale: ko })}
              </p>
            </div>
            {order.rentalDays && (
              <div>
                <p className="text-sm text-gray-500 mb-1">대여 일수</p>
                <p className="font-medium">{order.rentalDays}일</p>
              </div>
            )}
          </div>
          
          {order.pickup_location && (
            <div className="flex items-start gap-2 pt-4 border-t">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">픽업 위치</p>
                <p className="font-medium">{order.pickup_location}</p>
              </div>
            </div>
          )}
          
          {order.return_location && (
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">반납 위치</p>
                <p className="font-medium">{order.return_location}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 결제 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">결제 금액</span>
            <span className="text-2xl font-bold text-blue-600">
              {order.total_price.toLocaleString()}원
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">결제 상태</p>
              <StatusBadge status={order.payment_status} type="payment" />
            </div>
            <div>
              <p className="text-gray-500">결제 수단</p>
              <p className="font-medium">Toss Payments</p>
            </div>
            {order.payment_id && (
              <div className="col-span-2">
                <p className="text-gray-500">결제 ID</p>
                <p className="font-mono text-xs">{order.payment_id}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 차주 정보 */}
      {owner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              차주 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">이름</p>
                <p className="font-medium">{owner.name}</p>
              </div>
              {owner.phone && (
                <div>
                  <p className="text-sm text-gray-500">연락처</p>
                  <p className="font-medium">{owner.phone}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.push("/my")} className="flex-1">
          마이페이지로
        </Button>
        {vehicle && (
          <Button asChild className="flex-1">
            <Link href={`/vehicles/${vehicle.id}`}>차량 상세 보기</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

