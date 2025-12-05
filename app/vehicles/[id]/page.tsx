/**
 * @file app/vehicles/[id]/page.tsx
 * @description 차량 상세 페이지
 * 
 * 차량의 상세 정보를 표시하고 예약을 신청할 수 있는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 차량 이미지 갤러리
 * 2. 차량 기본 정보 표시
 * 3. 예약 날짜 선택
 * 4. 총 금액 계산
 * 5. 예약 신청
 */

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { 
  Car, MapPin, Calendar, DollarSign, 
  ChevronLeft, ChevronRight, Check, AlertCircle 
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRangePicker } from "@/components/date-range-picker";
import { getVehicleById } from "@/actions/vehicle-actions";
import { createBooking } from "@/actions/booking-actions";
import type { Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  // 차량 상태
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 이미지 갤러리 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 예약 상태
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // 차량 정보 조회
  useEffect(() => {
    async function fetchVehicle() {
      console.group("[VehicleDetailPage] 차량 조회");
      setIsLoading(true);
      
      try {
        const result = await getVehicleById(id);
        
        if (result.success && result.data) {
          console.log("조회 성공:", result.data);
          setVehicle(result.data);
        } else {
          console.error("조회 실패:", result.error);
          setError(result.error || "차량을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("예외 발생:", err);
        setError("오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    }
    
    fetchVehicle();
  }, [id]);

  // 총 금액 계산
  const calculateTotalPrice = () => {
    if (!vehicle || !dateRange?.from || !dateRange?.to) return 0;
    
    const days = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
    return vehicle.price_per_day * Math.max(days, 1);
  };

  // 예약 일수 계산
  const calculateDays = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    return Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // 예약 신청
  const handleBooking = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    if (!dateRange?.from || !dateRange?.to) {
      setBookingError("예약 날짜를 선택해주세요.");
      return;
    }
    
    if (vehicle?.owner_id === user?.id) {
      setBookingError("자신의 차량은 예약할 수 없습니다.");
      return;
    }
    
    setIsBooking(true);
    setBookingError(null);
    
    console.group("[VehicleDetailPage] 예약 신청");
    
    try {
      const result = await createBooking({
        vehicle_id: id,
        start_date: dateRange.from,
        end_date: dateRange.to,
      });
      
      if (result.success) {
        console.log("예약 성공:", result.data);
        setBookingSuccess(true);
      } else {
        console.error("예약 실패:", result.error);
        setBookingError(result.error || "예약에 실패했습니다.");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      setBookingError("오류가 발생했습니다.");
    } finally {
      setIsBooking(false);
      console.groupEnd();
    }
  };

  // 이미지 네비게이션
  const nextImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => 
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 에러 상태
  if (error || !vehicle) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">차량을 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/vehicles")}>
          차량 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  // 예약 성공 상태
  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">예약 신청 완료!</h1>
        <p className="text-gray-600 mb-6">
          차주의 승인을 기다려주세요.
          <br />
          승인되면 결제를 진행할 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/vehicles")}>
            다른 차량 보기
          </Button>
          <Button onClick={() => router.push("/bookings/my")}>
            내 예약 확인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 차량 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 이미지 갤러리 */}
          <div className="relative aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <Image
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.model} - ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
                
                {/* 이미지 네비게이션 */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* 이미지 인디케이터 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {vehicle.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-24 h-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* 차량 기본 정보 */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{vehicle.model}</h1>
            <p className="text-gray-500">
              {vehicle.year}년식 · {vehicle.plate_number}
            </p>
          </div>

          {/* 상세 설명 */}
          {vehicle.description && (
            <Card>
              <CardHeader>
                <CardTitle>차량 설명</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 위치 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                픽업 위치
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{vehicle.airport_location}</p>
              {vehicle.parking_location && (
                <p className="text-gray-600">{vehicle.parking_location}</p>
              )}
            </CardContent>
          </Card>

          {/* 이용 가능 기간 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                이용 가능 기간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {format(new Date(vehicle.available_from), "PPP", { locale: ko })} ~{" "}
                {format(new Date(vehicle.available_until), "PPP", { locale: ko })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 예약 박스 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  예약하기
                </span>
              </CardTitle>
              <p className="text-3xl font-bold text-blue-600">
                {vehicle.price_per_day.toLocaleString()}원
                <span className="text-base font-normal text-gray-500">/일</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 날짜 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">이용 기간</label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                  placeholder="날짜를 선택하세요"
                />
              </div>

              {/* 금액 계산 */}
              {dateRange?.from && dateRange?.to && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {vehicle.price_per_day.toLocaleString()}원 × {calculateDays()}일
                    </span>
                    <span>{calculateTotalPrice().toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>총 금액</span>
                    <span className="text-blue-600">
                      {calculateTotalPrice().toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              {/* 약관 동의 */}
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onCheckedChange={(checked) => setTermsAgreed(checked === true)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                  <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    이용약관
                  </Link>
                  {" 및 "}
                  <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                    개인정보처리방침
                  </Link>
                  에 동의합니다.
                </label>
              </div>

              {/* 에러 메시지 */}
              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {bookingError}
                </div>
              )}

              {/* 예약 버튼 */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleBooking}
                disabled={isBooking || !dateRange?.from || !dateRange?.to || !termsAgreed}
              >
                {!isLoaded ? (
                  "로딩 중..."
                ) : !isSignedIn ? (
                  "로그인하고 예약하기"
                ) : isBooking ? (
                  "예약 중..."
                ) : !termsAgreed ? (
                  "약관에 동의해주세요"
                ) : (
                  "예약 신청하기"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                예약 신청 후 차주의 승인이 필요합니다.
                <br />
                승인 후 결제를 진행할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
