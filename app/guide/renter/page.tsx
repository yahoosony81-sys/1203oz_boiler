/**
 * @file app/guide/renter/page.tsx
 * @description 이용자용 가이드 페이지
 */

import { 
  Search, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Shield, 
  Car,
  MapPin,
  Clock,
  Key
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function RenterGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">이용자 가이드</h1>
        <p className="text-gray-600">
          TripCarShare에서 원하는 차량을 찾고 예약하는 방법을 알아보세요.
        </p>
      </div>

      {/* 단계별 가이드 */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold mb-6">이용 방법</h2>
        
        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                차량 검색하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                원하는 날짜와 공항을 선택하여 이용 가능한 차량을 검색하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 mt-0.5 text-green-500" />
                  대여 시작일과 반납일 선택
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                  공항 위치 선택 (제주공항)
                </li>
                <li className="flex items-start gap-2">
                  <Search className="w-5 h-5 mt-0.5 text-green-500" />
                  가격, 차종, 연식으로 필터링
                </li>
              </ul>
              <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                <Link href="/vehicles">차량 검색하기</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                차량 상세 확인 및 예약 신청
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                마음에 드는 차량의 상세 정보를 확인하고 예약을 신청하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Car className="w-5 h-5 mt-0.5 text-green-500" />
                  차량 사진 및 상세 설명 확인
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 mt-0.5 text-green-500" />
                  총 대여료 자동 계산 확인
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                  인수/반납 위치 확인
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
                  이용약관 동의 후 예약 신청
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                승인 확인 및 결제
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                차주의 승인 후 결제를 진행하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 mt-0.5 text-green-500" />
                  예약 승인 대기 (보통 24시간 이내)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
                  승인 완료 알림 확인
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 mt-0.5 text-green-500" />
                  결제하기 버튼으로 결제 진행
                </li>
              </ul>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/bookings/my">내 예약 확인하기</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">4</span>
                </div>
                차량 인수 및 이용
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                약속된 장소에서 차량을 인수하고 이용하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                  지정된 위치에서 차량 인수
                </li>
                <li className="flex items-start gap-2">
                  <Key className="w-5 h-5 mt-0.5 text-green-500" />
                  키 전달 방법 확인 (직접 전달 또는 지정 장소)
                </li>
                <li className="flex items-start gap-2">
                  <Car className="w-5 h-5 mt-0.5 text-green-500" />
                  인수 전 차량 상태 확인 및 사진 촬영
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">5</span>
                </div>
                차량 반납
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                대여 종료 시 약속된 장소에 차량을 반납하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                  지정된 반납 위치에 주차
                </li>
                <li className="flex items-start gap-2">
                  <Car className="w-5 h-5 mt-0.5 text-green-500" />
                  인수 시와 동일한 연료량 유지
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
                  반납 완료 후 차주에게 알림
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="space-y-6 mb-12">
        <h2 className="text-2xl font-semibold mb-6">주의사항</h2>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <ul className="space-y-3 text-amber-800">
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                만 21세 이상, 운전면허 소지자만 이용 가능합니다.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                음주운전은 절대 금지입니다.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                차량 사고 시 즉시 고객센터로 연락해주세요.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                반납 시간을 준수해주세요. 지연 시 추가 요금이 발생할 수 있습니다.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                차량 내 흡연은 금지입니다.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold mb-6">자주 묻는 질문</h2>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">예약을 취소할 수 있나요?</h3>
              <p className="text-gray-600">
                결제 전에는 무료로 취소 가능합니다. 결제 후에는 취소 정책에 따라 
                환불 금액이 결정됩니다. 대여 시작 3일 전까지는 전액 환불됩니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">보험은 어떻게 되나요?</h3>
              <p className="text-gray-600">
                기본적으로 차량 소유자의 자동차보험이 적용됩니다. 
                자기부담금이 발생할 수 있으며, 추가 보험 옵션을 선택할 수 있습니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">차량 키는 어떻게 받나요?</h3>
              <p className="text-gray-600">
                차량별로 다릅니다. 보통 지정된 주차 위치에서 직접 전달받거나, 
                지정된 장소(예: 공항 안내데스크)에서 수령합니다. 
                예약 확정 후 상세 안내를 받으실 수 있습니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">연료는 어떻게 해야 하나요?</h3>
              <p className="text-gray-600">
                인수 시와 동일한 연료량으로 반납해주세요. 
                연료가 부족하게 반납될 경우 추가 요금이 청구될 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/vehicles">지금 차량 찾아보기</Link>
        </Button>
      </div>
    </div>
  );
}

