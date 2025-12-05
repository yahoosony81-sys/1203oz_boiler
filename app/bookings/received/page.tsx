/**
 * @file app/bookings/received/page.tsx
 * @description 받은 예약 관리 페이지 (차주용)
 * 
 * 차주가 자신의 차량에 들어온 예약 요청을 관리할 수 있는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 받은 예약 요청 목록
 * 2. 상태별 필터링
 * 3. 예약 승인/거절
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Inbox, RefreshCw, Filter, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingCard } from "@/components/booking-card";
import { getReceivedBookings, approveBooking, rejectBooking } from "@/actions/booking-actions";
import type { Booking, Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

// 차량 정보가 포함된 예약 타입
interface BookingWithVehicle extends Booking {
  vehicles?: Vehicle;
}

export default function ReceivedBookingsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  const [bookings, setBookings] = useState<BookingWithVehicle[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending"); // 기본값: 대기중

  // 예약 목록 조회
  const fetchBookings = useCallback(async () => {
    console.group("[ReceivedBookingsPage] 받은 예약 조회");
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getReceivedBookings();
      
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

  // 예약 승인
  const handleApprove = async (bookingId: string) => {
    if (!confirm("이 예약을 승인하시겠습니까?\n승인하면 해당 기간의 다른 대기중인 예약은 자동으로 거절됩니다.")) {
      return;
    }
    
    console.log("[ReceivedBookingsPage] 예약 승인:", bookingId);
    setIsActionLoading(true);
    
    const result = await approveBooking(bookingId);
    
    if (result.success) {
      // 목록 새로고침 (다른 예약들도 상태가 변경될 수 있으므로)
      await fetchBookings();
    } else {
      alert(result.error || "승인에 실패했습니다.");
    }
    
    setIsActionLoading(false);
  };

  // 예약 거절
  const handleReject = async (bookingId: string) => {
    if (!confirm("이 예약을 거절하시겠습니까?")) return;
    
    console.log("[ReceivedBookingsPage] 예약 거절:", bookingId);
    setIsActionLoading(true);
    
    const result = await rejectBooking(bookingId);
    
    if (result.success) {
      // 목록 업데이트
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "rejected" as const } : b))
      );
    } else {
      alert(result.error || "거절에 실패했습니다.");
    }
    
    setIsActionLoading(false);
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

  // 대기 중인 예약 알림
  const pendingCount = statusCounts.pending;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">받은 예약</h1>
          <p className="text-gray-600 mt-1">
            내 차량에 대한 예약 요청을 관리하세요.
          </p>
        </div>
        
        <Button variant="outline" onClick={fetchBookings} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* 대기 중 알림 */}
      {pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">
              {pendingCount}건의 예약 요청이 승인을 기다리고 있습니다
            </p>
            <p className="text-sm text-yellow-600">
              빠른 응답은 고객 만족도를 높입니다!
            </p>
          </div>
        </div>
      )}

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
          <Inbox className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {statusFilter === "all" 
              ? "받은 예약이 없습니다" 
              : statusFilter === "pending"
              ? "대기 중인 예약이 없습니다"
              : "해당 상태의 예약이 없습니다"}
          </h2>
          <p className="text-gray-500 mb-6">
            차량을 등록하면 예약 요청을 받을 수 있습니다.
          </p>
          <Button onClick={() => router.push("/vehicles/my")}>내 차량 관리</Button>
        </div>
      )}

      {/* 예약 목록 */}
      {!isLoading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              mode="owner"
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={isActionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
