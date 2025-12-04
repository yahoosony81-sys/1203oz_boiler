/**
 * @file types/database.ts
 * @description 트립카셰어 데이터베이스 타입 정의
 * 
 * Supabase 데이터베이스의 테이블 구조를 TypeScript 타입으로 정의합니다.
 * 
 * @dependencies
 * - 없음 (순수 TypeScript 타입 정의)
 */

// =====================================================
// Users 테이블 타입
// =====================================================
export type UserRole = 'owner' | 'renter';

export interface User {
  id: string;
  clerk_id: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Vehicles 테이블 타입
// =====================================================
export type VehicleStatus = 'active' | 'reserved' | 'unavailable';

export interface Vehicle {
  id: string;
  owner_id: string; // Clerk user ID
  model: string;
  year: number;
  plate_number: string;
  description: string | null;
  price_per_day: number;
  images: string[]; // 이미지 URL 배열
  available_from: string; // ISO 8601 date string
  available_until: string; // ISO 8601 date string
  airport_location: string;
  parking_location: string | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Bookings 테이블 타입
// =====================================================
export type BookingStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'cancelled';

export interface Booking {
  id: string;
  vehicle_id: string;
  renter_id: string; // Clerk user ID
  start_date: string; // ISO 8601 date string
  end_date: string; // ISO 8601 date string
  status: BookingStatus;
  pickup_location: string | null;
  return_location: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// Form 입력 타입 (클라이언트 사이드)
// =====================================================

// 차량 등록 폼 데이터
export interface VehicleFormData {
  model: string;
  year: number;
  plate_number: string;
  description?: string;
  price_per_day: number;
  available_from: Date;
  available_until: Date;
  airport_location: string;
  parking_location?: string;
  images: File[]; // 업로드할 이미지 파일들
}

// 차량 업데이트 폼 데이터
export interface VehicleUpdateFormData extends Partial<VehicleFormData> {
  id: string;
  status?: VehicleStatus;
}

// 예약 생성 폼 데이터
export interface BookingFormData {
  vehicle_id: string;
  start_date: Date;
  end_date: Date;
  pickup_location?: string;
  return_location?: string;
}

// =====================================================
// API 응답 타입
// =====================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 차량과 소유자 정보를 함께 반환하는 타입
export interface VehicleWithOwner extends Vehicle {
  owner: Pick<User, 'name' | 'phone' | 'is_verified'>;
}

// 예약과 차량, 사용자 정보를 함께 반환하는 타입
export interface BookingWithDetails extends Booking {
  vehicle: Vehicle;
  renter: Pick<User, 'name' | 'phone'>;
}

