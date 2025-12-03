# Vercel 배포용 환경 변수 가이드

## ✅ Vercel에 반드시 포함해야 할 환경 변수

다음 환경 변수들은 프로덕션 배포에 필수입니다:

### Clerk 인증 (5개)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

### Supabase (4개)
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

**총 9개의 환경 변수가 필요합니다.**

---

## ❌ Vercel에서 빼야 할 환경 변수

다음 값들은 로컬 개발 전용이므로 Vercel에 추가하지 마세요:

### 1. Cursor MCP 관련 (로컬 개발 전용)
- `SUPABASE_ACCESS_TOKEN` 또는 `MCP_*` 관련 변수
- `.cursor/mcp.json`에 있는 토큰들
- **이유**: Cursor AI 개발 도구용이며, 프로덕션에서는 불필요

### 2. 예제/테스트 값
- `EXAMPLE_NAME` 또는 `EXAMPLE_*`로 시작하는 변수
- **이유**: 예제 값이며 실제로 사용되지 않음

### 3. 로컬 개발 전용 설정
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`이 `http://localhost:3000`을 가리키는 경우
  - ✅ 올바른 값: `/sign-in` (상대 경로)
  - ❌ 잘못된 값: `http://localhost:3000/sign-in`

### 4. 기타 로컬 전용 변수
- 로컬 Supabase 인스턴스 URL (`http://127.0.0.1:54321` 등)
- 로컬 개발 서버 관련 설정

---

## 🔍 확인 체크리스트

Vercel 환경 변수 설정 시 다음을 확인하세요:

- [ ] `EXAMPLE_NAME` 같은 예제 값이 있는지 확인
- [ ] 모든 URL이 프로덕션 URL인지 확인 (localhost 없음)
- [ ] Cursor MCP 관련 토큰이 없는지 확인
- [ ] Clerk 키가 프로덕션 키인지 확인 (테스트 키도 가능하지만 프로덕션 키 권장)
- [ ] Supabase 키가 프로덕션 프로젝트의 키인지 확인

---

## 📝 중요 참고사항

### 1. 프로덕션 vs 개발 키
- **Clerk**: 테스트 키(`pk_test_`, `sk_test_`)도 작동하지만, 프로덕션에서는 프로덕션 키(`pk_live_`, `sk_live_`) 사용 권장
- **Supabase**: 프로덕션 프로젝트의 키를 사용해야 함

### 2. 환경별 설정
- Vercel에서는 **Production**, **Preview**, **Development** 환경별로 다른 값을 설정할 수 있습니다
- 프로덕션 환경에는 프로덕션 키를, 프리뷰 환경에는 테스트 키를 사용하는 것을 권장합니다

### 3. 보안 주의사항
- `SUPABASE_SERVICE_ROLE_KEY`는 모든 RLS를 우회하는 강력한 키입니다
- Vercel의 환경 변수는 암호화되어 저장되지만, 절대 코드나 공개 저장소에 커밋하지 마세요

---

## 🚀 배포 후 확인

배포 후 다음을 확인하세요:

1. **환경 변수 로드 확인**
   - Vercel 로그에서 환경 변수 관련 에러가 없는지 확인

2. **인증 작동 확인**
   - 로그인/회원가입이 정상 작동하는지 확인
   - Clerk 대시보드에서 세션 확인

3. **Supabase 연결 확인**
   - 데이터베이스 쿼리가 정상 작동하는지 확인
   - Storage 업로드가 작동하는지 확인

