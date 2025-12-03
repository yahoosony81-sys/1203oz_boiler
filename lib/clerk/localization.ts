/**
 * @file lib/clerk/localization.ts
 * @description Clerk 한국어 로컬라이제이션 설정
 *
 * 공식 문서: https://clerk.com/docs/guides/customizing-clerk/localization
 *
 * 이 파일은 Clerk 컴포넌트의 한국어 번역 및 커스텀 메시지를 정의합니다.
 * 기본 한국어 번역은 @clerk/localizations의 koKR을 사용하며,
 * 필요시 여기서 커스텀 메시지를 추가할 수 있습니다.
 */

import { koKR } from "@clerk/localizations";

/**
 * 기본 한국어 로컬라이제이션
 * @clerk/localizations 패키지에서 제공하는 한국어 번역을 사용합니다.
 */
export const koreanLocalization = koKR;

/**
 * 커스텀 한국어 로컬라이제이션 (예제)
 *
 * 특정 에러 메시지나 문자열을 커스터마이징하려면 이 객체를 사용하세요.
 * 기본 koKR을 확장하여 필요한 부분만 오버라이드할 수 있습니다.
 *
 * @example
 * ```tsx
 * import { customKoreanLocalization } from '@/lib/clerk/localization';
 *
 * <ClerkProvider localization={customKoreanLocalization}>
 *   ...
 * </ClerkProvider>
 * ```
 */
export const customKoreanLocalization = {
  ...koKR,
    // 커스텀 에러 메시지 예제
    // 공식 문서: https://clerk.com/docs/guides/customizing-clerk/localization#custom-error-messages
    unstable__errors: {
      ...koKR.unstable__errors,
      
      // 예시: 접근이 허용되지 않은 이메일 도메인에 대한 커스텀 메시지
      // not_allowed_access:
      //   "접근이 허용되지 않은 이메일 도메인입니다. 회사 이메일 도메인을 허용 목록에 추가하려면 관리자에게 문의하세요.",
      
      // 필요시 다른 에러 메시지도 커스터마이징 가능
      // form_identifier_not_found: "이메일 또는 사용자 이름을 찾을 수 없습니다.",
      // form_password_incorrect: "비밀번호가 올바르지 않습니다.",
    },

    // 커스텀 문자열 예제 (필요시)
    // formFieldLabel__emailAddress: "이메일 주소",
    // formFieldLabel__password: "비밀번호",
    // formButtonPrimary__signIn: "로그인",
    // formButtonPrimary__signUp: "회원가입",
};

/**
 * 현재 사용 중인 로컬라이제이션
 * 
 * 기본 한국어 번역을 사용하려면 koreanLocalization을,
 * 커스텀 메시지가 필요하면 customKoreanLocalization을 사용하세요.
 */
export const currentLocalization = koreanLocalization;

