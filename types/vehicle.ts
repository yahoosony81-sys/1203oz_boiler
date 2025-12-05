/**
 * @file vehicle.ts
 * @description 차량 관련 타입 정의
 * 
 * TripCarShare 차량 공유 플랫폼의 차량 관련 타입들을 정의합니다.
 */

// 차량 상태
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  RESERVED: 'reserved',
  UNAVAILABLE: 'unavailable',
} as const;

export type VehicleStatus = typeof VEHICLE_STATUS[keyof typeof VEHICLE_STATUS];

// 예약 상태
export const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// 결제 상태
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// 공항 목록
export const AIRPORTS = {
  JEJU: '제주 국제공항',
  GIMPO: '김포 국제공항',
  INCHEON: '인천 국제공항',
  GIMHAE: '김해 국제공항',
} as const;

export type Airport = typeof AIRPORTS[keyof typeof AIRPORTS];

// 차량 인터페이스
export interface Vehicle {
  id: string;
  owner_id: string;
  model: string;
  year: number;
  plate_number: string;
  description: string | null;
  price_per_day: number;
  images: string[];
  available_from: string;
  available_until: string;
  airport_location: string;
  parking_location: string | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

// 차량 등록 폼 데이터
export interface VehicleFormData {
  model: string;
  year: number;
  plate_number: string;
  description: string;
  price_per_day: number;
  available_from: Date;
  available_until: Date;
  airport_location: string;
  parking_location: string;
}

// 예약 인터페이스
export interface Booking {
  id: string;
  vehicle_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  pickup_location: string | null;
  return_location: string | null;
  total_price: number;
  payment_status: PaymentStatus;
  payment_id: string | null;
  order_id: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

// 예약 생성 폼 데이터
export interface BookingFormData {
  vehicle_id: string;
  start_date: Date;
  end_date: Date;
  pickup_location?: string;
  return_location?: string;
}

// 차량 검색 필터
export interface VehicleSearchFilters {
  airport_location?: string;
  start_date?: Date;
  end_date?: Date;
  min_price?: number;
  max_price?: number;
  year_min?: number;
  year_max?: number;
}

// 차량 with 예약 정보
export interface VehicleWithBookings extends Vehicle {
  bookings?: Booking[];
}

