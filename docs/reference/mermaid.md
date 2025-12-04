flowchart TD

%% =========================
%% 공통: 진입 및 인증
%% =========================
A0[랜딩 페이지 접속] --> A1{회원 여부?}

A1 -->|비회원| A2[회원가입 페이지]
A2 --> A3[Supabase auth.users 계정 생성]
A3 --> A4[public.user_profiles 생성]
A4 --> A5[로그인 완료]

A1 -->|기존 회원| A5[로그인 완료]

A5 --> A6{역할 선택}
A6 -->|차량 사용자(여행자)| R0
A6 -->|차량 제공자(차주)| O0
A6 -->|둘 다| R0


%% =========================
%% 여행자 플로우 (렌터)
%% =========================
subgraph R[여행자 플로우]
  R0[메인 화면 진입] --> R1[공항/여행일 입력]
  R1 --> R2[Supabase: airports 조회]
  R2 --> R3[Supabase: vehicles 테이블에서 
            airport_id, available_start_at, available_end_at 조건으로 검색]

  R3 --> R4{검색 결과 있음?}
  R4 -->|없음| R4a[대체 날짜/조건 제안 및 안내 메시지] --> R1
  R4 -->|있음| R5[차량 목록 조회(카드 리스트)]

  R5 --> R6[차량 상세 보기]
  R6 --> R7[일정/가격 확인 후 '예약 요청' 클릭]

  R7 --> R8[Supabase: reservations에 
            status='requested'로 INSERT]
  R8 --> R9[Supabase: notifications에 
            type='reservation_requested' INSERT 
            (대상: 차주 owner_id)]

  R9 --> R10[예약 요청 완료 화면 표시]

  %% 차주 승인 후
  R11[차주가 예약 승인 또는 거절] --> R12{승인 여부?}
  R12 -->|거절| R13[알림: 예약 거절 안내] --> R1
  R12 -->|승인| R14[알림: 예약 승인 및 픽업 안내]

  R14 --> R15[여행자가 공항에서 차량 인수]
  R15 --> R16[여행 기간 동안 차량 이용]
  R16 --> R17['반납 완료' 버튼 클릭]

  R17 --> R18[Supabase: reservations.status='completed'로 업데이트]
  R18 --> R19[알림: 양측에 이용 종료 메시지 전송]
end


%% =========================
%% 차주 플로우 (오너)
%% =========================
subgraph O[차주 플로우]
  O0[차주 대시보드 진입] --> O1[프로필 확인 및 연락처 입력]
  O1 --> O2[Supabase: user_profiles 업데이트]

  O2 --> O3['차량 등록' 버튼 클릭]
  O3 --> O4[차량 기본 정보 입력
            (제조사, 모델, 연식, 좌석수, 연료, 변속기 등)]
  O4 --> O5[공항 선택 및 이용 가능 기간 지정]
  O5 --> O6[일일 요금 설정 및 설명 작성]
  O6 --> O7[사진 업로드]

  O7 --> O8[Supabase: vehicles에 차량 정보 INSERT]
  O8 --> O9[Supabase: vehicle_photos에 이미지 URL INSERT들]

  O9 --> O10[차량 목록에서 내 차량 상태 확인]

  %% 예약 요청 대응
  O11[알림: 새로운 예약 요청 수신] --> O12[예약 상세 확인 화면]
  O12 --> O13{승인/거절 선택}
  O13 -->|거절| O14[Supabase: reservations.status='rejected' 업데이트]
  O14 --> O15[Supabase: notifications에 
              type='reservation_rejected' INSERT (대상: 여행자)]

  O13 -->|승인| O16[Supabase: reservations.status='approved' 업데이트]
  O16 --> O17[Supabase: rental_agreements에 
              약관 스냅샷 INSERT (renter_id, owner_id 포함)]
  O17 --> O18[Supabase: notifications에 
              type='reservation_approved' INSERT (대상: 여행자)]

  O18 --> O19[차량 키 전달 및 픽업 안내 오프라인 진행]

  %% 반납 처리
  O20[여행자가 반납 완료 표시] --> O21[차주가 차량 상태 확인]
  O21 --> O22[필요 시 문제 여부 기록(추후 버전)]
  O22 --> O23[Supabase: reservations.status='completed'로 최종 업데이트]
end


%% =========================
%% 공통 데이터 흐름 및 관리
%% =========================
subgraph D[데이터 및 관리 레이어]
  D1[airports]:::db
  D2[vehicles]:::db
  D3[vehicle_photos]:::db
  D4[reservations]:::db
  D5[rental_agreements]:::db
  D6[user_profiles]:::db
  D7[notifications]:::db
end

A5 --> D6
R2 --> D1
R3 --> D2
O8 --> D2
O9 --> D3
R8 --> D4
O16 --> D4
R18 --> D4
O17 --> D5
R9 --> D7
O14 --> D7
O16 --> D7
R19 --> D7

classDef db fill:#f3f3f3,stroke:#999,stroke-width:1px;
