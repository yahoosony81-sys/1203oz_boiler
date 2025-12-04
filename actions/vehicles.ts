/**
 * @file actions/vehicles.ts
 * @description 차량 관련 Server Actions
 * 
 * 차량 CRUD 작업을 처리하는 서버 액션들을 정의합니다.
 * 
 * 주요 기능:
 * 1. 차량 등록 (createVehicle)
 * 2. 차량 조회 (getVehicle, getVehicles, getMyVehicles)
 * 3. 차량 수정 (updateVehicle)
 * 4. 차량 삭제 (deleteVehicle)
 * 5. 이미지 업로드 (uploadVehicleImages)
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - @supabase/supabase-js: 데이터베이스 작업
 * - lib/supabase/server: Supabase 서버 클라이언트
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@/lib/supabase/service-role';
import type { 
  Vehicle, 
  VehicleFormData, 
  VehicleUpdateFormData, 
  ApiResponse,
  VehicleWithOwner 
} from '@/types/database';
import { revalidatePath } from 'next/cache';

/**
 * 차량 이미지를 Supabase Storage에 업로드
 * @param images - 업로드할 이미지 파일들
 * @param vehicleId - 차량 ID
 * @param clerkUserId - 사용자 Clerk ID
 * @returns 업로드된 이미지 URL 배열
 */
