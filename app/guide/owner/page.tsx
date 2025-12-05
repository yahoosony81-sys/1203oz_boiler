/**
 * @file app/guide/owner/page.tsx
 * @description 차주용 이용 가이드 페이지
 */

import { 
  Car, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Shield, 
  MessageCircle,
  Camera,
  MapPin,
  Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function OwnerGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">차주 가이드</h1>
        <p className="text-gray-600">
          TripCarShare에서 내 차량을 공유하고 수익을 창출하는 방법을 알아보세요.
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
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                차량 등록하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                내 차량을 등록하고 대여 조건을 설정하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Car className="w-5 h-5 mt-0.5 text-blue-500" />
                  차량 정보 입력 (차종, 연식, 번호판)
                </li>
                <li className="flex items-start gap-2">
                  <Camera className="w-5 h-5 mt-0.5 text-blue-500" />
                  차량 사진 촬영 및 업로드 (최소 3장 이상 권장)
                </li>
                <li className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 mt-0.5 text-blue-500" />
                  일일 대여료 설정
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 mt-0.5 text-blue-500" />
                  대여 가능 기간 설정
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-blue-500" />
                  차량 인수/반납 위치 지정
                </li>
              </ul>
              <Button asChild className="mt-4">
                <Link href="/vehicles/new">차량 등록하러 가기</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                예약 관리하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                예약 요청을 확인하고 승인 또는 거절하세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <MessageCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  예약 요청 알림 확인
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  이용자 정보 확인 후 승인/거절
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 mt-0.5 text-blue-500" />
                  승인 시 해당 기간 자동 블록 처리
                </li>
              </ul>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/bookings/received">예약 관리 페이지</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                차량 인도하기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                약속된 장소에서 이용자에게 차량을 인도합니다.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 text-blue-500" />
                  지정된 주차 위치에 차량 대기
                </li>
                <li className="flex items-start gap-2">
                  <Camera className="w-5 h-5 mt-0.5 text-blue-500" />
                  인도 전 차량 상태 사진 촬영 권장
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  차량 키 전달 (지정 장소 또는 직접 전달)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                정산 받기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                대여 완료 후 정산 금액을 받으세요.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CreditCard className="w-5 h-5 mt-0.5 text-blue-500" />
                  대여 종료 후 자동 정산
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500" />
                  등록된 계좌로 입금 (플랫폼 수수료 10% 제외)
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
                차량 보험이 유효한 상태인지 확인하세요.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                차량 상태를 정직하게 등록해주세요.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                인도/반납 시 차량 상태를 꼭 확인하세요.
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-5 h-5 mt-0.5" />
                문제 발생 시 고객센터로 즉시 연락해주세요.
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
              <h3 className="font-semibold mb-2">수수료는 얼마인가요?</h3>
              <p className="text-gray-600">
                플랫폼 수수료는 대여료의 10%입니다. 결제 수수료는 별도로 부과되지 않습니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">정산은 언제 되나요?</h3>
              <p className="text-gray-600">
                대여 종료 후 3영업일 이내에 등록된 계좌로 입금됩니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">사고가 발생하면 어떻게 하나요?</h3>
              <p className="text-gray-600">
                즉시 고객센터(1588-0000)로 연락해주세요. 기본적으로 차량 소유자의 
                보험이 적용되며, 분쟁 해결을 위한 중재 서비스를 제공합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/vehicles/new">지금 차량 등록하기</Link>
        </Button>
      </div>
    </div>
  );
}

