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

## PHASE 5 — 결제 기능 (Toss Payments) 통합

### 5-1. 결제 버튼 활성화 조건
- [x] booking.status === "approved" 일 때만 표시

### 5-2. createPaymentIntent (결제 준비)

**Server Action 구현**
- [x] orderId = bookingId 기반 생성
- [x] amount = total_price
- [x] Toss API 호출
- [x] 결제창 URL 반환
- [x] 사용자 redirect

### 5-3. approvePayment (Redirect route)

**Next.js route handler (/payments/approve)**
- [x] paymentKey, orderId 검증
- [x] Toss 승인 API 요청
- [x] Supabase에서 booking 조회
- [x] booking.payment_status = paid 업데이트
- [x] payment_id 저장
- [x] 성공 시 /payments/success로 이동

### 5-4. failPayment (Redirect route)
- [x] Toss 실패 파라미터 받기
- [x] bookings.payment_status = failed
- [x] /payments/fail로 redirect

### 5-5. webhookSync (선택)
- [ ] Toss webhook route 생성 (MVP 이후)
- [ ] 중복호출 대비 idempotency 처리 (MVP 이후)
- [ ] 결제 취소/실패 시 bookings 업데이트 (MVP 이후)

### 5-6. 결제 UI

**차량 상세 페이지**
- [x] "결제하기" 버튼 (PaymentButton 컴포넌트)
- [x] 로딩 처리
- [x] 결제 금액 표시

**결제 성공 페이지 (/payments/success)**
- [x] 결제 금액
- [x] 예약 ID
- [x] 차량 정보
- [x] "예약 확인하기" 버튼

**결제 실패 페이지 (/payments/fail)**
- [x] 실패 사유 표시
- [x] 재시도 버튼

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
- [ ] 차량 등록 → 검색 → 예약 → 승인 → 결제 전체 플로우 확인
- [ ] 결제 실패/재시도 테스트
- [ ] 중복 예약 테스트
- [ ] 날짜 계산 검증
- [ ] 이미지 업로드 실패 대응
- [ ] 모바일 반응형 체크

---

## PHASE 9 — 배포

### 9-1. 배포 준비
- [x] Vercel 프로젝트 생성
- [x] 환경 변수 등록
  - [x] Supabase URL/Key
  - [x] Clerk 키
  - [ ] Toss SecretKey

### 9-2. 배포 테스트
- [ ] production 환경에서 결제 실제로 작동하는지 확인
- [ ] 모바일 UI 재확인
