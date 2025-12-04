-- =====================================================
-- 트립카셰어(TripCarShare) 데이터베이스 스키마
-- 공항 기반 P2P 차량 공유 플랫폼
-- =====================================================

-- =====================================================
-- 1. Users 테이블 확장
-- =====================================================
-- 기존 users 테이블에 트립카셰어 필요 필드 추가

-- phone 컬럼 추가 (연락처)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- role 컬럼 추가 (owner: 차주, renter: 이용자)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'renter' CHECK (role IN ('owner', 'renter'));

-- is_verified 컬럼 추가 (본인 인증 여부)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- updated_at 컬럼 추가
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- updated_at 자동 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. Vehicles 테이블 생성 (차량 정보)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    -- 기본 정보
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id TEXT NOT NULL, -- Clerk user ID (차주)
    
    -- 차량 기본 정보
    model TEXT NOT NULL, -- 차종 (예: 현대 아반떼, 기아 K5)
    year INTEGER NOT NULL, -- 연식
    plate_number TEXT NOT NULL, -- 번호판
    
    -- 상세 정보
    description TEXT, -- 차량 설명
    price_per_day INTEGER NOT NULL, -- 일일 대여료 (원)
    images TEXT[] DEFAULT '{}', -- 차량 이미지 URL 배열
    
    -- 이용 가능 기간
    available_from TIMESTAMP WITH TIME ZONE NOT NULL, -- 이용 시작 가능일
    available_until TIMESTAMP WITH TIME ZONE NOT NULL, -- 이용 종료일
    
    -- 위치 정보
    airport_location TEXT NOT NULL, -- 공항 (예: 제주 국제공항)
    parking_location TEXT, -- 주차 위치 상세 정보
    
    -- 상태 관리
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'unavailable')),
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- 제약 조건
    CONSTRAINT valid_date_range CHECK (available_until > available_from),
    CONSTRAINT valid_price CHECK (price_per_day > 0)
);

-- 테이블 소유자 설정
ALTER TABLE public.vehicles OWNER TO postgres;

-- vehicles 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON public.vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_airport ON public.vehicles(airport_location);
CREATE INDEX IF NOT EXISTS idx_vehicles_dates ON public.vehicles(available_from, available_until);

-- vehicles 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 비활성화 (개발 단계)
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.vehicles TO anon;
GRANT ALL ON TABLE public.vehicles TO authenticated;
GRANT ALL ON TABLE public.vehicles TO service_role;

-- =====================================================
-- 3. Bookings 테이블 생성 (예약 정보)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    -- 기본 정보
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    renter_id TEXT NOT NULL, -- Clerk user ID (이용자)
    
    -- 예약 일정
    start_date TIMESTAMP WITH TIME ZONE NOT NULL, -- 예약 시작일
    end_date TIMESTAMP WITH TIME ZONE NOT NULL, -- 예약 종료일
    
    -- 상태 관리
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    
    -- 위치 정보
    pickup_location TEXT, -- 픽업 위치
    return_location TEXT, -- 반납 위치
    
    -- 금액
    total_price INTEGER NOT NULL, -- 총 대여료 (원)
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- 제약 조건
    CONSTRAINT valid_booking_dates CHECK (end_date > start_date),
    CONSTRAINT valid_total_price CHECK (total_price > 0)
);

-- 테이블 소유자 설정
ALTER TABLE public.bookings OWNER TO postgres;

-- bookings 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle_id ON public.bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON public.bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(start_date, end_date);

-- bookings 테이블에 updated_at 트리거 적용
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 비활성화 (개발 단계)
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;

-- =====================================================
-- 4. 날짜 중복 예약 방지 함수
-- =====================================================
-- 차량의 특정 기간에 이미 승인된 예약이 있는지 확인하는 함수
CREATE OR REPLACE FUNCTION check_vehicle_availability(
    p_vehicle_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE,
    p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO overlap_count
    FROM public.bookings
    WHERE vehicle_id = p_vehicle_id
      AND status = 'approved'
      AND (id != p_exclude_booking_id OR p_exclude_booking_id IS NULL)
      AND (
          (start_date <= p_start_date AND end_date > p_start_date)
          OR (start_date < p_end_date AND end_date >= p_end_date)
          OR (start_date >= p_start_date AND end_date <= p_end_date)
      );
    
    RETURN overlap_count = 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 마이그레이션 완료
-- =====================================================
-- 트립카셰어 기본 스키마 생성 완료
-- - users 테이블 확장 (phone, role, is_verified)
-- - vehicles 테이블 생성
-- - bookings 테이블 생성
-- - 날짜 중복 확인 함수 생성

