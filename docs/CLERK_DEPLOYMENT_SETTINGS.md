# Clerk 배포 설정 가이드

## 🔐 Clerk Dashboard 설정

Vercel 또는 다른 호스팅에 배포하기 전에 Clerk Dashboard에서 다음 설정들을 업데이트해야 합니다.

---

## 1. 도메인 설정

### 1-1. Allowed Origins (CORS)

**위치**: Clerk Dashboard → Configure → Settings → **Allowed origins**

배포된 프로덕션 도메인을 추가하세요:

```
https://your-domain.vercel.app
https://www.your-custom-domain.com  (커스텀 도메인이 있는 경우)
```

**중요**: 
- `localhost`는 개발용이므로 프로덕션에서는 실제 도메인을 사용해야 합니다
- 여러 도메인이 있다면 모두 추가하세요

### 1-2. Redirect URLs

**위치**: Clerk Dashboard → Configure → Paths

다음 경로들을 확인하세요:

- **Sign-in URL**: `/sign-in`
- **Sign-up URL**: `/sign-up`
- **After sign-in URL**: `/` (홈으로 리다이렉트)
- **After sign-up URL**: `/` (홈으로 리다이렉트)

**프로덕션용 Redirect URLs 추가**:

Clerk Dashboard → Configure → Settings → **Allowed redirect URLs**

```
https://your-domain.vercel.app
https://your-domain.vercel.app/sign-in
https://your-domain.vercel.app/sign-up
```

---

## 2. API Keys 확인

### 2-1. Production Keys

**위치**: Clerk Dashboard → API Keys

프로덕션 배포 시 **Production** 탭의 키를 사용해야 합니다:

```bash
# Production Keys (Vercel 환경 변수에 설정)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # pk_live로 시작
CLERK_SECRET_KEY=sk_live_...                   # sk_live로 시작
```

**주의**:
- Development 키(`pk_test_`, `sk_test_`)는 개발 환경에서만 사용
- Production 키(`pk_live_`, `sk_live_`)는 배포 환경에서 사용
- Vercel의 **Production** 환경 변수에 Production 키를 설정하세요

---

## 3. Webhook 설정 (Supabase 사용자 동기화)

### 3-1. Webhook Endpoint 생성

**위치**: Clerk Dashboard → Configure → **Webhooks**

"Add Endpoint" 클릭 후:

**Endpoint URL**:
```
https://your-domain.vercel.app/api/webhooks/clerk
```

**Events to listen to** (선택):
- `user.created` - 사용자 생성 시
- `user.updated` - 사용자 정보 업데이트 시

**주의**: 
- 현재 프로젝트는 `SyncUserProvider`를 통해 클라이언트 사이드에서 동기화하므로 Webhook은 **선택사항**입니다
- 더 안정적인 동기화를 원하면 Webhook을 구현하세요 (v1.1 이후)

### 3-2. Webhook Secret 저장

Webhook을 생성하면 **Signing Secret**이 생성됩니다.

이를 Vercel 환경 변수에 추가:

```bash
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## 4. 소셜 로그인 설정 (선택)

Google, Kakao 등 소셜 로그인을 사용하려면:

**위치**: Clerk Dashboard → Configure → **Social Connections**

### 4-1. Google OAuth (예시)

1. **Google Cloud Console**에서 OAuth 클라이언트 생성
2. **Authorized redirect URIs** 추가:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
3. Client ID와 Client Secret을 Clerk에 입력

### 4-2. Kakao Login (예시)

1. **Kakao Developers**에서 앱 생성
2. **Redirect URI** 추가:
   ```
   https://your-domain.vercel.app/api/auth/callback/kakao
   ```
3. REST API 키를 Clerk에 입력

---

## 5. 한국어 지원 (Korean Localization)

현재 프로젝트는 이미 한국어를 지원하도록 설정되어 있습니다:

```tsx
// app/layout.tsx
import { koKR } from "@clerk/localizations";

<ClerkProvider localization={koKR}>
```

**추가 설정 필요 없음** ✅

---

## 6. Production 체크리스트

배포 전 Clerk Dashboard에서 확인:

### ✅ 필수 항목
- [ ] Allowed origins에 프로덕션 도메인 추가
- [ ] Production API Keys 사용 (pk_live_, sk_live_)
- [ ] Redirect URLs 설정 확인
- [ ] Sign-in/Sign-up 경로 설정 확인

### 🔧 선택 항목
- [ ] Webhook 설정 (더 안정적인 동기화)
- [ ] 소셜 로그인 설정 (Google, Kakao 등)
- [ ] SMS 인증 설정 (전화번호 인증)
- [ ] 이메일 템플릿 커스터마이징

---

## 7. Vercel 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables

### Production 환경 변수

```bash
# Clerk (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Clerk Webhook (선택)
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_STORAGE_BUCKET=vehicle-images
```

**중요**: 
- 각 환경 변수에 대해 **Production**, **Preview**, **Development** 체크박스를 적절히 선택하세요
- Production에는 `pk_live_`, `sk_live_` 키 사용
- Development에는 `pk_test_`, `sk_test_` 키 사용 가능

---

## 8. 배포 후 테스트

배포 완료 후 다음 항목들을 테스트하세요:

### ✅ 인증 테스트
- [ ] 회원가입 (이메일/비밀번호)
- [ ] 로그인
- [ ] 로그아웃
- [ ] 소셜 로그인 (설정한 경우)
- [ ] 프로필 표시
- [ ] Supabase users 테이블에 자동 동기화 확인

### ✅ 리다이렉트 테스트
- [ ] 로그인 후 홈으로 이동
- [ ] 로그아웃 후 로그인 페이지로 이동
- [ ] 보호된 페이지 접근 시 로그인 페이지로 리다이렉트

---

## 9. 문제 해결

### 에러: "Invalid publishable key"
- Production 키를 사용하는지 확인
- Vercel 환경 변수가 올바른지 확인
- 배포 후 재시작 필요할 수 있음

### 에러: "Redirect URI mismatch"
- Clerk Dashboard의 Allowed redirect URLs 확인
- 프로덕션 도메인이 추가되었는지 확인

### 에러: "CORS policy"
- Clerk Dashboard의 Allowed origins 확인
- 프로덕션 도메인이 추가되었는지 확인

### Supabase 동기화 안됨
- `SyncUserProvider`가 layout.tsx에 있는지 확인
- `/api/sync-user` 엔드포인트가 정상 작동하는지 확인
- 브라우저 콘솔 및 Vercel 로그 확인

---

## 10. 추가 보안 설정 (권장)

### 10-1. 이메일 인증 필수

**위치**: Clerk Dashboard → Configure → **Email & Phone**

- "Require email verification" 활성화
- 가짜 이메일로 가입 방지

### 10-2. Rate Limiting

**위치**: Clerk Dashboard → Configure → **Attack Protection**

- Rate limiting 활성화 (기본적으로 활성화됨)
- 무차별 대입 공격(brute force) 방지

### 10-3. Session 설정

**위치**: Clerk Dashboard → Configure → **Sessions**

- Session lifetime 설정 (기본: 7일)
- "Require sign-in on new device" 고려

---

## 📞 추가 지원

Clerk 관련 문제 발생 시:
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Support](https://clerk.com/support)
- [Clerk Discord Community](https://clerk.com/discord)

---

**다음 단계**: [배포 가이드](./DEPLOYMENT_GUIDE.md) 참고하여 Vercel 배포 진행

