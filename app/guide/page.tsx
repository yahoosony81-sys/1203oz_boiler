/**
 * @file app/guide/page.tsx
 * @description 이용 가이드 인덱스 페이지
 */

import Link from "next/link";
import { Car, UserCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">이용 가이드</h1>
        <p className="text-gray-600">
          TripCarShare를 이용하기 전에 가이드를 확인해보세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 이용자 가이드 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-7 h-7 text-green-600" />
            </div>
            <CardTitle className="text-xl">이용자 가이드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              제주도 여행에서 차량을 빌리고 싶으신가요?
              <br />
              검색부터 예약, 결제까지 한눈에 알아보세요.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ 차량 검색 및 예약 방법</li>
              <li>✓ 결제 및 픽업 안내</li>
              <li>✓ 반납 절차 안내</li>
            </ul>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/guide/renter" className="flex items-center justify-center gap-2">
                이용자 가이드 보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 차주 가이드 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Car className="w-7 h-7 text-blue-600" />
            </div>
            <CardTitle className="text-xl">차주 가이드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              내 차량을 공유하고 수익을 창출하고 싶으신가요?
              <br />
              등록부터 정산까지 모든 과정을 안내해드립니다.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ 차량 등록 방법</li>
              <li>✓ 예약 승인 및 관리</li>
              <li>✓ 정산 안내</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/guide/owner" className="flex items-center justify-center gap-2">
                차주 가이드 보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ 안내 */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-xl font-semibold mb-4">도움이 필요하신가요?</h2>
        <p className="text-gray-600 mb-4">
          자주 묻는 질문은 각 가이드 페이지 하단에서 확인하실 수 있습니다.
          <br />
          추가 문의사항은 고객센터로 연락해주세요.
        </p>
        <p className="text-blue-600 font-semibold">
          📞 1588-0000 (평일 09:00 - 18:00)
        </p>
      </div>
    </div>
  );
}
