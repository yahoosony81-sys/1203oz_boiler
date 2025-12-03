# Vercel 배포 완벽 가이드 (단계별)

이 가이드는 처음부터 끝까지 Vercel에 배포하는 모든 과정을 단계별로 설명합니다.

---

## 📋 사전 준비 사항

배포 전에 다음이 준비되어 있어야 합니다:

- ✅ GitHub 저장소에 코드가 푸시되어 있음
- ✅ Clerk 계정 및 API 키 준비됨
- ✅ Supabase 프로젝트 및 API 키 준비됨

---

## 1단계: Vercel 계정 생성 및 로그인

### 1-1. Vercel 접속
1. 브라우저에서 [https://vercel.com](https://vercel.com) 접속
2. 우측 상단의 **"Sign Up"** 또는 **"Log In"** 클릭

### 1-2. GitHub로 로그인 (권장)
1. **"Continue with GitHub"** 클릭
2. GitHub 계정으로 로그인
3. Vercel이 GitHub 저장소에 접근할 수 있음 확인 후 승인

---

## 2단계: 새 프로젝트 생성

### 2-1. 프로젝트 추가
1. Vercel Dashboard에서 **"Add New..."** 버튼 클릭
2. 드롭다운에서 **"Project"** 선택

### 2-2. GitHub 저장소 선택
1. **"Import Git Repository"** 섹션에서 GitHub 저장소 목록 확인
2. **`yahoosony81-sys/1203oz_boiler`** 저장소 찾기
3. 저장소 옆의 **"Import"** 버튼 클릭

**만약 저장소가 보이지 않으면:**
- **"Adjust GitHub App Permissions"** 클릭
- 저장소 접근 권한 확인 및 승인

---

## 3단계: 프로젝트 설정

### 3-1. 프로젝트 이름 설정
- **Project Name**: `1203oz_boiler` (또는 원하는 이름)
- 기본값 그대로 사용해도 됩니다

### 3-2. Framework 설정 (자동 감지됨)
- **Framework Preset**: `Next.js` (자동으로 감지됨)
- 변경하지 않아도 됩니다

### 3-3. Root Directory 설정
- **Root Directory**: `./` (기본값)
- 변경하지 않아도 됩니다

### 3-4. Build and Output Settings (자동 감지됨)
다음 값들이 자동으로 설정되어야 합니다:
- **Build Command**: `pnpm build` (또는 `npm run build`)
- **Output Directory**: `.next` (자동 감지)
- **Install Command**: `pnpm install` (또는 `npm install`)

**확인 사항:**
- Package Manager가 `pnpm`으로 감지되는지 확인
- 감지되지 않으면 수동으로 `pnpm` 선택

### 3-5. Environment Variables 설정 (중요!)
**이 단계는 매우 중요합니다!** 아래 9개의 환경 변수를 모두 입력해야 합니다.

#### Clerk 인증 변수 (5개)

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - **값**: Clerk Dashboard → API Keys → Publishable Key 복사
   - **형식**: `pk_test_...` 또는 `pk_live_...`
   - **예시**: `pk_test_ZXRoaWNhbC1tYWNhdy04OS5...`

2. **CLERK_SECRET_KEY**
   - **값**: Clerk Dashboard → API Keys → Secret Key 복사
   - **형식**: `sk_test_...` 또는 `sk_live_...`
   - **예시**: `sk_test_ml14QE8bFwRuzDPAG8Pip8XYV...`
   - ⚠️ **주의**: 절대 공개하지 마세요!

3. **NEXT_PUBLIC_CLERK_SIGN_IN_URL**
   - **값**: `/sign-in`
   - **형식**: 상대 경로 (절대 URL 아님)

4. **NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL**
   - **값**: `/`
   - **형식**: 상대 경로

5. **NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL**
   - **값**: `/`
   - **형식**: 상대 경로

#### Supabase 변수 (4개)

6. **NEXT_PUBLIC_SUPABASE_URL**
   - **값**: Supabase Dashboard → Settings → API → Project URL 복사
   - **형식**: `https://xxxxx.supabase.co`
   - **예시**: `https://wehdyytpeorqyjppyexa.supabase.co`

7. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - **값**: Supabase Dashboard → Settings → API → anon public 키 복사
   - **형식**: JWT 토큰 (매우 긴 문자열)
   - **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

8. **SUPABASE_SERVICE_ROLE_KEY**
   - **값**: Supabase Dashboard → Settings → API → service_role secret 키 복사
   - **형식**: JWT 토큰 (매우 긴 문자열)
   - **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - ⚠️ **주의**: 절대 공개하지 마세요! 모든 RLS를 우회하는 강력한 키입니다.

9. **NEXT_PUBLIC_STORAGE_BUCKET**
   - **값**: `uploads`
   - **형식**: 문자열

### 3-6. 환경 변수 입력 방법

1. **"Environment Variables"** 섹션 찾기
2. 각 변수를 하나씩 추가:
   - **Key** 입력란에 변수 이름 입력 (예: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
   - **Value** 입력란에 실제 값 입력
   - **"Add"** 또는 **"Save"** 버튼 클릭
3. 위 9개 변수를 모두 추가할 때까지 반복

**팁:**
- 환경 변수는 대소문자를 구분합니다. 정확히 입력하세요.
- 값 앞뒤에 공백이나 따옴표가 없어야 합니다.
- 긴 값은 복사-붙여넣기로 입력하세요.

---

## 4단계: 배포 실행

### 4-1. 배포 시작
1. 모든 설정이 완료되었는지 확인
2. 페이지 하단의 **"Deploy"** 버튼 클릭

### 4-2. 배포 진행 상황 확인
- 배포가 시작되면 진행 상황이 표시됩니다
- 보통 2-5분 정도 소요됩니다
- 빌드 로그를 실시간으로 확인할 수 있습니다

---

## 5단계: 배포 완료 확인

### 5-1. 배포 성공 확인
배포가 완료되면:
- ✅ **"Congratulations!"** 메시지 표시
- ✅ 배포된 사이트 URL 제공 (예: `https://1203oz_boiler.vercel.app`)

### 5-2. 사이트 확인
1. 제공된 URL 클릭하여 사이트 열기
2. 다음 기능들이 정상 작동하는지 확인:
   - ✅ 홈페이지 로드
   - ✅ 로그인 버튼 클릭 → Clerk 로그인 모달 표시
   - ✅ 회원가입 기능
   - ✅ 로그인 후 사용자 메뉴 표시

---

## 🚨 자주 발생하는 에러 및 해결 방법

### 에러 1: "Build Failed"
**원인**: 빌드 중 에러 발생

**해결 방법:**
1. Vercel Dashboard → 프로젝트 → **"Deployments"** 탭
2. 실패한 배포 클릭
3. **"Build Logs"** 확인
4. 에러 메시지 확인 후 수정

**일반적인 원인:**
- 환경 변수가 누락됨
- TypeScript 타입 에러
- 의존성 설치 실패

### 에러 2: "Environment Variable Missing"
**원인**: 필수 환경 변수가 설정되지 않음

**해결 방법:**
1. 프로젝트 → **Settings** → **Environment Variables**
2. 누락된 변수 추가
3. 다시 배포

### 에러 3: "Module not found"
**원인**: 패키지가 설치되지 않음

**해결 방법:**
1. 로컬에서 `pnpm install` 실행하여 `package.json` 확인
2. 모든 의존성이 `package.json`에 포함되어 있는지 확인
3. 다시 배포

### 에러 4: "GitHub repository not found"
**원인**: GitHub 저장소 연결 문제

**해결 방법:**
1. GitHub 저장소가 실제로 존재하는지 확인
2. Vercel에 GitHub 권한이 있는지 확인
3. Settings → Git → **"Disconnect"** 후 다시 연결

---

## 📝 배포 후 확인 체크리스트

배포가 완료된 후 다음을 확인하세요:

- [ ] 사이트가 정상적으로 로드됨
- [ ] 로그인 버튼이 표시됨
- [ ] 로그인 모달이 정상 작동함
- [ ] 회원가입이 정상 작동함
- [ ] 로그인 후 사용자 메뉴가 표시됨
- [ ] Supabase 연결이 정상 작동함 (데이터베이스 쿼리)
- [ ] Storage 업로드가 정상 작동함 (해당 기능이 있다면)

---

## 🔄 코드 업데이트 후 재배포

코드를 수정한 후 다시 배포하려면:

### 방법 1: 자동 배포 (권장)
1. 로컬에서 코드 수정
2. Git에 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "Update: 변경 사항 설명"
   git push origin main
   ```
3. Vercel이 자동으로 감지하여 새 배포 시작

### 방법 2: 수동 재배포
1. Vercel Dashboard → 프로젝트
2. **"Deployments"** 탭
3. 최신 배포 옆의 **"..."** 메뉴 클릭
4. **"Redeploy"** 선택

---

## 💡 유용한 팁

1. **환경 변수 관리**
   - 프로덕션, 프리뷰, 개발 환경별로 다른 값을 설정할 수 있습니다
   - Settings → Environment Variables에서 환경별 설정 가능

2. **도메인 설정**
   - 배포 후 Settings → Domains에서 커스텀 도메인 추가 가능

3. **빌드 로그 확인**
   - 배포 중 문제가 발생하면 Build Logs에서 상세한 에러 확인 가능

4. **환경 변수 보안**
   - `CLERK_SECRET_KEY`와 `SUPABASE_SERVICE_ROLE_KEY`는 절대 공개하지 마세요
   - GitHub에 커밋하지 마세요 (`.env` 파일은 `.gitignore`에 포함됨)

---

## 📞 도움이 필요하신가요?

배포 중 문제가 발생하면:
1. Vercel Dashboard의 Build Logs 확인
2. 에러 메시지를 복사하여 검색
3. Vercel 공식 문서 참고: [https://vercel.com/docs](https://vercel.com/docs)

---

**배포 성공을 기원합니다! 🚀**

