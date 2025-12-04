/**
 * @file app/vehicles/page.tsx
 * @description 차량 검색 결과 페이지
 * 
 * 검색 조건에 맞는 차량 목록을 표시합니다.
 * 
 * 주요 기능:
 * 1. 차량 목록 조회
 * 2. 검색 필터 (가격, 차종 등)
 * 3. 차량 카드 표시
 * 
 * @dependencies
 * - @supabase/supabase-js: 데이터베이스 조회
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSupabaseClient } from '@/lib/supabase/clerk-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, DollarSign, Calendar, MapPin, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Vehicle } from '@/types/database';

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const supabase = useSupabaseClient();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 검색 필터 상태
  const [filters, setFilters] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    airport: searchParams.get('airport') || '제주 국제공항',
    minPrice: '',
    maxPrice: '',
  });

  console.group('🔍 VehiclesPage Render');
  console.log('Search params:', {
    from: searchParams.get('from'),
    to: searchParams.get('to'),
    airport: searchParams.get('airport'),
  });
  console.log('Vehicles count:', vehicles.length);
  console.groupEnd();

  // 차량 검색
  useEffect(() => {
    const fetchVehicles = async () => {
      console.group('🔄 Fetching vehicles...');
      setIsLoading(true);
      setError(null);

      try {
        // 기본 쿼리
        let query = supabase
          .from('vehicles')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        // 공항 필터
        if (filters.airport) {
          query = query.eq('airport_location', filters.airport);
        }

        // 날짜 필터 (이용 가능 기간 내에 포함되는 차량)
        if (filters.from) {
          query = query.lte('available_from', filters.from);
        }
        if (filters.to) {
          query = query.gte('available_until', filters.to);
        }

        // 가격 필터
        if (filters.minPrice) {
          query = query.gte('price_per_day', parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
          query = query.lte('price_per_day', parseInt(filters.maxPrice));
        }

        console.log('Query filters:', filters);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('❌ Fetch error:', fetchError);
          throw new Error(`차량 조회 실패: ${fetchError.message}`);
        }

        console.log(`✅ Found ${data?.length || 0} vehicles`);
        setVehicles(data || []);
      } catch (err) {
        console.error('❌ Error fetching vehicles:', err);
        setError(err instanceof Error ? err.message : '차량을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
        console.groupEnd();
      }
    };

    fetchVehicles();
  }, [filters, supabase]);

  // 검색 폼 제출
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Search submitted with filters:', filters);
    // 필터 상태가 업데이트되면 useEffect가 자동으로 재실행됨
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">차량 검색</h1>
        <p className="text-gray-600">
          원하는 조건에 맞는 차량을 찾아보세요.
        </p>
      </div>

      {/* 검색 필터 */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 이용 시작일 */}
            <div>
              <Label htmlFor="from">이용 시작일</Label>
              <Input
                id="from"
                type="datetime-local"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              />
            </div>

            {/* 이용 종료일 */}
            <div>
              <Label htmlFor="to">이용 종료일</Label>
              <Input
                id="to"
                type="datetime-local"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
            </div>

            {/* 공항 */}
            <div>
              <Label htmlFor="airport">공항</Label>
              <Input
                id="airport"
                type="text"
                value={filters.airport}
                onChange={(e) => setFilters({ ...filters, airport: e.target.value })}
                placeholder="제주 국제공항"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 최소 가격 */}
            <div>
              <Label htmlFor="minPrice">최소 가격 (원/일)</Label>
              <Input
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
              />
            </div>

            {/* 최대 가격 */}
            <div>
              <Label htmlFor="maxPrice">최대 가격 (원/일)</Label>
              <Input
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="100000"
              />
            </div>

            {/* 검색 버튼 */}
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          </div>
        </form>
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
        /* 검색 결과 없음 */
        <div className="text-center py-12">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-6">
            다른 조건으로 다시 검색해보세요.
          </p>
        </div>
      ) : (
        /* 차량 목록 */
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              총 <span className="font-semibold text-blue-600">{vehicles.length}</span>대의 차량이 검색되었습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow block"
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
                </div>

                {/* 차량 정보 */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {vehicle.year}년 · {vehicle.plate_number}
                  </p>

                  {vehicle.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {vehicle.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-blue-600 font-semibold text-lg">
                      <DollarSign className="w-5 h-5 mr-1" />
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
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

