"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { SyncUserProvider } from "./sync-user-provider";

/**
 * 모든 클라이언트 Provider들을 통합하는 컴포넌트
 *
 * ClerkProvider, SyncUserProvider 등 클라이언트 전용 Provider들을
 * 하나의 컴포넌트로 래핑하여 layout.tsx를 서버 컴포넌트로 유지할 수 있게 합니다.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        // Tailwind CSS 4 호환성을 위한 설정
        // 공식 문서: https://clerk.com/docs/guides/customizing-clerk/localization
        cssLayerName: "clerk",
      }}
    >
      <SyncUserProvider>{children}</SyncUserProvider>
    </ClerkProvider>
  );
}

