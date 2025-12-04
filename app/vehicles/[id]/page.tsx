/**
 * @file app/vehicles/[id]/page.tsx
 * @description 차량 상세 페이지
 * 
 * 차량의 상세 정보를 보고 예약 신청할 수 있는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 차량 상세 정보 표시
 * 2. 이미지 갤러리
 * 3. 예약 신청 폼
 * 4. 총 금액 계산
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - actions/vehicles: 차량 조회
 * - actions/bookings: 예약 생성
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getVehicle } from '@/actions/vehicles';
import { createBooking } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { VehicleWithOwner } from '@/types/database';

// Clerk Provider 사용으로 인한 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useUser();
  const [vehicleId, setVehicleId] = useState<string>('');
  const [vehicle, setVehicle] = useState<VehicleWithOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 이미지 갤러리 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 예약 폼 상태
  const [bookingForm, setBookingForm] = useState({
    start_date: '',
    end_date: '',
    pickup_location: '',
    return_location: '',
  });

  // 총 금액 계산
  const [totalPrice, setTotalPrice] = useState(0);
  const [days, setDays] = useState(0);

  // params 언래핑
  useEffect(() => {
    params.then((resolvedParams) => {
      setVehicleId(resolvedParams.id);
    });
  }, [params]);

  console.group('🚗 VehicleDetailPage Render');
  console.log('Vehicle ID:', vehicleId);
  console.log('Vehicle:', vehicle?.model);
  console.log('User:', user?.id);
  console.groupEnd();

  // 차량 정보 불러오기
  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      console.group('🔄 Fetching vehicle...');
      setIsLoading(true);
      setError(null);

      try {
        const result = await getVehicle(vehicleId);

        if (result.success && result.data) {
          console.log('✅ Vehicle fetched');
          setVehicle(result.data);
        } else {
          console.error('❌ Failed to fetch vehicle:', result.error);
          setError(result.error || '차량을 불러올 수 없습니다.');
        }
      } catch (err) {
        console.error('❌ Error fetching vehicle:', err);
        setError('차량을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  // 총 금액 계산
  useEffect(() => {
    if (!bookingForm.start_date || !bookingForm.end_date || !vehicle) {
      setTotalPrice(0);
      setDays(0);
      return;
    }

    const start = new Date(bookingForm.start_date);
    const end = new Date(bookingForm.end_date);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setDays(diffDays);
      setTotalPrice(diffDays * vehicle.price_per_day);
    } else {
      setDays(0);
      setTotalPrice(0);
    }
  }, [bookingForm.start_date, bookingForm.end_date, vehicle]);

  // 예약 신청 핸들러
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/sign-in');
      return;
    }

    console.group('📝 handleBookingSubmit');
    setIsSubmitting(true);

    try {
      const result = await createBooking({
        vehicle_id: vehicleId,
        start_date: new Date(bookingForm.start_date),
        end_date: new Date(bookingForm.end_date),
        pickup_location: bookingForm.pickup_location || undefined,
        return_location: bookingForm.return_location || undefined,
      });

      if (result.success) {
        console.log('✅ Booking created');
        alert(result.message || '예약 신청이 완료되었습니다!');
        router.push('/bookings/my');
      } else {
        console.error('❌ Booking failed:', result.error);
        alert(result.error || '예약 신청에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ Error in handleBookingSubmit:', err);
      alert('예약 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      console.groupEnd();
    }
  };

  // 이미지 네비게이션
  const handlePrevImage = () => {
    if (!vehicle?.images) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!vehicle?.images) return;
    setCurrentImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">차량을 찾을 수 없습니다</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link href="/vehicles">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === vehicle.owner_id;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* 뒤로 가기 */}
      <Link 
        href="/vehicles" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 이미지 갤러리 */}
        <div>
          {/* 메인 이미지 */}
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
            {vehicle.images && vehicle.images.length > 0 ? (
              <>
                <Image
                  src={vehicle.images[currentImageIndex]}
                  alt={`${vehicle.model} - ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {vehicle.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Car className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* 썸네일 */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {vehicle.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* 차량 상세 정보 */}
          <div className="mt-6 bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">차량 정보</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">차종</span>
                <span className="font-semibold">{vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">연식</span>
                <span className="font-semibold">{vehicle.year}년</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">번호판</span>
                <span className="font-semibold">{vehicle.plate_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">이용 가능 기간</span>
                <span className="font-semibold">
                  {formatDate(vehicle.available_from)} ~ {formatDate(vehicle.available_until)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">공항</span>
                <span className="font-semibold">{vehicle.airport_location}</span>
              </div>
              {vehicle.parking_location && (
                <div className="flex justify-between">
                  <span className="text-gray-600">주차 위치</span>
                  <span className="font-semibold">{vehicle.parking_location}</span>
                </div>
              )}
            </div>

            {vehicle.description && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">상세 설명</h3>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* 소유자 정보 */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">차주 정보</h3>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-600" />
                <span>{vehicle.owner.name}</span>
                {vehicle.owner.is_verified && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    인증됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 예약 폼 */}
        <div>
          <div className="bg-white p-6 rounded-lg border sticky top-4">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                {vehicle.price_per_day.toLocaleString()}원
              </span>
              <span className="text-gray-600">/ 일</span>
            </div>

            {isOwner ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">본인의 차량입니다</p>
                <Link href="/vehicles/my">
                  <Button variant="outline">
                    내 차량 관리
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="start_date">이용 시작일 *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={bookingForm.start_date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, start_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">이용 종료일 *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={bookingForm.end_date}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, end_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pickup_location">픽업 위치</Label>
                  <Input
                    id="pickup_location"
                    type="text"
                    placeholder="예: 제주공항 1층 도착 로비"
                    value={bookingForm.pickup_location}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, pickup_location: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="return_location">반납 위치</Label>
                  <Input
                    id="return_location"
                    type="text"
                    placeholder="예: 제주공항 주차장 A구역"
                    value={bookingForm.return_location}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, return_location: e.target.value })
                    }
                  />
                </div>

                {/* 총 금액 표시 */}
                {days > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">이용 일수</span>
                      <span className="font-semibold">{days}일</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">총 금액</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                )}

                {/* 약관 동의 */}
                <div className="text-xs text-gray-600">
                  예약 신청 시{' '}
                  <Link href="/terms/rental-agreement" className="text-blue-600 underline">
                    대여 동의서
                  </Link>
                  에 동의한 것으로 간주됩니다.
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || days <= 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      예약 신청 중...
                    </>
                  ) : (
                    '예약 신청하기'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

