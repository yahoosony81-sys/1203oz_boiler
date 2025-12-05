-- =====================================================
-- 트립카셰어 - Bookings 테이블 결제 필드 추가
-- Toss Payments 연동을 위한 필드
-- =====================================================

-- payment_status 컬럼 추가 (unpaid/paid/failed)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' 
CHECK (payment_status IN ('unpaid', 'paid', 'failed'));

-- payment_id 컬럼 추가 (Toss paymentKey)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- order_id 컬럼 추가 (Toss orderId - booking id 기반)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS order_id TEXT;

-- approved_at 컬럼 추가 (결제 승인 시간)
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- 마이그레이션 완료
-- =====================================================
-- bookings 테이블에 결제 관련 필드 추가 완료
-- - payment_status: unpaid/paid/failed
-- - payment_id: Toss paymentKey
-- - order_id: Toss orderId  
-- - approved_at: 결제 승인 시간

