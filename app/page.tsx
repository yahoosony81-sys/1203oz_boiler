/**
 * @file app/page.tsx
 * @description 트립카셰어 홈 페이지
 * 
 * 서비스를 소개하고 차량을 검색할 수 있는 메인 페이지입니다.
 * 
 * 주요 기능:
 * 1. 히어로 섹션 (서비스 소개)
 * 2. 차량 검색 폼
 * 3. 이용 방법 안내
 * 4. 서비스 장점 소개
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, DollarSign, Shield, Clock, Search } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    available_from: '',
    available_until: '',
    airport_location: '제주 국제공항',
  });

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.group('🔍 Search Vehicles');
    console.log('Search data:', searchData);

    // 검색 파라미터를 URL에 추가
    const params = new URLSearchParams({
      from: searchData.available_from,
      to: searchData.available_until,
      airport: searchData.airport_location,
    });

    router.push(`/vehicles?${params.toString()}`);
    console.groupEnd();
  };

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              공항에서 만나는
              <br />
              <span className="text-blue-600">스마트한 차량 공유</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              제주 여행, 더 이상 렌트카 걱정하지 마세요.
              <br />
              현지 차주와 직접 연결되는 P2P 차량 공유 플랫폼
            </p>
          </div>

          {/* 검색 폼 */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              차량 검색하기
            </h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 이용 시작일 */}
                <div>
                  <Label htmlFor="available_from">이용 시작일</Label>
                  <Input
                    id="available_from"
                    type="datetime-local"
                    value={searchData.available_from}
                    onChange={(e) =>
                      setSearchData({ ...searchData, available_from: e.target.value })
                    }
                    required
                  />
                </div>

                {/* 이용 종료일 */}
                <div>
                  <Label htmlFor="available_until">이용 종료일</Label>
                  <Input
                    id="available_until"
                    type="datetime-local"
                    value={searchData.available_until}
                    onChange={(e) =>
                      setSearchData({ ...searchData, available_until: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* 공항 선택 */}
              <div>
                <Label htmlFor="airport_location">공항</Label>
                <Input
                  id="airport_location"
                  type="text"
                  value={searchData.airport_location}
                  onChange={(e) =>
                    setSearchData({ ...searchData, airport_location: e.target.value })
                  }
                  placeholder="제주 국제공항"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  현재는 제주 국제공항만 지원합니다.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Search className="w-5 h-5 mr-2" />
                차량 검색
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            이용 방법
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 단계 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">차량 검색</h3>
              <p className="text-gray-600">
                원하는 날짜와 공항을 선택하여
                <br />
                이용 가능한 차량을 검색하세요.
              </p>
            </div>

            {/* 단계 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">예약 신청</h3>
              <p className="text-gray-600">
                마음에 드는 차량을 선택하고
                <br />
                차주에게 예약을 신청하세요.
              </p>
            </div>

            {/* 단계 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">차량 이용</h3>
              <p className="text-gray-600">
                예약이 승인되면 공항에서
                <br />
                차량을 인수하여 이용하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 장점 섹션 */}
      <section className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            왜 트립카셰어인가요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 장점 1 */}
            <div className="bg-white p-6 rounded-lg border">
              <DollarSign className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">합리적인 가격</h3>
              <p className="text-gray-600">
                렌트카 대비 최대 30% 저렴한 가격으로 차량을 이용하세요.
              </p>
            </div>

            {/* 장점 2 */}
            <div className="bg-white p-6 rounded-lg border">
              <Car className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">다양한 차량</h3>
              <p className="text-gray-600">
                경차부터 SUV까지, 여행 목적에 맞는 차량을 선택하세요.
              </p>
            </div>

            {/* 장점 3 */}
            <div className="bg-white p-6 rounded-lg border">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">편리한 픽업</h3>
              <p className="text-gray-600">
                공항에서 바로 차량을 인수하고 반납하세요.
              </p>
            </div>

            {/* 장점 4 */}
            <div className="bg-white p-6 rounded-lg border">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">안심 공유</h3>
              <p className="text-gray-600">
                검증된 차주와 이용자만 연결하는 안전한 플랫폼입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl mb-8">
            차량을 등록하고 수익을 창출하거나,
            <br />
            저렴한 가격에 차량을 이용해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push('/vehicles/new')}
            >
              <Car className="w-5 h-5 mr-2" />
              차량 등록하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => router.push('/vehicles')}
            >
              <Search className="w-5 h-5 mr-2" />
              차량 검색하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
