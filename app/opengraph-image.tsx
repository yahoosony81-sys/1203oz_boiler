import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TripCarShare - 제주 공항 차량 공유";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "40px",
        }}
      >
        {/* 로고/아이콘 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "20px",
            }}
          >
            <span style={{ fontSize: "50px" }}>🚗</span>
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
            }}
          >
            TripCarShare
          </span>
        </div>

        {/* 메인 타이틀 */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
            lineHeight: 1.2,
          }}
        >
          제주 공항 P2P 차량 공유
        </div>

        {/* 서브 타이틀 */}
        <div
          style={{
            fontSize: "32px",
            textAlign: "center",
            opacity: 0.9,
            maxWidth: "800px",
          }}
        >
          현지 차주와 직접 연결되는 편리하고 합리적인 차량 공유 서비스
        </div>

        {/* 하단 배지 */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "12px 24px",
              borderRadius: "30px",
              fontSize: "24px",
            }}
          >
            ✈️ 공항 픽업
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "12px 24px",
              borderRadius: "30px",
              fontSize: "24px",
            }}
          >
            💰 합리적 가격
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "12px 24px",
              borderRadius: "30px",
              fontSize: "24px",
            }}
          >
            🔒 안심 거래
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

