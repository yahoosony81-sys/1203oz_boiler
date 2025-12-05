/**
 * @file vehicle-actions.ts
 * @description 차량 관련 Server Actions
 * 
 * 차량 CRUD 작업을 위한 Server Actions를 정의합니다.
 * - createVehicle: 새 차량 등록
 * - updateVehicle: 차량 정보 수정
 * - deleteVehicle: 차량 삭제
 * - getMyVehicles: 내 차량 목록 조회
 * - getVehicleById: 차량 상세 조회
 * - searchVehicles: 차량 검색
 * 
 * @dependencies
 * - @clerk/nextjs: 인증
 * - @supabase/ssr: Supabase 서버 클라이언트
 */

"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Vehicle, VehicleFormData, VehicleSearchFilters } from "@/types/vehicle";

// 응답 타입
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 새 차량 등록
 */
export async function createVehicle(
  formData: VehicleFormData,
  imageUrls: string[]
): Promise<ActionResult<Vehicle>> {
  console.group("[createVehicle] 차량 등록 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("인증되지 않은 사용자");
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    console.log("사용자 ID:", userId);
    console.log("폼 데이터:", formData);
    console.log("이미지 URL:", imageUrls);
    
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        owner_id: userId,
        model: formData.model,
        year: formData.year,
        plate_number: formData.plate_number,
        description: formData.description || null,
        price_per_day: formData.price_per_day,
        images: imageUrls,
        available_from: formData.available_from.toISOString(),
        available_until: formData.available_until.toISOString(),
        airport_location: formData.airport_location,
        parking_location: formData.parking_location || null,
        status: "active",
      })
      .select()
      .single();
    
    if (error) {
      console.error("차량 등록 실패:", error);
      console.groupEnd();
      return { success: false, error: `차량 등록 실패: ${error.message}` };
    }
    
    console.log("차량 등록 성공:", data);
    console.groupEnd();
    
    // 캐시 무효화
    revalidatePath("/vehicles/my");
    revalidatePath("/vehicles");
    
    return { success: true, data: data as Vehicle };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 차량 정보 수정
 */
