# 트립카셰어 (TripCarShare)

공항 기반 P2P 차량 공유 플랫폼

## 🚗 프로젝트 소개

트립카셰어는 제주 공항을 시작으로, 여행객과 차주를 연결하는 혁신적인 차량 공유 플랫폼입니다.

- **차주**: 여행이나 출장으로 공항에 장기간 주차할 차량으로 수익을 창출하세요.
- **이용자**: 렌트카보다 저렴하고 편리하게 제주 여행에 필요한 차량을 이용하세요.

## ✨ 주요 기능

### 차주 (Vehicle Owner)
- ✅ 차량 등록 (사진, 가격, 이용 가능 기간 설정)
- ✅ 내 차량 관리 (수정, 삭제, 활성화/비활성화)
- ✅ 예약 요청 관리 (승인/거절)
- ✅ 예약 현황 확인

### 이용자 (Renter)
- ✅ 차량 검색 (날짜, 공항, 가격 필터)
- ✅ 차량 상세 정보 확인
- ✅ 예약 신청
- ✅ 내 예약 관리 (취소)

### 공통
- ✅ 회원가입/로그인 (Clerk 인증)
- ✅ 반응형 웹 디자인 (모바일/태블릿/데스크톱)
- ✅ 이용 가이드 및 약관

## 🛠️ 기술 스택

### Frontend
- **Next.js 15.5.6** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** (UI 컴포넌트)
- **lucide-react** (아이콘)

### Backend & Database
- **Supabase** (PostgreSQL)
  - Database: users, vehicles, bookings 테이블
  - Storage: vehicle-images 버킷
  - RLS: 개발 중 비활성화 (프로덕션에서 활성화 예정)
- **Server Actions** (API 대신 사용)

### Authentication
- **Clerk** (이메일/비밀번호, 소셜 로그인)
- Clerk ↔ Supabase 네이티브 통합

### Package Manager
- **pnpm**

## 📁 프로젝트 구조

```
nextjs-supabase-boilerplate-main/
├── app/                          # Next.js App Router
│   ├── (routes)/
│   │   ├── vehicles/            # 차량 관련 페이지
│   │   │   ├── page.tsx        # 검색 결과
│   │   │   ├── [id]/page.tsx   # 차량 상세
│   │   │   ├── new/page.tsx    # 차량 등록
│   │   │   └── my/page.tsx     # 내 차량 관리
│   │   ├── bookings/           # 예약 관련 페이지
│   │   │   ├── my/page.tsx     # 내 예약 (이용자)
│   │   │   └── received/page.tsx # 받은 예약 (차주)
│   │   ├── terms/              # 약관
│   │   └── guide/              # 이용 가이드
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # 홈 페이지
├── actions/                    # Server Actions
│   ├── vehicles.ts            # 차량 CRUD
│   └── bookings.ts            # 예약 CRUD
├── components/                # React 컴포넌트
│   ├── ui/                    # shadcn/ui 컴포넌트
│   ├── providers/             # React Context Providers
│   └── Navbar.tsx             # 네비게이션 바
├── lib/                       # 유틸리티 및 클라이언트
│   ├── supabase/              # Supabase 클라이언트들
│   │   ├── clerk-client.ts   # Client Component용
│   │   ├── server.ts         # Server Component용
│   │   ├── service-role.ts   # 관리자 작업용
│   │   └── client.ts         # 공개 데이터용
│   └── utils.ts               # 공통 유틸리티
├── types/                     # TypeScript 타입 정의
│   └── database.ts            # DB 타입
├── hooks/                     # 커스텀 React Hooks
├── supabase/                  # Supabase 설정
│   ├── migrations/            # SQL 마이그레이션
│   └── config.toml            # Supabase 프로젝트 설정
├── docs/                      # 문서
│   ├── PRD.md                 # 제품 요구사항 문서
│   ├── TODO.md                # 개발 체크리스트
│   └── DEPLOYMENT_GUIDE.md   # 배포 가이드
└── README.md                  # 이 파일
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone <repository-url>
cd nextjs-supabase-boilerplate-main
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 추가하세요:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STORAGE_BUCKET=vehicle-images
```

