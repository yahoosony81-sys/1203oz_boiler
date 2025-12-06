"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { SyncUserProvider } from "./sync-user-provider";

/**
 * 모든 클라이언트 Provider들을 통합하는 컴포넌트
 *
 * ClerkProvider, SyncUserProvider 등 클라이언트 전용 Provider들을
 * 하나의 컴포넌트로 래핑하여 layout.tsx를 서버 컴포넌트로 유지할 수 있게 합니다.
 *
 * layout.tsx에 dynamic='force-dynamic'이 설정되어 있어 빌드 시 사전 렌더링을 건너뛰므로
 * 항상 ClerkProvider를 렌더링해도 안전합니다.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        // Tailwind CSS 4 호환성을 위한 설정
        cssLayerName: "clerk",
        elements: {
          // 카카오 로그인 버튼 스타일 (노란색)
          socialButtonsIconButton__kakao: {
            backgroundColor: "#FEE500",
            borderColor: "#FEE500",
            "&:hover": {
              backgroundColor: "#FFEB3B",
              borderColor: "#FFEB3B",
            },
          },
          socialButtonsBlockButton__kakao: {
            backgroundColor: "#FEE500",
            borderColor: "#FEE500",
            color: "#000000",
            "&:hover": {
              backgroundColor: "#FFEB3B",
              borderColor: "#FFEB3B",
            },
          },
        },
      }}
    >
      <SyncUserProvider>{children}</SyncUserProvider>
    </ClerkProvider>
  );
}

