/**
 * @file app/terms/page.tsx
 * @description 이용약관 페이지
 */

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      
      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
          <p className="text-gray-600 leading-relaxed">
            본 약관은 TripCarShare(이하 &quot;회사&quot;)가 제공하는 차량 공유 중개 서비스(이하 &quot;서비스&quot;)의 
            이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>&quot;서비스&quot;란 회사가 제공하는 차량 공유 중개 플랫폼을 말합니다.</li>
            <li>&quot;회원&quot;이란 본 약관에 동의하고 서비스에 가입한 자를 말합니다.</li>
            <li>&quot;차주&quot;란 자신의 차량을 서비스에 등록하여 대여하는 회원을 말합니다.</li>
            <li>&quot;이용자&quot;란 서비스를 통해 차량을 대여하는 회원을 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제3조 (서비스의 내용)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            회사는 다음과 같은 서비스를 제공합니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>차량 등록 및 관리 서비스</li>
            <li>차량 검색 및 예약 서비스</li>
            <li>결제 중개 서비스</li>
            <li>고객 지원 서비스</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제4조 (회원가입 및 자격)</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>만 21세 이상으로 운전면허를 보유한 자만 서비스를 이용할 수 있습니다.</li>
            <li>차량을 등록하려면 해당 차량의 소유자이거나 정당한 사용 권한이 있어야 합니다.</li>
            <li>허위 정보를 기재하거나 타인의 정보를 도용한 경우 회원 자격이 제한됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제5조 (예약 및 결제)</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>이용자는 차량을 검색하고 원하는 일정으로 예약 신청할 수 있습니다.</li>
            <li>예약은 차주의 승인 후 확정됩니다.</li>
            <li>결제는 차주 승인 후 진행되며, 결제 완료 시 예약이 최종 확정됩니다.</li>
            <li>취소 및 환불은 별도의 취소 정책에 따릅니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제6조 (차량 인수 및 반납)</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>차량 인수 시 차량 상태를 확인하고 사진으로 기록해야 합니다.</li>
            <li>반납 시 인수 시와 동일한 상태로 반납해야 합니다.</li>
            <li>연료는 인수 시와 동일한 수준으로 유지해야 합니다.</li>
            <li>차량 손상 발생 시 즉시 회사와 차주에게 알려야 합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제7조 (책임의 제한)</h2>
          <p className="text-gray-600 leading-relaxed">
            회사는 차량 공유 중개 서비스만을 제공하며, 차주와 이용자 간의 거래에서 발생하는 
            문제에 대해 직접적인 책임을 지지 않습니다. 단, 분쟁 해결을 위한 중재 서비스를 제공합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제8조 (보험)</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>모든 등록 차량은 자동차보험(대인/대물)에 가입되어 있어야 합니다.</li>
            <li>사고 발생 시 기본적으로 차량 소유자의 보험이 적용됩니다.</li>
            <li>추가 보험 옵션은 별도로 제공될 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제9조 (금지행위)</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            회원은 다음 행위를 해서는 안 됩니다:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>허위 정보 등록</li>
            <li>타인의 계정 도용</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>음주운전 등 불법 행위</li>
            <li>차량의 불법적 사용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">제10조 (약관의 변경)</h2>
          <p className="text-gray-600 leading-relaxed">
            회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 
            효력이 발생합니다. 회원이 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 
            탈퇴할 수 있습니다.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <p className="text-sm text-gray-500">
            본 약관은 2025년 1월 1일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}

