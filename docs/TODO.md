# TripCarShare – Development TODO List (PRD 기반)

## PHASE 1 — 프로젝트 환경 & DB 구축

### 1-1. 프로젝트 환경 세팅

**Next.js / Clerk / Supabase 연결 확인**
- [x] Next.js 15 프로젝트 실행 확인
- [x] Clerk Provider 정상 동작 체크
- [x] useUser 에러 해결 (캐시 삭제로 해결)
- [x] Supabase 클라이언트 연결 확인

**환경 변수 설정**
- [x] NEXT_PUBLIC_SUPABASE_URL
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] CLERK_PUBLISHABLE_KEY
- [x] CLERK_SECRET_KEY

### 1-2. DB Schema 생성 (Supabase)

**users 테이블**
- [x] clerk_id
- [x] name
- [x] phone
- [x] role (owner/renter)
- [x] is_verified

**vehicles 테이블**
- [x] owner_id
- [x] model, year, plate_number
- [x] description
- [x] price_per_day
- [x] images array
- [x] available_from
- [x] available_until
- [x] airport_location
- [x] parking_location
- [x] status

**bookings 테이블 (결제 포함)**
- [x] vehicle_id
- [x] renter_id
- [x] start_date
- [x] end_date
- [x] total_price
- [x] status (pending/approved/...)
- [x] payment_status (unpaid/paid/failed)
- [x] payment_id
- [x] order_id

### 1-3. Storage 구성
- [x] vehicle-images 버킷 생성
- [x] 업로드 규칙 설정
- [x] 차량 이미지 저장 경로 설계: `{clerkId}/{vehicleId}/filename`

---

## PHASE 2 — 차량 등록 기능 (Owner)

### 2-1. 차량 등록 페이지 (/vehicles/new)

**입력 폼 UI 구현**
- [x] 차종, 연식, 번호판
- [x] 상세 설명
- [x] 가격 설정
- [x] 가능 날짜 선택 UI (DateRangePicker)
- [x] 공항 선택
- [x] 주차 위치 입력
- [x] 이미지 업로드 (ImageUploader 컴포넌트)

**Server Action: createVehicle**
- [x] 입력값 검증
- [x] 이미지 Supabase Storage 업로드
- [x] vehicles 테이블 insert
- [x] 작성자(owner_id) 자동 연결
- [x] 업로드 실패 예외 처리
- [x] 성공 후 redirect

### 2-2. 내 차량 관리 (/vehicles/my)
- [x] 내가 등록한 차량 목록 UI
- [x] 차량 수정 페이지 연결 (링크만)
- [x] 차량 삭제 기능
- [x] 차량 활성/비활성 toggle
- [x] 해당 차량 예약 현황 summary 표시

---

## PHASE 3 — 차량 검색 & 예약 (Renter)

### 3-1. 홈 검색 UI
- [x] 날짜 선택
- [x] 공항 선택
- [x] 검색 버튼

### 3-2. 검색 결과 (/vehicles)
- [x] VehicleCard 리스트
- [x] 필터 UI
  - [x] 가격
  - [ ] 차종
  - [x] 연식

### 3-3. 차량 상세 페이지 (/vehicles/[id])
- [x] 이미지 갤러리
- [x] 기본 정보 (차종, 연식, 번호판)
- [x] 상세 설명
- [x] 가격
- [x] 위치
- [x] 이용 가능 날짜 UI 캘린더
- [x] 총 금액 자동 계산
- [x] 예약 신청 버튼

**예약 상태에 따라 UI 다르게 표시**
- [x] pending → "승인 대기중"
- [x] approved → 결제 버튼 활성화
- [x] paid → "결제 완료 / 예약 내역 보기"

### 3-4. Server Action: createBooking
- [x] 날짜 중복 체크
- [x] 총 가격 계산
- [x] bookings insert
- [x] 상태 = pending
- [x] 에러 처리

---

## PHASE 4 — 예약 관리 기능

### 4-1. 차주용 예약 관리 (/bookings/received)
- [x] 예약 요청 목록
- [x] 예약 상세 모달 또는 상세 페이지
- [x] 승인 버튼
- [x] 거절 버튼

**approveBooking**
- [x] 상태 pending → approved (Server Action 완료)
- [x] 해당 기간 다른 예약 자동 reject (Server Action 완료)

