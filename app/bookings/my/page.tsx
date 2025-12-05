/**
 * @file app/bookings/my/page.tsx
 * @description 내 예약 관리 페이지 (이용자용)
 * 
 * 이용자가 자신이 신청한 예약을 관리할 수 있는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 내가 신청한 예약 목록
 * 2. 상태별 필터링
 * 3. 예약 취소
 * 4. 결제 진행
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Calendar, RefreshCw, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingCard } from "@/components/booking-card";
import { getMyBookings, cancelBooking } from "@/actions/booking-actions";
import type { Booking, Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

// 차량 정보가 포함된 예약 타입
interface BookingWithVehicle extends Booking {
  vehicles?: Vehicle;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 예약 목록 조회
  const fetchBookings = useCallback(async () => {
    console.group("[MyBookingsPage] 예약 목록 조회");
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getMyBookings();
      
      if (result.success && result.data) {
        console.log("조회 성공:", result.data.length, "건");
        setBookings(result.data as BookingWithVehicle[]);
      } else {
        console.error("조회 실패:", result.error);
        setError(result.error || "예약 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      setError("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, []);

  // 필터링 적용
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [bookings, statusFilter]);

  // 페이지 로드 시 조회
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBookings();
    }
  }, [isLoaded, isSignedIn, fetchBookings]);

  // 예약 취소
  const handleCancel = async (bookingId: string) => {
    if (!confirm("정말 이 예약을 취소하시겠습니까?")) return;
    
    console.log("[MyBookingsPage] 예약 취소:", bookingId);
    setIsActionLoading(true);
    
    const result = await cancelBooking(bookingId);
    
    if (result.success) {
      // 목록 업데이트
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b))
      );
    } else {
      alert(result.error || "취소에 실패했습니다.");
    }
    
    setIsActionLoading(false);
  };

  // 결제 진행 (TODO: Toss Payments 연동)
  const handlePay = async (bookingId: string) => {
    alert("결제 기능은 준비 중입니다. (Toss Payments 연동 예정)");
    // TODO: 결제 기능 구현
  };

  // 로그인 체크
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
        <p className="text-gray-600 mb-4">예약을 관리하려면 먼저 로그인해주세요.</p>
        <Button onClick={() => router.push("/sign-in")}>로그인</Button>
      </div>
    );
  }

  // 상태별 예약 개수
  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    approved: bookings.filter((b) => b.status === "approved").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 예약</h1>
          <p className="text-gray-600 mt-1">
            신청한 예약을 관리하세요.
          </p>
        </div>
        
        <Button variant="outline" onClick={fetchBookings} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* 필터 */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-5 h-5 text-gray-500" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 ({statusCounts.all})</SelectItem>
            <SelectItem value="pending">승인 대기 ({statusCounts.pending})</SelectItem>
            <SelectItem value="approved">승인됨 ({statusCounts.approved})</SelectItem>
            <SelectItem value="completed">완료 ({statusCounts.completed})</SelectItem>
            <SelectItem value="cancelled">취소됨 ({statusCounts.cancelled})</SelectItem>
            <SelectItem value="rejected">거절됨 ({statusCounts.rejected})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && !error && filteredBookings.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {statusFilter === "all" ? "예약 내역이 없습니다" : "해당 상태의 예약이 없습니다"}
          </h2>
          <p className="text-gray-500 mb-6">
            차량을 검색하고 예약을 신청해보세요!
          </p>
          <Button onClick={() => router.push("/vehicles")}>차량 검색하기</Button>
        </div>
      )}

      {/* 예약 목록 */}
      {!isLoading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              mode="renter"
              onCancel={handleCancel}
              onPay={handlePay}
              isLoading={isActionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