### 4. 데이터베이스 마이그레이션

Supabase Dashboard → SQL Editor에서 다음 파일들을 순서대로 실행하세요:

1. `supabase/migrations/20250104000000_create_tripcarshare_schema.sql`
2. `supabase/migrations/20250104000001_create_vehicle_images_bucket.sql`

또는 Supabase CLI 사용:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 5. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📝 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# Linting
pnpm lint
```

## 📚 문서

- [PRD (제품 요구사항 문서)](docs/PRD.md)
- [TODO (개발 체크리스트)](docs/TODO.md)
- [배포 가이드](docs/DEPLOYMENT_GUIDE.md)
- [이용 가이드](/guide) (웹사이트)
- [대여 동의서](/terms/rental-agreement) (웹사이트)

## 🗄️ 데이터베이스 스키마

### users (사용자)
- `id`: UUID (Primary Key)
- `clerk_id`: TEXT (Unique, Clerk User ID)
- `name`: TEXT
- `phone`: TEXT (Optional)
- `role`: TEXT (owner/renter)
- `is_verified`: BOOLEAN
- `created_at`, `updated_at`: TIMESTAMP

### vehicles (차량)
- `id`: UUID (Primary Key)
- `owner_id`: TEXT (Clerk User ID)
- `model`, `year`, `plate_number`: 차량 정보
- `description`, `price_per_day`: 상세 정보
- `images`: TEXT[] (이미지 URL 배열)
- `available_from`, `available_until`: 이용 가능 기간
- `airport_location`, `parking_location`: 위치 정보
- `status`: TEXT (active/reserved/unavailable)
- `created_at`, `updated_at`: TIMESTAMP

### bookings (예약)
- `id`: UUID (Primary Key)
- `vehicle_id`: UUID (Foreign Key → vehicles)
- `renter_id`: TEXT (Clerk User ID)
- `start_date`, `end_date`: 예약 기간
- `status`: TEXT (pending/approved/rejected/completed/cancelled)
- `pickup_location`, `return_location`: 픽업/반납 위치
- `total_price`: INTEGER
- `created_at`, `updated_at`: TIMESTAMP

## 🎯 MVP 검증 목표

### 정량적 지표
- ✅ 런칭 후 30일 내 등록 차량 30대 이상
- ✅ 차량 상세 페이지 조회 대비 예약 요청 10% 이상
- ✅ 차주 활성 사용자 수 추적
- ✅ 이용자 활성 사용자 수 추적

### 정성적 지표
- ✅ 초기 사용자 피드백 수집
- ✅ 보험/사고 관련 불안 요소 파악
- ✅ 검색/예약 플로우 난이도 평가
- ✅ 키 전달 방식 만족도 조사
- ✅ NPS 설문 (목표 4.0 이상)

## 🚧 현재 제약사항

### v1.0에서 미구현
- ❌ 앱 (반응형 웹만 제공)
- ❌ 플랫폼 내 결제/정산 (운영팀 수동 처리)
- ❌ 리뷰/평가 기능
- ❌ 실시간 GPS 위치 추적
- ❌ 키박스/스마트키 하드웨어
- ❌ 이메일/SMS 알림 자동화

### v2 이후 계획
- 🔜 결제/정산 자동화
- 🔜 리뷰/평가 기능
- 🔜 보험 API 연동
- 🔜 다른 공항 확장 (김포, 부산, 무안)
- 🔜 전용 모바일 앱
- 🔜 키박스/스마트키 연동

## 🤝 기여하기

이 프로젝트는 MVP 단계입니다. 피드백과 제안을 환영합니다!

## 📄 라이선스

This project is private and proprietary.

## 📞 문의

- **이메일**: support@tripcarshare.com
- **GitHub Issues**: [이슈 생성하기](../../issues)

---

**⚠️ 주의**: 이 프로젝트는 MVP(최소 기능 제품) 단계입니다. 정식 서비스 런칭 전에 법률 자문, 보험 연동, 추가 보안 조치 등이 필요합니다.
