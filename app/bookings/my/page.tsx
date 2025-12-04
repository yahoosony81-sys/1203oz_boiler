/**
 * @file app/bookings/my/page.tsx
 * @description 내 예약 관리 페이지 (이용자)
 * 
 * 이용자가 신청한 예약 목록을 보고 관리하는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 내가 신청한 예약 목록 조회
 * 2. 예약 상태 표시 (대기/승인/거절/완료/취소)
 * 3. 예약 취소
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - actions/bookings: 예약 조회 및 취소
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getMyBookings, cancelBooking } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Calendar, Car, DollarSign, Loader2, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { BookingWithDetails } from '@/types/database';

// Clerk Provider 사용으로 인한 동적 렌더링 강제
export const dynamic = 'force-dynamic';

// 예약 상태 배지 컴포넌트
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { label: '대기 중', className: 'bg-yellow-100 text-yellow-800' },
    approved: { label: '승인됨', className: 'bg-green-100 text-green-800' },
    rejected: { label: '거절됨', className: 'bg-red-100 text-red-800' },
    completed: { label: '완료', className: 'bg-blue-100 text-blue-800' },
    cancelled: { label: '취소됨', className: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.group('📋 MyBookingsPage Render');
  console.log('User loaded:', isLoaded);
  console.log('User ID:', user?.id);
  console.log('Bookings count:', bookings.length);
  console.groupEnd();

  // 로그인 체크
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  // 예약 목록 불러오기
  useEffect(() => {
    const fetchBookings = async () => {
      console.group('🔄 Fetching bookings...');
      setIsLoading(true);
      setError(null);

      try {
        const result = await getMyBookings();

        if (result.success && result.data) {
          console.log('✅ Bookings fetched:', result.data.length);
          setBookings(result.data);
        } else {
          console.error('❌ Failed to fetch bookings:', result.error);
          setError(result.error || '예약을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('❌ Error fetching bookings:', err);
        setError('예약을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // 예약 취소 핸들러
  const handleCancel = async (bookingId: string, vehicleModel: string) => {
    if (!confirm(`"${vehicleModel}" 예약을 정말 취소하시겠습니까?`)) {
      return;
    }

    console.group(`🚫 Cancelling booking: ${bookingId}`);

    try {
      const result = await cancelBooking(bookingId);

      if (result.success) {
        console.log('✅ Booking cancelled');
        alert(result.message || '예약이 취소되었습니다.');
        // 목록에서 상태 업데이트
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      } else {
        console.error('❌ Cancel failed:', result.error);
        alert(result.error || '예약 취소에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ Error cancelling booking:', err);
      alert('예약 취소 중 오류가 발생했습니다.');
    } finally {
      console.groupEnd();
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">내 예약</h1>
        <p className="text-gray-600">
          신청한 예약 목록과 상태를 확인하세요.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        /* 예약 없음 */
        <div className="text-center py-12">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">예약 내역이 없습니다</h3>
          <p className="text-gray-600 mb-6">
            원하는 차량을 검색하고 예약해보세요!
          </p>
          <Link href="/vehicles">
            <Button>차량 검색하기</Button>
          </Link>
        </div>
      ) : (
        /* 예약 목록 */
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* 차량 이미지 */}
                <div className="flex-shrink-0">
                  <div className="relative w-full md:w-48 h-36 bg-gray-200 rounded-lg overflow-hidden">
                    {booking.vehicle.images && booking.vehicle.images.length > 0 ? (
                      <Image
                        src={booking.vehicle.images[0]}
                        alt={booking.vehicle.model}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* 예약 정보 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Link 
                        href={`/vehicles/${booking.vehicle_id}`}
                        className="text-xl font-semibold hover:text-blue-600"
                      >
                        {booking.vehicle.model}
                      </Link>
                      <p className="text-gray-600 text-sm">
                        {booking.vehicle.year}년 · {booking.vehicle.plate_number}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <div>시작: {formatDate(booking.start_date)}</div>
                          <div>종료: {formatDate(booking.end_date)}</div>
                        </div>
                      </div>
                      {booking.pickup_location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          픽업: {booking.pickup_location}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        총 금액: <span className="font-semibold ml-1">{booking.total_price.toLocaleString()}원</span>
                      </div>
                      <div className="text-gray-600">
                        신청일: {formatDate(booking.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancel(booking.id, booking.vehicle.model)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        예약 취소
                      </Button>
                    )}
                    {booking.status === 'approved' && (
                      <div className="text-sm text-green-600">
                        ✓ 예약이 승인되었습니다. 차주에게 연락하세요.
                      </div>
                    )}
                    {booking.status === 'rejected' && (
                      <div className="text-sm text-red-600">
                        예약이 거절되었습니다. 다른 차량을 검색해보세요.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