**rejectBooking**
- [x] 상태 rejected (Server Action 완료)

### 4-2. 이용자 예약 관리 (/bookings/my)
- [x] 내가 신청한 예약 목록
- [x] 상태 배지 표시
- [x] 예약 취소 기능 (cancelBooking)

---

## PHASE 5 — 결제 기능 (Toss Payments v1) 통합

### 5-1. 결제 버튼 활성화 조건
- [x] booking.status === "approved" 일 때만 표시

### 5-2. Toss Payments v1 결제창 방식 구현

**결제 버튼 컴포넌트 (PaymentButton)**
- [x] v2 SDK 제거 및 v1 결제창 방식으로 변경
- [x] form submit 방식으로 결제창 호출
- [x] 로딩 처리
- [x] 결제 금액 표시

**createPaymentIntent (결제 준비)**
- [x] orderId = bookingId 기반 생성
- [x] amount = total_price
- [x] v1 결제창에 필요한 파라미터 반환 (orderId, orderName, amount, customerName, successUrl, failUrl)
- [x] order_id를 bookings 테이블에 저장

### 5-3. confirmPayment (결제 승인 처리)

**Server Action 구현**
- [x] paymentKey, orderId, amount 검증
- [x] Toss Payments /v1/payments/confirm API 호출 (test_sk 사용)
- [x] Supabase에서 booking 조회
- [x] booking.payment_status = 'paid' 업데이트
- [x] payment_id 저장
- [x] approved_at 저장
- [x] **예약 카트 비우기**: 해당 사용자의 pending + unpaid 예약 삭제 (현재 결제한 예약 제외)

### 5-4. 결제 실패 처리

**결제 실패 페이지 (/payments/fail)**
- [x] Toss 실패 파라미터 받기 (code, message)
- [x] **DB 변경 없음** (요구사항: 안내 메시지만 표시)
- [x] 실패 사유 표시
- [x] 재시도 버튼

### 5-5. 결제 성공/실패 페이지

**결제 성공 페이지 (/payments/success)**
- [x] v1 결제창 리다이렉트 파라미터 처리 (paymentKey, orderId, amount)
- [x] confirmPayment 호출하여 최종 승인 처리
- [x] 결제 금액 표시
- [x] 예약 ID 표시
- [x] "예약 확인하기" 버튼

**결제 실패 페이지 (/payments/fail)**
- [x] v1 결제창 리다이렉트 파라미터 처리
- [x] DB 변경 없이 안내 메시지만 표시
- [x] 에러 코드별 메시지 매핑
- [x] 재시도 버튼

### 5-6. webhookSync (선택)
- [x] Toss webhook route 생성 (/api/webhooks/toss)
- [x] 중복호출 대비 idempotency 처리
- [x] 결제 취소/실패 시 bookings 업데이트

### 5-7. 환경 변수 설정 및 문서화
- [x] Toss Payments 테스트 키 환경 변수 설정 가이드 작성
- [x] `docs/TOSS_PAYMENTS_SETUP.md` 문서 생성
- [x] 테스트 카드 정보 및 보안 권장사항 포함
- [x] 결제 플로우 설명

### 5-8. 결제 UI

**차량 상세 페이지**
- [x] "결제하기" 버튼 (PaymentButton 컴포넌트)
- [x] 로딩 처리
- [x] 결제 금액 표시

**내 예약 페이지 (/bookings/my)**
- [x] 결제 버튼 (v1 결제창 방식으로 통일)

---

## PHASE 6 — 약관 & 가이드

### 6-1. 약관 페이지
- [x] 대여 동의서 페이지 생성 (/terms)
- [x] 개인정보처리방침 페이지 생성 (/privacy)
- [x] 예약 신청 시 "동의 체크박스" 필수

### 6-2. 가이드 페이지
- [x] 차주용 가이드 (/guide/owner)
- [x] 이용자용 가이드 (/guide/renter)

---

## PHASE 7 — 공통 UI 컴포넌트
- [x] DateRangePicker
- [x] ImageUploader
- [x] VehicleCard
- [x] BookingCard
- [x] StatusBadge
- [x] Navbar
- [x] Footer
- [x] PaymentButton

---

