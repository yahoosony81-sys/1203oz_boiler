/**
 * @file app/page.tsx
 * @description 트립카셰어 홈 페이지
 * 
 * 공항 주차/차량 공유 서비스 스타일의 모던한 랜딩 페이지
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Car, Search, MapPin, Calendar, Users, 
  ChevronRight, Shield, Clock, CreditCard 
} from 'lucide-react';

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
    
    const params = new URLSearchParams({
      from: searchData.available_from,
      to: searchData.available_until,
      airport: searchData.airport_location,
    });

    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 - 여행 스타일 */}
      <section className="relative overflow-hidden">
        {/* 배경 이미지 & 오버레이 - 차량에서 손을 흔드는 즐거운 여행자 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.65) 0%, rgba(30, 58, 138, 0.5) 50%, rgba(59, 130, 246, 0.2) 100%), 
              url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2121&q=80')`,
          }}
        />
        
        {/* 사선 장식 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-white transform -skew-y-2 origin-bottom-left translate-y-12" />
        
        <div className="relative container max-w-6xl mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 텍스트 영역 */}
            <div className="text-white">
              <p className="text-blue-300 font-medium mb-4 tracking-wide">
                제주 공항 P2P 차량 공유
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                필요한 차량을
                <br />
                <span className="text-blue-400">바로 찾으세요!</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                제주 공항에서 현지 차주와 직접 연결되는
                <br className="hidden md:block" />
                편리하고 합리적인 차량 공유 서비스
              </p>
              
              {/* 빠른 링크 */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/guide/renter"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  이용자 가이드 <ChevronRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/guide/owner"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  차주 가이드 <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 검색 폼 카드 */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">차량 검색</h2>
              </div>
              
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="available_from" className="text-gray-600 text-sm mb-1.5 block">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      이용 시작
                    </Label>
                    <Input
                      id="available_from"
                      type="datetime-local"
                      value={searchData.available_from}
                      onChange={(e) =>
                        setSearchData({ ...searchData, available_from: e.target.value })
                      }
                      className="h-12"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="available_until" className="text-gray-600 text-sm mb-1.5 block">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      이용 종료
                    </Label>
                    <Input
                      id="available_until"
                      type="datetime-local"
                      value={searchData.available_until}
                      onChange={(e) =>
                        setSearchData({ ...searchData, available_until: e.target.value })
                      }
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="airport_location" className="text-gray-600 text-sm mb-1.5 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    픽업 공항
                  </Label>
                  <Input
                    id="airport_location"
                    type="text"
                    value={searchData.airport_location}
                    readOnly
                    className="h-12 bg-gray-50"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-5 h-5 mr-2" />
                  차량 검색하기
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 차량 타입별 가격 섹션 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-medium mb-2">합리적인 가격</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              차량 타입별 평균 가격
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* 경차 */}
            <div className="group relative">
              <div className="bg-gray-100 rounded-[2rem] p-8 text-center transform transition-transform group-hover:scale-105 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-lg font-semibold mb-1">경차</p>
                <p className="text-sm text-gray-500 mb-4">모닝, 스파크 등</p>
                <div className="flex items-baseline justify-center text-gray-900">
                  <span className="text-2xl align-top">₩</span>
                  <span className="text-6xl font-bold">3</span>
                  <span className="text-4xl font-bold">.5</span>
                  <span className="text-xl ml-1">만원</span>
                </div>
                <p className="text-gray-500 mt-2">1일 기준</p>
                <Button 
                  className="mt-6 bg-gray-800 text-white hover:bg-gray-700 rounded-full px-6"
                  onClick={() => router.push('/vehicles?type=compact')}
                >
                  차량 보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* 중형 */}
            <div className="group relative">
              <div className="bg-gray-100 rounded-[2rem] p-8 text-center transform transition-transform group-hover:scale-105 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-lg font-semibold mb-1">중형 세단</p>
                <p className="text-sm text-gray-500 mb-4">아반떼, K3 등</p>
                <div className="flex items-baseline justify-center text-gray-900">
                  <span className="text-2xl align-top">₩</span>
                  <span className="text-6xl font-bold">5</span>
                  <span className="text-4xl font-bold">.0</span>
                  <span className="text-xl ml-1">만원</span>
                </div>
                <p className="text-gray-500 mt-2">1일 기준</p>
                <Button 
                  className="mt-6 bg-gray-800 text-white hover:bg-gray-700 rounded-full px-6"
                  onClick={() => router.push('/vehicles?type=sedan')}
                >
                  차량 보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* SUV */}
            <div className="group relative">
              <div className="bg-gray-100 rounded-[2rem] p-8 text-center transform transition-transform group-hover:scale-105 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-lg font-semibold mb-1">SUV</p>
                <p className="text-sm text-gray-500 mb-4">투싼, 스포티지 등</p>
                <div className="flex items-baseline justify-center text-gray-900">
                  <span className="text-2xl align-top">₩</span>
                  <span className="text-6xl font-bold">7</span>
                  <span className="text-4xl font-bold">.0</span>
                  <span className="text-xl ml-1">만원</span>
                </div>
                <p className="text-gray-500 mt-2">1일 기준</p>
                <Button 
                  className="mt-6 bg-gray-800 text-white hover:bg-gray-700 rounded-full px-6"
                  onClick={() => router.push('/vehicles?type=suv')}
                >
                  차량 보기 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-medium mb-2">간편한 이용</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              3단계로 쉽게 이용하세요
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 단계 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <h3 className="text-xl font-bold text-gray-900">차량 검색</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                원하는 날짜와 공항을 선택하여 이용 가능한 차량을 검색하세요.
              </p>
            </div>

            {/* 단계 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <h3 className="text-xl font-bold text-gray-900">예약 & 결제</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                마음에 드는 차량을 선택하고 예약 후 안전하게 결제하세요.
              </p>
            </div>

            {/* 단계 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mb-6">
                <Car className="w-7 h-7 text-violet-600" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <h3 className="text-xl font-bold text-gray-900">차량 이용</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                공항에서 차량을 인수하고 편안한 제주 여행을 즐기세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 장점 섹션 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 */}
            <div>
              <p className="text-blue-600 font-medium mb-2">왜 트립카셰어?</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                더 스마트한 선택,
                <br />
                더 즐거운 여행
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                제주 여행의 시작과 끝을 함께하는 TripCarShare.
                렌트카 대비 최대 30% 저렴한 가격과 편리한 공항 픽업으로
                당신의 여행을 더욱 특별하게 만들어드립니다.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">합리적 가격</h4>
                    <p className="text-sm text-gray-500">최대 30% 절약</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">편리한 픽업</h4>
                    <p className="text-sm text-gray-500">공항에서 바로</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">검증된 차주</h4>
                    <p className="text-sm text-gray-500">안심 거래</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">안전 보장</h4>
                    <p className="text-sm text-gray-500">보험 적용</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 이미지/비주얼 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white">
                <div className="text-center">
                  <Car className="w-20 h-20 mx-auto mb-6 opacity-90" />
                  <h3 className="text-2xl font-bold mb-3">차주가 되어보세요</h3>
                  <p className="text-blue-100 mb-6">
                    여행 중 유휴 차량으로 수익을 창출하세요.
                    <br />
                    주차비 절약 + 추가 수익까지!
                  </p>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-8"
                    onClick={() => router.push('/vehicles/new')}
                  >
                    차량 등록하기 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              
              {/* 데코레이션 */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full opacity-50 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.65) 0%, rgba(30, 58, 138, 0.5) 50%, rgba(59, 130, 246, 0.2) 100%), 
              url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2121&q=80')`,
          }}
        />
        <div className="relative container max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            제주 여행의 새로운 시작, TripCarShare와 함께
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 h-14 text-base"
              onClick={() => router.push('/vehicles')}
            >
              <Search className="w-5 h-5 mr-2" />
              차량 검색하기
            </Button>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 h-14 text-base"
              onClick={() => router.push('/vehicles/new')}
            >
              <Car className="w-5 h-5 mr-2" />
              차량 등록하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
