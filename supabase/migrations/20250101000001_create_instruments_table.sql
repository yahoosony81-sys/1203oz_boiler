-- Instruments 테이블 생성 (Supabase 공식 문서 예제)
-- 공식 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
--
-- 이 마이그레이션은 Supabase 공식 문서의 예제를 따라 구현되었습니다.
-- Next.js Quickstart 가이드에서 사용하는 instruments 테이블입니다.

-- Instruments 테이블 생성
CREATE TABLE IF NOT EXISTS public.instruments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.instruments OWNER TO postgres;

-- 개발 단계에서는 RLS 비활성화 (프로덕션에서는 활성화 필요)
ALTER TABLE public.instruments DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.instruments TO anon;
GRANT ALL ON TABLE public.instruments TO authenticated;
GRANT ALL ON TABLE public.instruments TO service_role;

-- 시퀀스 권한 부여
GRANT USAGE, SELECT ON SEQUENCE instruments_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE instruments_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE instruments_id_seq TO service_role;

-- 샘플 데이터 삽입
INSERT INTO public.instruments (name)
VALUES
    ('violin'),
    ('viola'),
    ('cello')
ON CONFLICT DO NOTHING;

-- ============================================
-- 프로덕션 배포 시 사용할 RLS 정책 (현재는 주석 처리됨)
-- ============================================
--
-- RLS 활성화:
-- ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
--
-- 공개 읽기 정책 (공식 문서 예제):
-- CREATE POLICY "public can read instruments"
-- ON public.instruments
-- FOR SELECT
-- TO anon
-- USING (true);

