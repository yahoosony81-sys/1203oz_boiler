# Toss Payments v1 테스트 결제 설정 가이드

## 개요

TripCarShare 프로젝트는 Toss Payments v1 결제창 방식을 사용하여 테스트 결제를 구현합니다.

## 환경 변수 설정

### 필수 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Toss Payments 테스트 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq
TOSS_SECRET_KEY=test_sk_D5GePWvyJnrK0W0k6q8gLzN97Eoq

# 앱 URL (결제 성공/실패 리다이렉트용)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 환경 변수 설명

#### `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- **타입**: Public (클라이언트에서 사용)
- **설명**: Toss Payments 테스트 클라이언트 키
- **용도**: 결제창 호출 시 사용
- **예시**: `test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq`

#### `TOSS_SECRET_KEY`
- **타입**: Secret (서버에서만 사용)
- **설명**: Toss Payments 테스트 시크릿 키
- **용도**: 결제 승인 API 호출 시 사용
- **예시**: `test_sk_D5GePWvyJnrK0W0k6q8gLzN97Eoq`
- **⚠️ 주의**: 절대 클라이언트 코드에 노출하지 마세요!

#### `NEXT_PUBLIC_APP_URL`
- **타입**: Public
- **설명**: 앱의 기본 URL
- **용도**: 결제 성공/실패 후 리다이렉트 URL 생성
- **로컬 개발**: `http://localhost:3000`
- **프로덕션**: 실제 도메인 URL (예: `https://yourdomain.com`)

## 테스트 키 발급 방법

1. [Toss Payments 개발자센터](https://developers.tosspayments.com/) 접속
2. 회원가입 또는 로그인
3. 테스트 키 발급
   - 테스트 모드에서 자동으로 제공되는 테스트 키 사용
   - 또는 직접 테스트 키 생성

## 테스트 카드 정보

Toss Payments 테스트 환경에서 사용할 수 있는 테스트 카드:

### 성공 케이스
- **카드번호**: `1234-5678-9012-3456`
- **유효기간**: `12/34`
- **CVC**: `123`
- **비밀번호**: `123456`

### 실패 케이스
- **카드번호**: `4000-0000-0000-0002` (한도 초과)
- **카드번호**: `4000-0000-0000-0003` (카드사 거절)

## 보안 권장 사항

### ✅ DO
- Secret Key는 서버 사이드에서만 사용
- 환경 변수는 `.env.local`에 저장 (Git에 커밋하지 않음)
- 프로덕션에서는 실제 키 사용 (테스트 키 사용 금지)

### ❌ DON'T
- Secret Key를 클라이언트 코드에 하드코딩
- Secret Key를 Git에 커밋
- 테스트 키를 프로덕션 환경에서 사용

## 결제 플로우

1. **결제 준비**: `createPaymentIntent` Server Action 호출
2. **결제창 호출**: Toss Payments v1 결제창으로 리다이렉트
3. **결제 진행**: 사용자가 테스트 카드로 결제 승인
4. **결제 승인**: 성공 페이지에서 `confirmPayment` 호출
5. **DB 업데이트**: `bookings.payment_status = 'paid'` 업데이트
6. **예약 카트 비우기**: 해당 사용자의 pending + unpaid 예약 삭제

## 결제 실패 처리

결제 실패 시:
- **DB 변경 없음**: 요구사항에 따라 DB는 변경하지 않음
- **안내 메시지만 표시**: 사용자에게 실패 사유 안내

## 문제 해결

### 결제창이 열리지 않는 경우
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 결제 승인 실패
- `TOSS_SECRET_KEY`가 올바르게 설정되었는지 확인
- 서버 로그에서 에러 메시지 확인
- Toss Payments 개발자센터에서 결제 내역 확인

### 리다이렉트 URL 오류
- `NEXT_PUBLIC_APP_URL`이 올바르게 설정되었는지 확인
- 로컬 개발 시 `http://localhost:3000` 사용
- 프로덕션에서는 실제 도메인 URL 사용

## 참고 자료

- [Toss Payments 개발자 문서](https://docs.tosspayments.com/)
- [Toss Payments v1 결제창 가이드](https://docs.tosspayments.com/guides/payment-widget/integration)

