/**
 * @file app/vehicles/new/page.tsx
 * @description 차량 등록 페이지
 * 
 * 차주가 자신의 차량을 플랫폼에 등록하는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 차량 기본 정보 입력 (차종, 연식, 번호판)
 * 2. 대여 조건 설정 (일일 대여료, 이용 가능 기간)
 * 3. 위치 정보 입력 (공항, 주차 위치)
 * 4. 차량 이미지 업로드
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - react-hook-form: 폼 관리
 * - actions/vehicles: Server Actions
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createVehicle } from '@/actions/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Clerk Provider 사용으로 인한 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export default function NewVehiclePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  console.group('🚗 NewVehiclePage Render');
  console.log('User loaded:', isLoaded);
  console.log('User ID:', user?.id);
  console.log('Images count:', images.length);
  console.groupEnd();

  // 로그인 체크
  if (isLoaded && !user) {
    router.push('/sign-in');
    return null;
  }

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📸 handleImageChange');
    
    const files = e.target.files;
    if (!files) return;

    const newImages: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      newImages.push(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...newImages]);
    console.log('✅ Images added:', newImages.length);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    console.log('🗑️ Removing image at index:', index);
    
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    
    console.log('✅ Image removed');
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.group('📝 handleSubmit');
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // 이미지 추가
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      console.log('📤 Submitting form data...');
      console.log('Form values:', {
        model: formData.get('model'),
        year: formData.get('year'),
        plate_number: formData.get('plate_number'),
        price_per_day: formData.get('price_per_day'),
        available_from: formData.get('available_from'),
        available_until: formData.get('available_until'),
        airport_location: formData.get('airport_location'),
        imageCount: images.length,
      });

      const result = await createVehicle(formData);

      if (result.success) {
        console.log('✅ Vehicle created successfully:', result.data);
        alert(result.message || '차량이 등록되었습니다!');
        router.push('/vehicles/my');
      } else {
        console.error('❌ Failed to create vehicle:', result.error);
        setError(result.error || '차량 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err);
      setError('차량 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
      console.groupEnd();
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="mb-8">
        <Link 
          href="/vehicles/my" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          내 차량으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold">차량 등록</h1>
        <p className="text-gray-600 mt-2">
          여행을 떠나는 동안 차량을 공유하고 수익을 창출하세요.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* 차량 등록 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          
          <div className="space-y-4">
            {/* 차종 */}
            <div>
              <Label htmlFor="model">차종 *</Label>
              <Input
                id="model"
                name="model"
                type="text"
                placeholder="예: 현대 아반떼, 기아 K5"
                required
              />
            </div>

            {/* 연식 & 번호판 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">연식 *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="plate_number">번호판 *</Label>
                <Input
                  id="plate_number"
                  name="plate_number"
                  type="text"
                  placeholder="12가3456"
                  required
                />
              </div>
            </div>

            {/* 상세 설명 */}
            <div>
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="차량의 특징, 옵션, 주의사항 등을 자유롭게 작성해주세요."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* 대여 조건 섹션 */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">대여 조건</h2>
          
          <div className="space-y-4">
            {/* 일일 대여료 */}
            <div>
              <Label htmlFor="price_per_day">일일 대여료 (원) *</Label>
              <Input
                id="price_per_day"
                name="price_per_day"
                type="number"
                placeholder="50000"
                min="0"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                하루 대여 시 받고 싶은 금액을 입력해주세요.
              </p>
            </div>

            {/* 이용 가능 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="available_from">이용 시작 가능일 *</Label>
                <Input
                  id="available_from"
                  name="available_from"
                  type="datetime-local"
                  required
                />
              </div>
              <div>
                <Label htmlFor="available_until">이용 종료일 *</Label>
                <Input
                  id="available_until"
                  name="available_until"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* 위치 정보 섹션 */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">위치 정보</h2>
          
          <div className="space-y-4">
            {/* 공항 선택 */}
            <div>
              <Label htmlFor="airport_location">공항 *</Label>
              <Input
                id="airport_location"
                name="airport_location"
                type="text"
                defaultValue="제주 국제공항"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                현재는 제주 국제공항만 지원합니다.
              </p>
            </div>

            {/* 주차 위치 */}
            <div>
              <Label htmlFor="parking_location">주차 위치 상세</Label>
              <Textarea
                id="parking_location"
                name="parking_location"
                placeholder="예: 제주공항 장기주차장 A구역 3층"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* 차량 사진 섹션 */}
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">차량 사진</h2>
          
          {/* 이미지 업로드 버튼 */}
          <div className="mb-4">
            <Label 
              htmlFor="images" 
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              사진 추가
            </Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-2">
              차량의 외관, 내부, 대시보드 등을 촬영해주세요. (최대 10MB)
            </p>
          </div>

          {/* 이미지 미리보기 */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                등록 중...
              </>
            ) : (
              '차량 등록'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

