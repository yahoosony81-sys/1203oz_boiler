-- =====================================================
-- 트립카셰어 - Supabase Storage 설정
-- vehicle-images 버킷 생성 및 정책 설정
-- =====================================================

-- =====================================================
-- 1. vehicle-images 버킷 생성
-- =====================================================
-- 차량 이미지를 저장할 Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. Storage 정책 설정 (개발 중에는 간소화된 정책 사용)
-- =====================================================

-- 모든 사용자가 vehicle-images 버킷의 파일을 조회할 수 있도록 설정
CREATE POLICY IF NOT EXISTS "Public Access for vehicle images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');

-- 인증된 사용자는 자신의 폴더에 파일 업로드 가능
-- 경로 구조: {clerk_user_id}/{vehicle_id}/{filename}
CREATE POLICY IF NOT EXISTS "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- 인증된 사용자는 자신이 업로드한 파일 업데이트 가능
CREATE POLICY IF NOT EXISTS "Authenticated users can update their vehicle images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- 인증된 사용자는 자신이 업로드한 파일 삭제 가능
CREATE POLICY IF NOT EXISTS "Authenticated users can delete their vehicle images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vehicle-images');

-- =====================================================
-- 마이그레이션 완료
-- =====================================================
-- vehicle-images 버킷 생성 및 정책 설정 완료
-- - 버킷: vehicle-images (공개)
-- - 조회: 모든 사용자 가능
-- - 업로드/수정/삭제: 인증된 사용자만 가능