async function uploadVehicleImages(
  images: File[],
  vehicleId: string,
  clerkUserId: string
): Promise<string[]> {
  console.group('🖼️ uploadVehicleImages');
  console.log('Uploading images:', { count: images.length, vehicleId, clerkUserId });

  const supabase = createServiceClient();
  const uploadedUrls: string[] = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${i}.${fileExt}`;
      const filePath = `${clerkUserId}/${vehicleId}/${fileName}`;

      console.log(`Uploading image ${i + 1}/${images.length}:`, filePath);

      // ArrayBuffer로 변환
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Storage에 업로드
      const { data, error } = await supabase.storage
        .from('vehicle-images')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`이미지 업로드 실패: ${error.message}`);
      }

      // 공개 URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
      console.log(`✅ Image ${i + 1} uploaded:`, publicUrl);
    }

    console.log('✅ All images uploaded successfully');
    console.groupEnd();
    return uploadedUrls;
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    console.groupEnd();
    throw error;
  }
}

/**
 * 차량 등록 Server Action
 * @param formData - FormData 객체 (파일 업로드 포함)
 * @returns API 응답
 */
export async function createVehicle(
  formData: FormData
): Promise<ApiResponse<Vehicle>> {
  console.group('🚗 createVehicle Server Action');
  
  try {
    // 1. 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized: No user ID');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }
    console.log('✅ User authenticated:', clerkUserId);

    // 2. FormData에서 데이터 추출
    const model = formData.get('model') as string;
    const year = parseInt(formData.get('year') as string);
    const plate_number = formData.get('plate_number') as string;
    const description = formData.get('description') as string || null;
    const price_per_day = parseInt(formData.get('price_per_day') as string);
    const available_from = formData.get('available_from') as string;
    const available_until = formData.get('available_until') as string;
    const airport_location = formData.get('airport_location') as string;
    const parking_location = formData.get('parking_location') as string || null;
    
    // 이미지 파일들 추출
    const images: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value);
      }
    }

    console.log('📝 Form data:', {
      model,
      year,
      plate_number,
      price_per_day,
      available_from,
      available_until,
      airport_location,
      imageCount: images.length,
    });

    // 3. 유효성 검사
    if (!model || !year || !plate_number || !price_per_day || !available_from || !available_until || !airport_location) {
      console.error('❌ Validation failed: Missing required fields');
      console.groupEnd();
      return { success: false, error: '필수 항목을 모두 입력해주세요.' };
    }

    if (year < 1900 || year > new Date().getFullYear() + 1) {
      console.error('❌ Validation failed: Invalid year');
      console.groupEnd();
      return { success: false, error: '올바른 연식을 입력해주세요.' };
    }

    if (price_per_day < 0) {
      console.error('❌ Validation failed: Invalid price');
      console.groupEnd();
      return { success: false, error: '대여료는 0원 이상이어야 합니다.' };
    }

    if (new Date(available_until) <= new Date(available_from)) {
      console.error('❌ Validation failed: Invalid date range');
      console.groupEnd();
      return { success: false, error: '종료일은 시작일보다 이후여야 합니다.' };
    }

    // 4. Supabase 클라이언트 생성
    const supabase = await createClerkSupabaseClient();

    // 5. 차량 데이터 먼저 삽입 (이미지 없이)
    const vehicleData = {
      owner_id: clerkUserId,
      model,
      year,
      plate_number,
      description,
      price_per_day,
      available_from,
      available_until,
      airport_location,
      parking_location,
      images: [], // 빈 배열로 시작
      status: 'active' as const,
    };

    console.log('💾 Inserting vehicle data...');
    const { data: vehicle, error: insertError } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      console.groupEnd();
      throw new Error(`차량 등록 실패: ${insertError.message}`);
    }

    console.log('✅ Vehicle inserted:', vehicle.id);

    // 6. 이미지 업로드 (이미지가 있는 경우)
    let imageUrls: string[] = [];
    if (images.length > 0) {
      console.log('📸 Uploading images...');
      imageUrls = await uploadVehicleImages(images, vehicle.id, clerkUserId);

      // 7. 이미지 URL 업데이트
      console.log('💾 Updating vehicle with image URLs...');
      const { data: updatedVehicle, error: updateError } = await supabase
        .from('vehicles')
        .update({ images: imageUrls })
        .eq('id', vehicle.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Failed to update image URLs:', updateError);
        // 이미지 URL 업데이트 실패해도 차량은 등록됨
      } else {
        console.log('✅ Image URLs updated');
        Object.assign(vehicle, updatedVehicle);
      }
    }

    // 8. 페이지 재검증
    revalidatePath('/vehicles/my');
    revalidatePath('/vehicles');

    console.log('✅ Vehicle created successfully:', vehicle.id);
    console.groupEnd();

    return {
      success: true,
      data: vehicle as Vehicle,
      message: '차량이 성공적으로 등록되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in createVehicle:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '차량 등록 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 내 차량 목록 조회
 * @returns 내 차량 목록
 */
export async function getMyVehicles(): Promise<ApiResponse<Vehicle[]>> {
  console.group('📋 getMyVehicles Server Action');
  
  try {
    // 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    console.log('✅ User authenticated:', clerkUserId);

    // Supabase 클라이언트 생성
    const supabase = await createClerkSupabaseClient();

    // 내 차량 조회
    console.log('🔍 Fetching vehicles...');
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', clerkUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      console.groupEnd();
      throw new Error(`차량 조회 실패: ${error.message}`);
    }

    console.log(`✅ Found ${vehicles?.length || 0} vehicles`);
    console.groupEnd();

    return {
      success: true,
      data: vehicles as Vehicle[],
    };
  } catch (error) {
    console.error('❌ Error in getMyVehicles:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '차량 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 차량 상세 정보 조회
 * @param vehicleId - 차량 ID
 * @returns 차량 정보
 */
export async function getVehicle(vehicleId: string): Promise<ApiResponse<VehicleWithOwner>> {
  console.group('🔍 getVehicle Server Action');
  console.log('Vehicle ID:', vehicleId);
  
  try {
    const supabase = await createClerkSupabaseClient();

    // 차량 및 소유자 정보 조회
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (vehicleError || !vehicle) {
      console.error('❌ Vehicle not found:', vehicleError);
      console.groupEnd();
      return { success: false, error: '차량을 찾을 수 없습니다.' };
    }

    // 소유자 정보 조회
    const { data: owner, error: ownerError } = await supabase
      .from('users')
      .select('name, phone, is_verified')
      .eq('clerk_id', vehicle.owner_id)
      .single();

    if (ownerError) {
      console.warn('⚠️ Owner info not found:', ownerError);
    }

    const vehicleWithOwner: VehicleWithOwner = {
      ...vehicle,
      owner: owner || { name: '알 수 없음', phone: null, is_verified: false },
    } as VehicleWithOwner;

    console.log('✅ Vehicle found');
    console.groupEnd();

    return {
      success: true,
      data: vehicleWithOwner,
    };
  } catch (error) {
    console.error('❌ Error in getVehicle:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '차량 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 차량 삭제
 * @param vehicleId - 삭제할 차량 ID
 * @returns API 응답
 */
export async function deleteVehicle(vehicleId: string): Promise<ApiResponse> {
  console.group('🗑️ deleteVehicle Server Action');
  console.log('Vehicle ID:', vehicleId);
  
  try {
    // 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 차량 소유자 확인
    const { data: vehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select('owner_id, images')
      .eq('id', vehicleId)
      .single();

    if (fetchError || !vehicle) {
      console.error('❌ Vehicle not found');
      console.groupEnd();
      return { success: false, error: '차량을 찾을 수 없습니다.' };
    }

    if (vehicle.owner_id !== clerkUserId) {
      console.error('❌ Forbidden: Not the owner');
      console.groupEnd();
      return { success: false, error: '차량을 삭제할 권한이 없습니다.' };
    }

    // 이미지 삭제 (Storage)
    if (vehicle.images && vehicle.images.length > 0) {
      console.log('🗑️ Deleting images from storage...');
      const serviceSupabase = createServiceClient();
      
      for (const imageUrl of vehicle.images) {
        try {
          // URL에서 파일 경로 추출
          const urlParts = imageUrl.split('/vehicle-images/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            await serviceSupabase.storage
              .from('vehicle-images')
              .remove([filePath]);
            console.log('✅ Image deleted:', filePath);
          }
        } catch (imgError) {
          console.warn('⚠️ Failed to delete image:', imgError);
        }
      }
    }

    // 차량 삭제
    console.log('🗑️ Deleting vehicle from database...');
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      console.groupEnd();
      throw new Error(`차량 삭제 실패: ${deleteError.message}`);
    }

    // 페이지 재검증
    revalidatePath('/vehicles/my');
    revalidatePath('/vehicles');

    console.log('✅ Vehicle deleted successfully');
    console.groupEnd();

    return {
      success: true,
      message: '차량이 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in deleteVehicle:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '차량 삭제 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 차량 상태 업데이트 (활성화/비활성화)
 * @param vehicleId - 차량 ID
 * @param status - 새로운 상태
 * @returns API 응답
 */
export async function updateVehicleStatus(
  vehicleId: string,
  status: 'active' | 'unavailable'
): Promise<ApiResponse> {
  console.group('🔄 updateVehicleStatus Server Action');
  console.log('Vehicle ID:', vehicleId, 'New status:', status);
  
  try {
    // 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 차량 소유자 확인 및 업데이트
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', vehicleId)
      .eq('owner_id', clerkUserId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update error:', error);
      console.groupEnd();
      throw new Error(`상태 업데이트 실패: ${error.message}`);
    }

    if (!data) {
      console.error('❌ Vehicle not found or not owned by user');
      console.groupEnd();
      return { success: false, error: '차량을 찾을 수 없거나 권한이 없습니다.' };
    }

    // 페이지 재검증
    revalidatePath('/vehicles/my');
    revalidatePath('/vehicles');
    revalidatePath(`/vehicles/${vehicleId}`);

    console.log('✅ Vehicle status updated');
    console.groupEnd();

    return {
      success: true,
      message: '차량 상태가 업데이트되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in updateVehicleStatus:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '상태 업데이트 중 오류가 발생했습니다.',
    };
  }
}

