/**
 * @file actions/bookings.ts
 * @description 예약 관련 Server Actions
 * 
 * 예약 CRUD 작업을 처리하는 서버 액션들을 정의합니다.
 * 
 * 주요 기능:
 * 1. 예약 생성 (createBooking)
 * 2. 예약 조회 (getMyBookings, getReceivedBookings)
 * 3. 예약 승인/거절 (approveBooking, rejectBooking)
 * 4. 예약 취소 (cancelBooking)
 * 
 * @dependencies
 * - @clerk/nextjs: 사용자 인증
 * - @supabase/supabase-js: 데이터베이스 작업
 */

'use server';

import { auth } from '@clerk/nextjs/server';
import { createClerkSupabaseClient } from '@/lib/supabase/server';
import type { Booking, BookingFormData, ApiResponse, BookingWithDetails } from '@/types/database';
import { revalidatePath } from 'next/cache';

/**
 * 예약 생성 Server Action
 * @param formData - 예약 폼 데이터
 * @returns API 응답
 */
export async function createBooking(
  bookingData: BookingFormData
): Promise<ApiResponse<Booking>> {
  console.group('📝 createBooking Server Action');
  console.log('Booking data:', bookingData);

  try {
    // 1. 인증 확인
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    console.log('✅ User authenticated:', clerkUserId);

    // 2. 유효성 검사
    const { vehicle_id, start_date, end_date, pickup_location, return_location } = bookingData;

    if (!vehicle_id || !start_date || !end_date) {
      console.error('❌ Validation failed: Missing required fields');
      console.groupEnd();
      return { success: false, error: '필수 항목을 모두 입력해주세요.' };
    }

    if (end_date <= start_date) {
      console.error('❌ Validation failed: Invalid date range');
      console.groupEnd();
      return { success: false, error: '종료일은 시작일보다 이후여야 합니다.' };
    }

    // 3. Supabase 클라이언트 생성
    const supabase = await createClerkSupabaseClient();

    // 4. 차량 정보 조회
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('price_per_day, owner_id, status')
      .eq('id', vehicle_id)
      .single();

    if (vehicleError || !vehicle) {
      console.error('❌ Vehicle not found:', vehicleError);
      console.groupEnd();
      return { success: false, error: '차량을 찾을 수 없습니다.' };
    }

    // 자신의 차량에는 예약할 수 없음
    if (vehicle.owner_id === clerkUserId) {
      console.error('❌ Cannot book own vehicle');
      console.groupEnd();
      return { success: false, error: '본인의 차량은 예약할 수 없습니다.' };
    }

    // 차량 상태 확인
    if (vehicle.status !== 'active') {
      console.error('❌ Vehicle not available:', vehicle.status);
      console.groupEnd();
      return { success: false, error: '현재 이용할 수 없는 차량입니다.' };
    }

    // 5. 날짜 중복 체크 (함수 호출)
    const { data: isAvailable, error: availError } = await supabase
      .rpc('check_vehicle_availability', {
        p_vehicle_id: vehicle_id,
        p_start_date: start_date.toISOString(),
        p_end_date: end_date.toISOString(),
        p_exclude_booking_id: null,
      });

    if (availError) {
      console.error('❌ Availability check error:', availError);
      console.groupEnd();
      return { success: false, error: '예약 가능 여부 확인 중 오류가 발생했습니다.' };
    }

    if (!isAvailable) {
      console.error('❌ Vehicle not available for selected dates');
      console.groupEnd();
      return { success: false, error: '선택하신 기간에는 이미 다른 예약이 있습니다.' };
    }

    // 6. 총 금액 계산 (일수 × 일일 대여료)
    const days = Math.ceil(
      (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const total_price = days * vehicle.price_per_day;

    console.log('💰 Price calculation:', { days, price_per_day: vehicle.price_per_day, total_price });

    // 7. 예약 데이터 삽입
    const bookingInsertData = {
      vehicle_id,
      renter_id: clerkUserId,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      pickup_location: pickup_location || null,
      return_location: return_location || null,
      total_price,
      status: 'pending' as const,
    };

    console.log('💾 Inserting booking...');
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([bookingInsertData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      console.groupEnd();
      throw new Error(`예약 생성 실패: ${insertError.message}`);
    }

    console.log('✅ Booking created:', booking.id);

    // 8. 페이지 재검증
    revalidatePath('/bookings/my');
    revalidatePath(`/vehicles/${vehicle_id}`);

    console.groupEnd();

    return {
      success: true,
      data: booking as Booking,
      message: '예약 신청이 완료되었습니다. 차주의 승인을 기다려주세요.',
    };
  } catch (error) {
    console.error('❌ Error in createBooking:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 생성 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 내 예약 목록 조회 (이용자)
 * @returns 내 예약 목록
 */
export async function getMyBookings(): Promise<ApiResponse<BookingWithDetails[]>> {
  console.group('📋 getMyBookings Server Action');

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 예약 및 차량 정보 조회
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(*)
      `)
      .eq('renter_id', clerkUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      console.groupEnd();
      throw new Error(`예약 조회 실패: ${error.message}`);
    }

    // 각 예약의 차주 정보 조회
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of bookings || []) {
      // 차주 정보 조회
      const { data: renter } = await supabase
        .from('users')
        .select('name, phone')
        .eq('clerk_id', booking.renter_id)
        .single();

      bookingsWithDetails.push({
        ...booking,
        vehicle: booking.vehicle,
        renter: renter || { name: '알 수 없음', phone: null },
      } as BookingWithDetails);
    }

    console.log(`✅ Found ${bookingsWithDetails.length} bookings`);
    console.groupEnd();

    return {
      success: true,
      data: bookingsWithDetails,
    };
  } catch (error) {
    console.error('❌ Error in getMyBookings:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 받은 예약 목록 조회 (차주)
 * @returns 받은 예약 목록
 */
export async function getReceivedBookings(): Promise<ApiResponse<BookingWithDetails[]>> {
  console.group('📋 getReceivedBookings Server Action');

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 내 차량들의 예약 조회
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles!inner(*)
      `)
      .eq('vehicle.owner_id', clerkUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      console.groupEnd();
      throw new Error(`예약 조회 실패: ${error.message}`);
    }

    // 각 예약의 이용자 정보 조회
    const bookingsWithDetails: BookingWithDetails[] = [];
    
    for (const booking of bookings || []) {
      // 이용자 정보 조회
      const { data: renter } = await supabase
        .from('users')
        .select('name, phone')
        .eq('clerk_id', booking.renter_id)
        .single();

      bookingsWithDetails.push({
        ...booking,
        vehicle: booking.vehicle,
        renter: renter || { name: '알 수 없음', phone: null },
      } as BookingWithDetails);
    }

    console.log(`✅ Found ${bookingsWithDetails.length} bookings`);
    console.groupEnd();

    return {
      success: true,
      data: bookingsWithDetails,
    };
  } catch (error) {
    console.error('❌ Error in getReceivedBookings:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 조회 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 예약 승인 (차주)
 * @param bookingId - 예약 ID
 * @returns API 응답
 */
export async function approveBooking(bookingId: string): Promise<ApiResponse> {
  console.group('✅ approveBooking Server Action');
  console.log('Booking ID:', bookingId);

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 예약 정보 및 차량 소유자 확인
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(owner_id)
      `)
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found');
      console.groupEnd();
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // 차량 소유자 확인
    if (booking.vehicle.owner_id !== clerkUserId) {
      console.error('❌ Forbidden: Not the vehicle owner');
      console.groupEnd();
      return { success: false, error: '예약을 승인할 권한이 없습니다.' };
    }

    // 예약 승인
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'approved' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      console.groupEnd();
      throw new Error(`예약 승인 실패: ${updateError.message}`);
    }

    // 차량 상태를 'reserved'로 변경
    await supabase
      .from('vehicles')
      .update({ status: 'reserved' })
      .eq('id', booking.vehicle_id);

    // 같은 기간의 다른 대기 중인 예약들을 거절 처리
    await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('vehicle_id', booking.vehicle_id)
      .eq('status', 'pending')
      .neq('id', bookingId);

    // 페이지 재검증
    revalidatePath('/bookings/received');
    revalidatePath('/bookings/my');

    console.log('✅ Booking approved');
    console.groupEnd();

    return {
      success: true,
      message: '예약이 승인되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in approveBooking:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 승인 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 예약 거절 (차주)
 * @param bookingId - 예약 ID
 * @returns API 응답
 */
export async function rejectBooking(bookingId: string): Promise<ApiResponse> {
  console.group('❌ rejectBooking Server Action');
  console.log('Booking ID:', bookingId);

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 예약 정보 및 차량 소유자 확인
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        vehicle:vehicles(owner_id)
      `)
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found');
      console.groupEnd();
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // 차량 소유자 확인
    if (booking.vehicle.owner_id !== clerkUserId) {
      console.error('❌ Forbidden: Not the vehicle owner');
      console.groupEnd();
      return { success: false, error: '예약을 거절할 권한이 없습니다.' };
    }

    // 예약 거절
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      console.groupEnd();
      throw new Error(`예약 거절 실패: ${updateError.message}`);
    }

    // 페이지 재검증
    revalidatePath('/bookings/received');
    revalidatePath('/bookings/my');

    console.log('✅ Booking rejected');
    console.groupEnd();

    return {
      success: true,
      message: '예약이 거절되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in rejectBooking:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 거절 중 오류가 발생했습니다.',
    };
  }
}

/**
 * 예약 취소 (이용자)
 * @param bookingId - 예약 ID
 * @returns API 응답
 */
export async function cancelBooking(bookingId: string): Promise<ApiResponse> {
  console.group('🚫 cancelBooking Server Action');
  console.log('Booking ID:', bookingId);

  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      console.error('❌ Unauthorized');
      console.groupEnd();
      return { success: false, error: '로그인이 필요합니다.' };
    }

    const supabase = await createClerkSupabaseClient();

    // 예약 정보 확인
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found');
      console.groupEnd();
      return { success: false, error: '예약을 찾을 수 없습니다.' };
    }

    // 예약자 확인
    if (booking.renter_id !== clerkUserId) {
      console.error('❌ Forbidden: Not the renter');
      console.groupEnd();
      return { success: false, error: '예약을 취소할 권한이 없습니다.' };
    }

    // 예약 취소
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      console.groupEnd();
      throw new Error(`예약 취소 실패: ${updateError.message}`);
    }

    // 차량 상태를 'active'로 되돌림 (승인된 예약인 경우)
    if (booking.status === 'approved') {
      await supabase
        .from('vehicles')
        .update({ status: 'active' })
        .eq('id', booking.vehicle_id);
    }

    // 페이지 재검증
    revalidatePath('/bookings/my');
    revalidatePath('/bookings/received');

    console.log('✅ Booking cancelled');
    console.groupEnd();

    return {
      success: true,
      message: '예약이 취소되었습니다.',
    };
  } catch (error) {
    console.error('❌ Error in cancelBooking:', error);
    console.groupEnd();
    return {
      success: false,
      error: error instanceof Error ? error.message : '예약 취소 중 오류가 발생했습니다.',
    };
  }
}

