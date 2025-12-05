/**
 * @file app/privacy/page.tsx
 * @description 개인정보처리방침 페이지
 */

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
      
      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. 개인정보의 수집 및 이용목적</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            TripCarShare(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>회원 가입 및 관리</li>
            <li>차량 예약 및 결제 서비스 제공</li>
            <li>고객 상담 및 불만 처리</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. 수집하는 개인정보의 항목</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><strong>필수항목:</strong> 이름, 이메일, 연락처</li>
            <li><strong>선택항목:</strong> 프로필 사진</li>
            <li><strong>차주 추가 정보:</strong> 차량 정보, 은행 계좌 정보</li>
            <li><strong>자동 수집:</strong> IP 주소, 쿠키, 접속 기록</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. 개인정보의 보유 및 이용기간</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>회원 탈퇴 시까지</li>
            <li>관계법령에 따른 보존 기간</li>
            <li>전자상거래법에 따른 거래기록: 5년</li>
            <li>소비자 불만 또는 분쟁처리 기록: 3년</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 다음의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의한 경우</li>
            <li>서비스 제공을 위해 필요한 최소한의 정보 (예약 시 차주에게 이용자 연락처 제공)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. 개인정보의 파기</h2>
          <p className="text-gray-600 leading-relaxed">
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 
            지체없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 경우 복구가 불가능한 방법으로 
            영구 삭제하며, 종이 문서의 경우 분쇄기로 분쇄하거나 소각합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. 이용자의 권리와 행사방법</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            권리 행사는 서비스 내 설정 또는 고객센터를 통해 가능합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. 개인정보의 안전성 확보 조치</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>개인정보 취급 직원의 최소화 및 교육</li>
            <li>내부관리계획의 수립 및 시행</li>
            <li>개인정보의 암호화</li>
            <li>해킹 등에 대비한 기술적 대책</li>
            <li>접근통제 시스템 운영</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. 개인정보 보호책임자</h2>
          <div className="bg-gray-50 p-4 rounded-lg text-gray-600">
            <p><strong>담당부서:</strong> 개인정보보호팀</p>
            <p><strong>연락처:</strong> privacy@tripcarshare.kr</p>
            <p><strong>전화:</strong> 1588-0000</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. 개인정보 처리방침의 변경</h2>
          <p className="text-gray-600 leading-relaxed">
            이 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 
            수정이 있을 수 있으며, 변경되는 경우 시행 7일 전부터 서비스 내 공지사항을 통해 
            고지합니다.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <p className="text-sm text-gray-500">
            시행일: 2025년 1월 1일
          </p>
        </section>
      </div>
    </div>
  );
}