## PHASE 8 — 테스트
- [x] Playwright E2E 테스트 설정 (playwright.config.ts)
- [x] 홈페이지 테스트 (tests/e2e/home.spec.ts)
- [x] 차량 검색/상세 테스트 (tests/e2e/vehicles.spec.ts)
- [x] 예약 플로우 테스트 (tests/e2e/booking-flow.spec.ts)
- [x] 인증 테스트 (tests/e2e/auth.spec.ts)
- [x] 반응형 UI 테스트 (tests/e2e/responsive.spec.ts)
- [ ] 실제 데이터로 전체 플로우 수동 테스트 필요

---

## PHASE 9 — 배포

### 9-1. 배포 준비
- [x] Vercel 프로젝트 생성
- [x] 환경 변수 등록
  - [x] Supabase URL/Key
  - [x] Clerk 키
  - [x] Toss Payments 테스트 키 (NEXT_PUBLIC_TOSS_CLIENT_KEY, TOSS_SECRET_KEY)

### 9-2. 배포 테스트
- [x] 모바일 반응형 Navbar 개선
- [x] 모바일 E2E 테스트 추가 (Playwright mobile-chrome, mobile-safari)
- [ ] production 환경에서 결제 실제로 작동하는지 확인 (Toss API 키 필요)
- [ ] 모바일 UI 수동 테스트

---

## PHASE 10 — 마이페이지 기능

### 10-1. Server Actions 구현

**my-page-actions.ts 생성**
- [x] getMyOrders: 결제 완료된 예약 조회
  - [x] bookings 테이블에서 payment_status = 'paid'인 예약만 조회
  - [x] vehicles, users 테이블 조인하여 차량 정보 및 차주 정보 포함
  - [x] 최신순 정렬
- [x] getOrderDetail: 주문 상세 정보 조회
  - [x] booking_id로 상세 정보 조회
  - [x] 차량 정보, 차주 정보, 결제 정보 포함
  - [x] 대여 일수 계산
- [x] getMyProfileStats: 사용자 통계 정보 조회
  - [x] 총 주문 수 (payment_status = 'paid')
  - [x] 총 결제 금액 (paid 예약의 total_price 합계)
  - [x] 진행 중인 예약 수 (status = 'approved' 또는 'pending')
  - [x] 등록한 차량 수 (owner인 경우)

### 10-2. 마이페이지 메인 컴포넌트

**app/my/page.tsx 생성**
- [x] 사용자 프로필 섹션
  - [x] Clerk에서 사용자 정보 가져오기
  - [x] Supabase users 테이블에서 추가 정보 조회
  - [x] 프로필 이미지, 이름, 이메일, 전화번호, 역할 표시
- [x] 통계 카드 섹션
  - [x] 총 주문 수, 총 결제 금액, 진행 중 예약 수, 등록 차량 수
- [x] 주문 내역 섹션
  - [x] 필터 (전체/결제 완료/진행 중/취소됨)
  - [x] 주문 카드 목록
  - [x] 빈 상태 처리

### 10-3. 주문 카드 컴포넌트

**components/order-card.tsx 생성**
- [x] 주문 번호, 주문일시 표시
- [x] 차량 정보 (이미지, 차종, 연식)
- [x] 대여 기간 표시
- [x] 결제 금액 표시
- [x] 상태 배지 표시 (예약 상태, 결제 상태)
- [x] 주문 상세 보기 버튼

### 10-4. 통계 카드 컴포넌트

**components/stats-card.tsx 생성**
- [x] 아이콘, 제목, 값 표시
- [x] 링크 기능 (선택)

### 10-5. 주문 상세 페이지

**app/my/orders/[id]/page.tsx 생성**
- [x] 기본 정보 (주문 번호, 주문일시, 결제일시)
- [x] 차량 정보 (이미지 갤러리, 상세 정보)
- [x] 예약 정보 (대여 기간, 픽업/반납 위치)
- [x] 결제 정보 (금액, 상태, 결제 ID)
- [x] 차주 정보 (이름, 연락처)
- [x] 상태 정보 및 액션 버튼

### 10-6. 네비게이션 업데이트

**components/Navbar.tsx**
- [x] 마이페이지 링크 추가 (데스크톱 및 모바일 메뉴)
