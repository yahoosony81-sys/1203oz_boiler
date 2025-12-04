/**
 * @file app/terms/rental-agreement/page.tsx
 * @description 기본 대여 동의서 페이지
 * 
 * 차량 대여 시 필요한 약관 및 동의 사항을 명시합니다.
 */

export default function RentalAgreementPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">기본 대여 동의서</h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 서비스 개요</h2>
          <p className="text-gray-700 mb-4">
            트립카셰어는 차량 소유자(차주)와 차량 이용자(이용자)를 연결하는 P2P 차량 공유 플랫폼입니다.
            본 서비스는 중개 역할만을 수행하며, 실제 차량 대여 계약은 차주와 이용자 간에 직접 체결됩니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 책임 범위</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">2.1 차주의 책임</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>차량은 정상 작동 상태여야 하며, 안전 검사를 통과한 차량이어야 합니다.</li>
            <li>차량 보험이 유효해야 하며, 보험 내용을 이용자에게 고지해야 합니다.</li>
            <li>차량의 결함이나 문제점을 사전에 이용자에게 알려야 합니다.</li>
            <li>키 전달 및 반납 시간과 장소를 이용자와 명확히 합의해야 합니다.</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.2 이용자의 책임</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>유효한 운전면허증을 보유하고 있어야 합니다.</li>
            <li>차량을 안전하게 운행하고 교통법규를 준수해야 합니다.</li>
            <li>차량에 손상을 입혔을 경우 즉시 차주에게 알려야 합니다.</li>
            <li>약속한 시간과 장소에 차량을 반납해야 합니다.</li>
            <li>차량 내부를 깨끗하게 유지하고 반납해야 합니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 사고 처리</h2>
          <p className="text-gray-700 mb-4">
            차량 이용 중 사고가 발생한 경우:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>즉시 경찰에 신고하고 사고 처리를 진행합니다.</li>
            <li>차주에게 사고 사실을 즉시 통보합니다.</li>
            <li>보험 처리는 차주의 보험을 통해 진행됩니다.</li>
            <li>이용자의 과실로 인한 사고의 경우, 보험 자기부담금은 이용자가 부담합니다.</li>
            <li>보험 처리가 불가능한 손해는 이용자가 배상합니다.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 차량 사용 조건</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>차량은 계약된 기간 내에만 사용할 수 있습니다.</li>
            <li>무단으로 제3자에게 차량을 대여하거나 양도할 수 없습니다.</li>
            <li>음주운전, 과속 등 불법 행위에 차량을 사용할 수 없습니다.</li>
            <li>차량을 경주, 시험 주행 등 상업적 목적으로 사용할 수 없습니다.</li>
            <li>차량의 계기판 조작, 개조 등을 할 수 없습니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 예약 취소 및 환불</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 이용자 취소</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>이용 시작 48시간 전: 전액 환불 가능</li>
            <li>이용 시작 24~48시간 전: 50% 환불</li>
            <li>이용 시작 24시간 이내: 환불 불가</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.2 차주 취소</h3>
          <p className="text-gray-700 mb-4">
            차주가 일방적으로 예약을 취소하는 경우, 이용자는 전액 환불을 받을 수 있으며,
            차주에게는 서비스 이용 제한 등의 불이익이 발생할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. 개인정보 보호</h2>
          <p className="text-gray-700 mb-4">
            트립카셰어는 차주와 이용자의 개인정보를 보호하며, 서비스 제공 목적으로만 사용합니다.
            개인정보는 법령에 따라 안전하게 관리되며, 제3자에게 제공되지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. 분쟁 해결</h2>
          <p className="text-gray-700 mb-4">
            차주와 이용자 간 분쟁이 발생한 경우:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>당사자 간 원만한 협의를 우선으로 합니다.</li>
            <li>협의가 되지 않을 경우 트립카셰어가 중재를 시도할 수 있습니다.</li>
            <li>법적 분쟁은 대한민국 법률에 따라 해결합니다.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. 면책 조항</h2>
          <p className="text-gray-700 mb-4">
            트립카셰어는 다음 사항에 대해 책임을 지지 않습니다:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>차주와 이용자 간의 직접 거래로 인한 손해</li>
            <li>차량의 기계적 결함으로 인한 사고 또는 손해</li>
            <li>이용자의 과실로 인한 사고, 범칙금, 벌금 등</li>
            <li>차량 이용 중 발생한 분실, 도난 등</li>
            <li>천재지변, 불가항력으로 인한 서비스 중단</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. 기타 사항</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>본 동의서는 예고 없이 변경될 수 있으며, 변경 시 웹사이트에 공지합니다.</li>
            <li>변경된 약관은 공지 후 7일이 경과한 시점부터 효력이 발생합니다.</li>
            <li>예약 신청 시 본 동의서에 동의한 것으로 간주됩니다.</li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 font-semibold">
            ⚠️ 본 동의서는 MVP(최소 기능 제품) 단계의 기본 약관입니다.
          </p>
          <p className="text-blue-800 mt-2">
            정식 서비스 런칭 전에 법률 전문가의 검토를 받아 보완될 예정입니다.
            현재 단계에서는 플랫폼 기능 검증이 목적이며, 실제 거래 시에는
            반드시 추가적인 법적 보호 조치를 취하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}

