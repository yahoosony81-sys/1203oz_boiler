-- Tasks 테이블 생성 (Clerk + Supabase 통합 예제)
-- 공식 문서: https://clerk.com/docs/guides/development/integrations/databases/supabase
--
-- 이 마이그레이션은 Clerk와 Supabase 통합의 모범 사례를 보여줍니다.
-- user_id 컬럼은 Clerk 사용자 ID를 저장하며, RLS 정책으로 데이터 접근을 제한합니다.

-- Tasks 테이블 생성
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- 개발 단계에서는 RLS 비활성화 (프로덕션에서는 활성화 필요)
-- 프로덕션 배포 전에 아래 주석을 해제하고 RLS를 활성화하세요.
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;

-- 시퀀스 권한 부여 (SERIAL 타입 사용 시 필요)
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE tasks_id_seq TO service_role;

-- ============================================
-- 프로덕션 배포 시 사용할 RLS 정책 (현재는 주석 처리됨)
-- ============================================
-- 
-- RLS 활성화:
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
--
-- 사용자는 자신의 tasks만 조회할 수 있음
-- CREATE POLICY "User can view their own tasks"
-- ON public.tasks
-- FOR SELECT
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
--
-- 사용자는 자신의 tasks만 생성할 수 있음
-- CREATE POLICY "Users must insert their own tasks"
-- ON public.tasks
-- AS PERMISSIVE
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
--
-- 사용자는 자신의 tasks만 수정할 수 있음
-- CREATE POLICY "Users can update their own tasks"
-- ON public.tasks
-- FOR UPDATE
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- )
-- WITH CHECK (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
--
-- 사용자는 자신의 tasks만 삭제할 수 있음
-- CREATE POLICY "Users can delete their own tasks"
-- ON public.tasks
-- FOR DELETE
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

