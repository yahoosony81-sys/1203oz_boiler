/**
 * @file app/page.tsx
 * @description 트립카셰어 홈 페이지
 * 
 * Airport Parking 디자인 컨셉 적용:
 * - 다크 네이비 배경 (#0a1628)
 * - 라임/네온 그린 포인트 색상 (#c4ff00)
 * - 모던하고 세련된 UI
 * 
 * @see https://dribbble.com/shots/23554798-Airport-Parking-Branding-Website
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, DollarSign, Shield, Clock, Search, Plane, MapPin, Calendar, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0a1628]">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* 배경 그라데이션 및 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1d31] to-[#0a1628]" />
        
        {/* 장식적 요소들 */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#c4ff00]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#c4ff00]/5 rounded-full blur-3xl" />
        
        {/* 비행기 아이콘 장식 */}
        <div className="absolute top-32 right-1/4 opacity-20">
          <Plane className="w-32 h-32 text-[#c4ff00] rotate-45" />
        </div>
        <div className="absolute bottom-40 left-1/4 opacity-10">
          <Plane className="w-24 h-24 text-white -rotate-12" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-[#c4ff00]/10 border border-[#c4ff00]/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-[#c4ff00] rounded-full animate-pulse" />
                <span className="text-[#c4ff00] text-sm font-medium">제주 공항 P2P 차량 공유</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                공항에서 만나는
                <br />
                <span className="text-[#c4ff00]">스마트한</span>
                <br />
                차량 공유
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
                제주 여행, 더 이상 렌트카 걱정하지 마세요.
                현지 차주와 직접 연결되는 P2P 차량 공유 플랫폼
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#c4ff00] text-[#0a1628] hover:bg-[#b3e600] font-semibold rounded-full px-8"
                  onClick={() => router.push('/vehicles')}
                >
                  차량 둘러보기
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8"
                  onClick={() => router.push('/guide/renter')}
                >
                  이용 가이드
                </Button>
              </div>
              
              {/* 통계 */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-[#c4ff00]">30+</p>
                  <p className="text-gray-500 text-sm">등록된 차량</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#c4ff00]">24h</p>
                  <p className="text-gray-500 text-sm">평균 승인 시간</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#c4ff00]">30%</p>
                  <p className="text-gray-500 text-sm">비용 절감</p>
                </div>
              </div>
            </div>

            {/* 오른쪽: 검색 폼 */}
            <div className="lg:pl-8">
              <div className="bg-[#111c2e] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#c4ff00] rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#0a1628]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">차량 검색</h2>
                </div>
                
                <form onSubmit={handleSearch} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 이용 시작일 */}
                    <div className="space-y-2">
                      <Label htmlFor="available_from" className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        이용 시작일
                      </Label>
                      <Input
                        id="available_from"
                        type="datetime-local"
                        value={searchData.available_from}
                        onChange={(e) =>
                          setSearchData({ ...searchData, available_from: e.target.value })
                        }
                        className="bg-[#0a1628] border-white/20 text-white rounded-xl h-12 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                        required
                      />
                    </div>

                    {/* 이용 종료일 */}
                    <div className="space-y-2">
                      <Label htmlFor="available_until" className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        이용 종료일
                      </Label>
                      <Input
                        id="available_until"
                        type="datetime-local"
                        value={searchData.available_until}
                        onChange={(e) =>
                          setSearchData({ ...searchData, available_until: e.target.value })
                        }
                        className="bg-[#0a1628] border-white/20 text-white rounded-xl h-12 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                        required
                      />
                    </div>
                  </div>

                  {/* 공항 선택 */}
                  <div className="space-y-2">
                    <Label htmlFor="airport_location" className="text-gray-400 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      픽업 공항
                    </Label>
                    <div className="relative">
                      <Input
                        id="airport_location"
                        type="text"
                        value={searchData.airport_location}
                        onChange={(e) =>
                          setSearchData({ ...searchData, airport_location: e.target.value })
                        }
                        className="bg-[#0a1628] border-white/20 text-white rounded-xl h-12 pl-12 focus:border-[#c4ff00] focus:ring-[#c4ff00]/20"
                        placeholder="제주 국제공항"
                        required
                      />
                      <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c4ff00]" />
                    </div>
                    <p className="text-xs text-gray-500">
                      현재는 제주 국제공항만 지원합니다
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#c4ff00] text-[#0a1628] hover:bg-[#b3e600] font-semibold rounded-xl h-14 text-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    차량 검색
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="py-24 bg-[#0d1d31]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#c4ff00] text-sm font-semibold tracking-wider uppercase">How it works</span>
            <h2 className="text-4xl font-bold text-white mt-3">
              간편한 이용 방법
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 단계 1 */}
            <div className="relative group">
              <div className="bg-[#111c2e] border border-white/10 rounded-2xl p-8 h-full hover:border-[#c4ff00]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#c4ff00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-[#0a1628]">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">차량 검색</h3>
                <p className="text-gray-400">
                  원하는 날짜와 공항을 선택하여 이용 가능한 차량을 검색하세요.
                </p>
              </div>
              {/* 연결선 */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#c4ff00]/50 to-transparent" />
            </div>

            {/* 단계 2 */}
            <div className="relative group">
              <div className="bg-[#111c2e] border border-white/10 rounded-2xl p-8 h-full hover:border-[#c4ff00]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#c4ff00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-[#0a1628]">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">예약 & 결제</h3>
                <p className="text-gray-400">
                  마음에 드는 차량을 예약하고 안전하게 결제를 진행하세요.
                </p>
              </div>
              {/* 연결선 */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#c4ff00]/50 to-transparent" />
            </div>

            {/* 단계 3 */}
            <div className="group">
              <div className="bg-[#111c2e] border border-white/10 rounded-2xl p-8 h-full hover:border-[#c4ff00]/50 transition-all duration-300">
                <div className="w-14 h-14 bg-[#c4ff00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-[#0a1628]">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">차량 픽업</h3>
                <p className="text-gray-400">
                  공항에서 차량을 인수하고 여행을 즐기세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 장점 섹션 */}
      <section className="py-24 bg-[#0a1628]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#c4ff00] text-sm font-semibold tracking-wider uppercase">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-white mt-3">
              왜 트립카셰어인가요?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 장점 1 */}
            <div className="bg-gradient-to-br from-[#111c2e] to-[#0d1d31] border border-white/10 rounded-2xl p-6 hover:border-[#c4ff00]/30 transition-all group">
              <div className="w-12 h-12 bg-[#c4ff00]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c4ff00]/20 transition-colors">
                <DollarSign className="w-6 h-6 text-[#c4ff00]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">합리적인 가격</h3>
              <p className="text-gray-400 text-sm">
                렌트카 대비 최대 30% 저렴한 가격으로 차량을 이용하세요.
              </p>
            </div>

            {/* 장점 2 */}
            <div className="bg-gradient-to-br from-[#111c2e] to-[#0d1d31] border border-white/10 rounded-2xl p-6 hover:border-[#c4ff00]/30 transition-all group">
              <div className="w-12 h-12 bg-[#c4ff00]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c4ff00]/20 transition-colors">
                <Car className="w-6 h-6 text-[#c4ff00]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">다양한 차량</h3>
              <p className="text-gray-400 text-sm">
                경차부터 SUV까지, 여행 목적에 맞는 차량을 선택하세요.
              </p>
            </div>

            {/* 장점 3 */}
            <div className="bg-gradient-to-br from-[#111c2e] to-[#0d1d31] border border-white/10 rounded-2xl p-6 hover:border-[#c4ff00]/30 transition-all group">
              <div className="w-12 h-12 bg-[#c4ff00]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c4ff00]/20 transition-colors">
                <Clock className="w-6 h-6 text-[#c4ff00]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">편리한 픽업</h3>
              <p className="text-gray-400 text-sm">
                공항에서 바로 차량을 인수하고 반납하세요.
              </p>
            </div>

            {/* 장점 4 */}
            <div className="bg-gradient-to-br from-[#111c2e] to-[#0d1d31] border border-white/10 rounded-2xl p-6 hover:border-[#c4ff00]/30 transition-all group">
              <div className="w-12 h-12 bg-[#c4ff00]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#c4ff00]/20 transition-colors">
                <Shield className="w-6 h-6 text-[#c4ff00]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">안심 공유</h3>
              <p className="text-gray-400 text-sm">
                검증된 차주와 이용자만 연결하는 안전한 플랫폼입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c4ff00] to-[#9ed900]" />
        
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Plane className="w-20 h-20 text-[#0a1628]" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Car className="w-24 h-24 text-[#0a1628]" />
          </div>
        </div>
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6">
            지금 바로 시작하세요!
          </h2>
          <p className="text-xl text-[#0a1628]/80 mb-10">
            차량을 등록하고 수익을 창출하거나,
            저렴한 가격에 차량을 이용해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0a1628] text-white hover:bg-[#0d1d31] rounded-full px-8"
              onClick={() => router.push('/vehicles/new')}
            >
              <Car className="w-5 h-5 mr-2" />
              차량 등록하기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628]/10 rounded-full px-8"
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
