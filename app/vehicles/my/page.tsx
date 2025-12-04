/**
 * @file app/vehicles/my/page.tsx
 * @description 내 차량 관리 페이지
 * 
 * 차주가 등록한 차량 목록을 보고 관리하는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 내가 등록한 차량 목록 조회
 * 2. 차량 상태 토글 (활성화/비활성화)
 * 3. 차량 삭제
 * 4. 새 차량 등록 버튼
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - actions/vehicles: Server Actions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getMyVehicles, deleteVehicle, updateVehicleStatus } from '@/actions/vehicles';
import { Button } from '@/components/ui/button';
import { Plus, Car, Loader2, Calendar, DollarSign, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/types/database';

// Clerk Provider 사용으로 인한 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export default function MyVehiclesPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.group('🚗 MyVehiclesPage Render');
  console.log('User loaded:', isLoaded);
  console.log('User ID:', user?.id);
  console.log('Vehicles count:', vehicles.length);
  console.groupEnd();

  // 차량 목록 불러오기
  useEffect(() => {
    // 로그인 체크
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }
    const fetchVehicles = async () => {
      console.group('🔄 Fetching vehicles...');
      setIsLoading(true);
      setError(null);

      try {
        const result = await getMyVehicles();

        if (result.success && result.data) {
          console.log('✅ Vehicles fetched:', result.data.length);
          setVehicles(result.data);
        } else {
          console.error('❌ Failed to fetch vehicles:', result.error);
          setError(result.error || '차량을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('❌ Error fetching vehicles:', err);
        setError('차량을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    };

    if (user) {
      fetchVehicles();
    }
  }, [user]);

  // 차량 삭제 핸들러
  const handleDelete = async (vehicleId: string, model: string) => {
    if (!confirm(`"${model}" 차량을 정말 삭제하시겠습니까?`)) {
      return;
    }

    console.group(`🗑️ Deleting vehicle: ${vehicleId}`);

    try {
      const result = await deleteVehicle(vehicleId);

      if (result.success) {
        console.log('✅ Vehicle deleted');
        alert(result.message || '차량이 삭제되었습니다.');
        // 목록에서 제거
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
      } else {
        console.error('❌ Delete failed:', result.error);
        alert(result.error || '차량 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ Error deleting vehicle:', err);
      alert('차량 삭제 중 오류가 발생했습니다.');
    } finally {
      console.groupEnd();
    }
  };

  // 차량 상태 토글 핸들러
  const handleToggleStatus = async (vehicleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'unavailable' : 'active';
    
    console.group(`🔄 Toggling vehicle status: ${vehicleId}`);
    console.log('Current status:', currentStatus, '→ New status:', newStatus);

    try {
      const result = await updateVehicleStatus(vehicleId, newStatus);

      if (result.success) {
        console.log('✅ Status updated');
        // 목록 업데이트
        setVehicles((prev) =>
          prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
        );
      } else {
        console.error('❌ Status update failed:', result.error);
        alert(result.error || '상태 변경에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ Error updating status:', err);
      alert('상태 변경 중 오류가 발생했습니다.');
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">내 차량 관리</h1>
          <p className="text-gray-600 mt-2">
            등록한 차량을 관리하고 예약 현황을 확인하세요.
          </p>
        </div>
        <Link href="/vehicles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            차량 등록
          </Button>
        </Link>
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
      ) : vehicles.length === 0 ? (
        /* 차량 없음 */
        <div className="text-center py-12">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">등록된 차량이 없습니다</h3>
          <p className="text-gray-600 mb-6">
            첫 번째 차량을 등록하고 수익을 창출해보세요!
          </p>
          <Link href="/vehicles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              차량 등록하기
            </Button>
          </Link>
        </div>
      ) : (
        /* 차량 목록 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 차량 이미지 */}
              <div className="relative h-48 bg-gray-200">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <Image
                    src={vehicle.images[0]}
                    alt={vehicle.model}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                
                {/* 상태 배지 */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      vehicle.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'reserved'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {vehicle.status === 'active'
                      ? '활성'
                      : vehicle.status === 'reserved'
                      ? '예약됨'
                      : '비활성'}
                  </span>
                </div>
              </div>

              {/* 차량 정보 */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {vehicle.year}년 · {vehicle.plate_number}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {vehicle.price_per_day.toLocaleString()}원 / 일
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(vehicle.available_from)} ~{' '}
                    {formatDate(vehicle.available_until)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {vehicle.airport_location}
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleStatus(vehicle.id, vehicle.status)}
                  >
                    {vehicle.status === 'active' ? '비활성화' : '활성화'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id, vehicle.model)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

