# 트립카셰어 배포 가이드

## 배포 전 체크리스트

### 1. 데이터베이스 마이그레이션

Supabase 프로젝트에서 마이그레이션을 실행하세요:

```bash
# Supabase CLI 설치 (아직 설치하지 않았다면)
npm install -g supabase

# Supabase 프로젝트와 연결
supabase login
supabase link --project-ref your-project-ref

# 마이그레이션 적용
supabase db push
```

또는 Supabase Dashboard에서 직접 SQL 실행:
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/` 폴더의 SQL 파일들을 순서대로 실행:
   - `20250104000000_create_tripcarshare_schema.sql`
   - `20250104000001_create_vehicle_images_bucket.sql`

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_STORAGE_BUCKET=vehicle-images
```

### 3. 의존성 설치 및 빌드 테스트

```bash
# 의존성 설치
pnpm install

# 빌드 테스트
pnpm build

# 로컬 실행 테스트
pnpm start
```

## Vercel 배포

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치 (아직 설치하지 않았다면)
npm install -g vercel

# Vercel 로그인
vercel login

# 프로젝트 배포
vercel
```

### 2. 환경 변수 설정

Vercel Dashboard에서 환경 변수를 설정하세요:
- Settings → Environment Variables
- 위의 모든 환경 변수를 추가 (Production, Preview, Development 모두)

### 3. 배포 확인

```bash
# 프로덕션 배포
vercel --prod
```

## 배포 후 테스트

### 기능별 테스트 체크리스트

#### 1. 인증 테스트
- [ ] 회원가입 가능
- [ ] 로그인 가능
- [ ] 로그아웃 가능
- [ ] 사용자 프로필 표시

#### 2. 차량 등록 (차주)
- [ ] 차량 등록 폼 정상 작동
- [ ] 이미지 업로드 가능
- [ ] 등록된 차량이 "내 차량"에 표시
- [ ] 차량 수정 가능
- [ ] 차량 삭제 가능
- [ ] 차량 상태 토글 (활성화/비활성화)

#### 3. 차량 검색 (이용자)
- [ ] 홈페이지 검색 폼 작동
- [ ] 날짜별 필터링 작동
- [ ] 가격 필터링 작동
- [ ] 검색 결과 정상 표시
- [ ] 차량 상세 페이지 정상 표시

#### 4. 예약 기능
- [ ] 예약 신청 가능
- [ ] 총 금액 자동 계산
- [ ] 날짜 중복 체크 작동
- [ ] 자신의 차량에는 예약 불가

#### 5. 예약 관리
- [ ] 이용자: 내 예약 목록 조회
- [ ] 이용자: 예약 취소 가능
- [ ] 차주: 받은 예약 목록 조회
- [ ] 차주: 예약 승인 가능
- [ ] 차주: 예약 거절 가능

#### 6. UI/UX
- [ ] 반응형 디자인 (모바일/태블릿/데스크톱)
- [ ] 네비게이션 메뉴 작동
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시
- [ ] 약관 페이지 표시
- [ ] 이용 가이드 페이지 표시

## 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용 확인
- 이미지 사이즈 제한 (최대 10MB)
- WebP 포맷 고려

### 데이터베이스 최적화
- 인덱스 확인 (vehicles, bookings 테이블)
- 필요한 필드만 select
- Pagination 고려 (차량/예약 목록이 많아지면)

### 캐싱
- Vercel Edge Network 자동 캐싱 활용
- revalidatePath() 활용하여 데이터 재검증

## 모니터링

### Vercel Analytics
- Vercel Dashboard에서 Analytics 활성화
- Web Vitals 확인 (LCP, FID, CLS)

### Supabase Logs
- Supabase Dashboard → Logs
- 데이터베이스 쿼리 성능 모니터링
- Storage 사용량 확인

### 에러 추적 (선택)
- Sentry 연동 고려
- 프로덕션 에러 로그 수집

## 보안 점검

### 환경 변수
- [ ] 모든 비밀 키가 `.env.local`에만 있고 Git에 커밋되지 않음
- [ ] Vercel 환경 변수에 모든 키가 설정됨

### Supabase 보안
- [ ] Service Role Key는 서버 사이드에서만 사용
- [ ] Anon Key는 클라이언트 사이드에서 안전하게 사용
- [ ] Storage 정책이 올바르게 설정됨

### API 보안
- [ ] Server Actions에 인증 체크 적용
- [ ] 입력값 검증 (XSS, SQL Injection 방어)
- [ ] Rate Limiting 고려 (v2에서)

## 트러블슈팅

### 빌드 에러
- TypeScript 에러 확인: `pnpm build`
- 환경 변수 확인
- 의존성 버전 확인

### 런타임 에러
- 브라우저 콘솔 확인
- Vercel 로그 확인
- Supabase 로그 확인

### 데이터베이스 연결 문제
- Supabase URL 확인
- API Key 확인
- RLS 정책 확인 (개발 중에는 비활성화됨)

## Post-Launch 계획 (v1.1)

### 단기 (1~2주)
- [ ] 사용자 피드백 수집
- [ ] 버그 수정
- [ ] UI/UX 개선

### 중기 (1~2개월)
- [ ] 결제 시스템 통합
- [ ] 리뷰/평가 기능
- [ ] 알림 기능 강화 (이메일/SMS)

### 장기 (3개월~)
- [ ] 보험 API 연동
- [ ] 다른 공항 확장 (김포, 부산, 무안)
- [ ] 전용 모바일 앱
- [ ] 키박스/스마트키 하드웨어 연동

## 지원

문제가 발생하면:
1. `docs/` 폴더의 문서 확인
2. GitHub Issues 생성
3. 개발팀에 문의

---

**참고**: 이 문서는 MVP 배포 가이드입니다. 프로덕션 런칭 전에는 추가적인 보안 검토와 법률 자문이 필요합니다.

