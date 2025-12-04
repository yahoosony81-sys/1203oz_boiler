/**
 * @file app/guide/page.tsx
 * @description 이용 가이드 페이지
 * 
 * 차주와 이용자를 위한 서비스 이용 가이드를 제공합니다.
 */

import { Car, Search, Calendar, Key, MapPin, CheckCircle } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">이용 가이드</h1>
      <p className="text-gray-600 mb-12">
        트립카셰어를 처음 이용하시나요? 차주와 이용자를 위한 가이드를 확인하세요.
      </p>

      {/* 탭 스타일 섹션 구분 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-2 text-blue-900">차주 가이드</h2>
          <p className="text-blue-700">차량을 등록하고 수익을 창출하세요</p>
        </div>
        <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
          <h2 className="text-2xl font-bold mb-2 text-green-900">이용자 가이드</h2>
          <p className="text-green-700">차량을 검색하고 예약하세요</p>
        </div>
      </div>

      {/* 차주 가이드 */}
      <section className="mb-16">
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            <Car className="inline-block w-8 h-8 mr-2" />
            차주를 위한 가이드
          </h2>
          <p className="text-blue-800">
            여행이나 출장으로 제주를 떠나는 동안, 공항에 세워둔 차량으로 수익을 창출하세요.
          </p>
        </div>

        {/* Step 1: 차량 등록 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              1
            </div>
            <h3 className="text-xl font-semibold">차량 등록하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 기본 정보 입력:</strong> 차종, 연식, 번호판을 정확히 입력하세요.
            </p>
            <p>
              <strong>② 대여 조건 설정:</strong> 일일 대여료와 이용 가능 기간을 설정하세요.
              <br />
              <span className="text-sm text-gray-600">
                💡 Tip: 주변 렌트카 가격보다 10~20% 저렴하게 설정하면 예약률이 높아집니다.
              </span>
            </p>
            <p>
              <strong>③ 사진 업로드:</strong> 차량 외관, 내부, 대시보드 사진을 업로드하세요.
              <br />
              <span className="text-sm text-gray-600">
                💡 Tip: 깨끗하고 밝은 사진일수록 신뢰도가 높아집니다.
              </span>
            </p>
            <p>
              <strong>④ 위치 정보:</strong> 공항과 주차 위치를 상세히 적어주세요.
            </p>
          </div>
        </div>

        {/* Step 2: 예약 관리 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              2
            </div>
            <h3 className="text-xl font-semibold">예약 요청 받기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 예약 알림 확인:</strong> 이용자가 예약을 신청하면 알림을 받습니다.
            </p>
            <p>
              <strong>② 예약자 정보 확인:</strong> 예약자의 이름과 연락처를 확인하세요.
            </p>
            <p>
              <strong>③ 승인/거절 결정:</strong> 24시간 내에 승인 또는 거절 처리를 해주세요.
              <br />
              <span className="text-sm text-gray-600">
                💡 Tip: 응답이 빠를수록 이용자 만족도가 높아집니다.
              </span>
            </p>
          </div>
        </div>

        {/* Step 3: 차량 인계 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              3
            </div>
            <h3 className="text-xl font-semibold">차량 인계하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 키 전달 방법 합의:</strong> 이용자와 키 전달 방법을 협의하세요.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>직접 만나서 전달 (추천)</li>
              <li>공항 보관함 이용</li>
              <li>차량 내 숨김 (비추천)</li>
            </ul>
            <p>
              <strong>② 차량 상태 확인:</strong> 인계 전 차량 상태를 사진으로 남기세요.
            </p>
            <p>
              <strong>③ 주차 위치 공유:</strong> 정확한 주차 위치와 층, 구역을 알려주세요.
            </p>
            <p>
              <strong>④ 긴급 연락처 전달:</strong> 문제 발생 시 연락 가능한 번호를 알려주세요.
            </p>
          </div>
        </div>

        {/* Step 4: 차량 반납 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              4
            </div>
            <h3 className="text-xl font-semibold">차량 반납 받기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 반납 시간 확인:</strong> 약속한 시간에 차량이 반납되었는지 확인하세요.
            </p>
            <p>
              <strong>② 차량 상태 점검:</strong> 외관, 내부, 연료 상태를 확인하세요.
            </p>
            <p>
              <strong>③ 문제 발생 시:</strong> 손상이나 문제가 있다면 즉시 이용자에게 연락하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 이용자 가이드 */}
      <section className="mb-16">
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            <Search className="inline-block w-8 h-8 mr-2" />
            이용자를 위한 가이드
          </h2>
          <p className="text-green-800">
            제주 여행에 필요한 차량을 렌트카보다 저렴하고 편리하게 이용하세요.
          </p>
        </div>

        {/* Step 1: 차량 검색 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              1
            </div>
            <h3 className="text-xl font-semibold">차량 검색하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 날짜 선택:</strong> 이용 시작일과 종료일을 입력하세요.
            </p>
            <p>
              <strong>② 공항 선택:</strong> 제주 국제공항을 선택하세요 (현재 제주만 지원).
            </p>
            <p>
              <strong>③ 차량 검색:</strong> 조건에 맞는 차량 목록이 표시됩니다.
            </p>
            <p>
              <strong>④ 필터 활용:</strong> 가격, 차종 등의 필터로 원하는 차량을 찾으세요.
            </p>
          </div>
        </div>

        {/* Step 2: 차량 선택 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              2
            </div>
            <h3 className="text-xl font-semibold">차량 선택 및 예약 신청</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 차량 상세 확인:</strong> 사진, 설명, 차주 정보를 꼼꼼히 확인하세요.
            </p>
            <p>
              <strong>② 이용 기간 입력:</strong> 픽업 및 반납 날짜와 시간을 입력하세요.
            </p>
            <p>
              <strong>③ 총 금액 확인:</strong> 일수에 따른 총 대여료를 확인하세요.
            </p>
            <p>
              <strong>④ 예약 신청:</strong> 예약 신청 버튼을 클릭하면 차주에게 요청이 전달됩니다.
              <br />
              <span className="text-sm text-gray-600">
                💡 Tip: 여러 차량에 동시에 예약을 신청할 수 있습니다.
              </span>
            </p>
          </div>
        </div>

        {/* Step 3: 예약 승인 대기 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              3
            </div>
            <h3 className="text-xl font-semibold">승인 대기 및 확인</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 알림 확인:</strong> 차주가 승인/거절하면 알림을 받습니다.
            </p>
            <p>
              <strong>② 승인 시:</strong> 차주에게 연락하여 세부 사항을 협의하세요.
            </p>
            <p>
              <strong>③ 거절 시:</strong> 다른 차량을 검색하여 예약하세요.
            </p>
          </div>
        </div>

        {/* Step 4: 차량 픽업 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              4
            </div>
            <h3 className="text-xl font-semibold">차량 픽업하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 운전면허증 준비:</strong> 유효한 운전면허증을 지참하세요.
            </p>
            <p>
              <strong>② 주차 위치 확인:</strong> 차주가 알려준 주차 위치로 이동하세요.
            </p>
            <p>
              <strong>③ 차량 상태 점검:</strong> 픽업 전 외관과 내부 상태를 사진으로 남기세요.
            </p>
            <p>
              <strong>④ 키 수령:</strong> 차주와 약속한 방법으로 키를 받으세요.
            </p>
            <p>
              <strong>⑤ 연료 및 계기판 확인:</strong> 연료량, 주행거리를 확인하고 기록하세요.
            </p>
          </div>
        </div>

        {/* Step 5: 차량 이용 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              5
            </div>
            <h3 className="text-xl font-semibold">차량 이용하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 안전 운전:</strong> 교통법규를 준수하고 안전하게 운전하세요.
            </p>
            <p>
              <strong>② 차량 관리:</strong> 내부를 깨끗하게 유지하고 소중히 사용하세요.
            </p>
            <p>
              <strong>③ 사고 발생 시:</strong> 즉시 경찰에 신고하고 차주에게 연락하세요.
            </p>
            <p>
              <strong>④ 문제 발생 시:</strong> 차량에 문제가 있다면 즉시 차주에게 알리세요.
            </p>
          </div>
        </div>

        {/* Step 6: 차량 반납 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
              6
            </div>
            <h3 className="text-xl font-semibold">차량 반납하기</h3>
          </div>
          <div className="ml-14 space-y-3 text-gray-700">
            <p>
              <strong>① 연료 충전:</strong> 픽업 시와 동일한 수준으로 연료를 채우세요.
            </p>
            <p>
              <strong>② 내부 청소:</strong> 쓰레기를 버리고 간단히 정리하세요.
            </p>
            <p>
              <strong>③ 반납 위치 이동:</strong> 약속한 장소에 주차하세요.
            </p>
            <p>
              <strong>④ 키 반납:</strong> 차주와 약속한 방법으로 키를 반납하세요.
            </p>
            <p>
              <strong>⑤ 차주에게 알림:</strong> 반납 완료를 차주에게 알려주세요.
            </p>
          </div>
        </div>
      </section>

      {/* 주의사항 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">
          <CheckCircle className="inline-block w-8 h-8 mr-2" />
          주의사항
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ 보험 확인</h3>
            <p className="text-yellow-800 text-sm">
              차량 이용 전 반드시 보험 내용을 확인하세요. 보험 적용 범위와 자기부담금을 사전에 협의하세요.
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ 계약서 작성</h3>
            <p className="text-yellow-800 text-sm">
              대여 시작 전 간단한 계약서를 작성하여 서로 서명하시기를 권장합니다.
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ 사고 대비</h3>
            <p className="text-yellow-800 text-sm">
              사고 발생 시 즉시 경찰에 신고하고, 상대방과 차주에게 알려야 합니다.
            </p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-3">⚠️ 개인 물품</h3>
            <p className="text-yellow-800 text-sm">
              차량 내 개인 물품 분실에 대해서는 플랫폼이 책임지지 않습니다. 귀중품은 꼭 챙기세요.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ 링크 또는 문의 */}
      <div className="text-center bg-gray-50 p-8 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">더 궁금한 사항이 있으신가요?</h3>
        <p className="text-gray-600 mb-6">
          이용 중 문제가 발생하거나 추가 문의사항이 있으시면 고객센터로 연락주세요.
        </p>
        <p className="text-gray-700">
          <strong>이메일:</strong> support@tripcarshare.com
        </p>
      </div>
    </div>
  );
}