export async function updateVehicle(
  vehicleId: string,
  formData: Partial<VehicleFormData>,
  imageUrls?: string[]
): Promise<ActionResult<Vehicle>> {
  console.group("[updateVehicle] 차량 수정 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 본인 차량인지 확인
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("owner_id")
      .eq("id", vehicleId)
      .single();
    
    if (fetchError || !existingVehicle) {
      console.groupEnd();
      return { success: false, error: "차량을 찾을 수 없습니다." };
    }
    
    if (existingVehicle.owner_id !== userId) {
      console.groupEnd();
      return { success: false, error: "수정 권한이 없습니다." };
    }
    
    // 업데이트할 데이터 구성
    const updateData: Record<string, unknown> = {};
    
    if (formData.model) updateData.model = formData.model;
    if (formData.year) updateData.year = formData.year;
    if (formData.plate_number) updateData.plate_number = formData.plate_number;
    if (formData.description !== undefined) updateData.description = formData.description || null;
    if (formData.price_per_day) updateData.price_per_day = formData.price_per_day;
    if (formData.available_from) updateData.available_from = formData.available_from.toISOString();
    if (formData.available_until) updateData.available_until = formData.available_until.toISOString();
    if (formData.airport_location) updateData.airport_location = formData.airport_location;
    if (formData.parking_location !== undefined) updateData.parking_location = formData.parking_location || null;
    if (imageUrls) updateData.images = imageUrls;
    
    const { data, error } = await supabase
      .from("vehicles")
      .update(updateData)
      .eq("id", vehicleId)
      .select()
      .single();
    
    if (error) {
      console.error("차량 수정 실패:", error);
      console.groupEnd();
      return { success: false, error: `차량 수정 실패: ${error.message}` };
    }
    
    console.log("차량 수정 성공:", data);
    console.groupEnd();
    
    revalidatePath("/vehicles/my");
    revalidatePath(`/vehicles/${vehicleId}`);
    revalidatePath("/vehicles");
    
    return { success: true, data: data as Vehicle };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 차량 삭제
 */
export async function deleteVehicle(vehicleId: string): Promise<ActionResult> {
  console.group("[deleteVehicle] 차량 삭제 시작");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    // 본인 차량인지 확인
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select("owner_id")
      .eq("id", vehicleId)
      .single();
    
    if (fetchError || !existingVehicle) {
      console.groupEnd();
      return { success: false, error: "차량을 찾을 수 없습니다." };
    }
    
    if (existingVehicle.owner_id !== userId) {
      console.groupEnd();
      return { success: false, error: "삭제 권한이 없습니다." };
    }
    
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", vehicleId);
    
    if (error) {
      console.error("차량 삭제 실패:", error);
      console.groupEnd();
      return { success: false, error: `차량 삭제 실패: ${error.message}` };
    }
    
    console.log("차량 삭제 성공:", vehicleId);
    console.groupEnd();
    
    revalidatePath("/vehicles/my");
    revalidatePath("/vehicles");
    
    return { success: true };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 차량 상태 변경 (활성/비활성)
 */
export async function toggleVehicleStatus(
  vehicleId: string, 
  status: "active" | "unavailable"
): Promise<ActionResult<Vehicle>> {
  console.group("[toggleVehicleStatus] 차량 상태 변경");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("vehicles")
      .update({ status })
      .eq("id", vehicleId)
      .eq("owner_id", userId)
      .select()
      .single();
    
    if (error) {
      console.error("상태 변경 실패:", error);
      console.groupEnd();
      return { success: false, error: `상태 변경 실패: ${error.message}` };
    }
    
    console.log("상태 변경 성공:", data);
    console.groupEnd();
    
    revalidatePath("/vehicles/my");
    revalidatePath(`/vehicles/${vehicleId}`);
    
    return { success: true, data: data as Vehicle };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 내 차량 목록 조회
 */
export async function getMyVehicles(): Promise<ActionResult<Vehicle[]>> {
  console.group("[getMyVehicles] 내 차량 조회");
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.groupEnd();
      return { success: false, error: "로그인이 필요합니다." };
    }
    
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("조회 실패:", error);
      console.groupEnd();
      return { success: false, error: `조회 실패: ${error.message}` };
    }
    
    console.log("조회 성공, 차량 수:", data?.length || 0);
    console.groupEnd();
    
    return { success: true, data: (data || []) as Vehicle[] };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 차량 상세 조회
 */
export async function getVehicleById(vehicleId: string): Promise<ActionResult<Vehicle>> {
  console.group("[getVehicleById] 차량 상세 조회");
  
  try {
    const supabase = await createClerkSupabaseClient();
    
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .single();
    
    if (error) {
      console.error("조회 실패:", error);
      console.groupEnd();
      return { success: false, error: `차량을 찾을 수 없습니다.` };
    }
    
    console.log("조회 성공:", data);
    console.groupEnd();
    
    return { success: true, data: data as Vehicle };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

/**
 * 차량 검색
 */
export async function searchVehicles(
  filters: VehicleSearchFilters
): Promise<ActionResult<Vehicle[]>> {
  console.group("[searchVehicles] 차량 검색");
  console.log("필터:", filters);
  
  try {
    const supabase = await createClerkSupabaseClient();
    
    let query = supabase
      .from("vehicles")
      .select("*")
      .eq("status", "active");
    
    // 공항 필터
    if (filters.airport_location) {
      query = query.eq("airport_location", filters.airport_location);
    }
    
    // 날짜 필터 (이용 가능 기간 내)
    if (filters.start_date) {
      query = query.lte("available_from", filters.start_date.toISOString());
    }
    if (filters.end_date) {
      query = query.gte("available_until", filters.end_date.toISOString());
    }
    
    // 가격 필터
    if (filters.min_price) {
      query = query.gte("price_per_day", filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte("price_per_day", filters.max_price);
    }
    
    // 연식 필터
    if (filters.year_min) {
      query = query.gte("year", filters.year_min);
    }
    if (filters.year_max) {
      query = query.lte("year", filters.year_max);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("검색 실패:", error);
      console.groupEnd();
      return { success: false, error: `검색 실패: ${error.message}` };
    }
    
    console.log("검색 결과:", data?.length || 0, "건");
    console.groupEnd();
    
    return { success: true, data: (data || []) as Vehicle[] };
  } catch (err) {
    console.error("예외 발생:", err);
    console.groupEnd();
    return { 
      success: false, 
      error: err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다." 
    };
  }
}

