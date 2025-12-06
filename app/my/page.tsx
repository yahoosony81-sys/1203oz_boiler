/**
 * @file app/my/page.tsx
 * @description 마이페이지 메인 컴포넌트
 * 
 * 사용자 프로필, 통계 정보, 주문 내역을 표시하는 통합 마이페이지입니다.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  Car, 
  Loader2,
  RefreshCw,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { OrderCard } from "@/components/order-card";
import { getMyOrders, getMyProfileStats, type OrderWithDetails, type ProfileStats } from "@/actions/my-page-actions";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export const dynamic = "force-dynamic";

// 필터 옵션
type FilterOption = "all" | "paid" | "completed" | "cancelled";

export default function MyPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDetails[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; phone: string | null; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterOption>("all");

  const supabase = useClerkSupabaseClient();

  // 사용자 정보 조회
  const fetchUserInfo = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from("users")
        .select("name, phone, role")
        .eq("clerk_id", user.id)
        .single();
      
      if (data) {
        setUserInfo(data);
      }
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
    }
  }, [user, supabase]);

  // 통계 정보 조회
  const fetchStats = useCallback(async () => {
    console.group("[MyPage] 통계 정보 조회");
    
    try {
      const result = await getMyProfileStats();
      
      if (result.success && result.data) {
        console.log("통계 조회 성공:", result.data);
        setStats(result.data);
      } else {
        console.error("통계 조회 실패:", result.error);
      }
    } catch (err) {
      console.error("예외 발생:", err);
    } finally {
      console.groupEnd();
    }
  }, []);

  // 주문 내역 조회
  const fetchOrders = useCallback(async () => {
    console.group("[MyPage] 주문 내역 조회");
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getMyOrders();
      
      if (result.success && result.data) {
        console.log("조회 성공:", result.data.length, "건");
        setOrders(result.data);
      } else {
        console.error("조회 실패:", result.error);
        setError(result.error || "주문 내역을 불러오는데 실패했습니다.");
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
      setFilteredOrders(orders);
    } else if (statusFilter === "paid") {
      setFilteredOrders(orders.filter((o) => o.payment_status === "paid"));
    } else {
      setFilteredOrders(orders.filter((o) => o.status === statusFilter));
    }
  }, [orders, statusFilter]);

  // 초기 데이터 로드
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchUserInfo();
      fetchStats();
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, fetchUserInfo, fetchStats, fetchOrders]);

  // 로그인 체크
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-gray-600 mb-4">마이페이지를 보려면 먼저 로그인해주세요.</p>
            <Button onClick={() => router.push("/sign-in")}>로그인</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-gray-600 mt-1">주문 내역과 통계를 확인하세요</p>
        </div>
        <Button variant="outline" onClick={() => { fetchStats(); fetchOrders(); }} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          새로고침
        </Button>
      </div>

      {/* 사용자 프로필 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            프로필 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* 프로필 이미지 */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={userInfo?.name || user.fullName || "프로필"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* 사용자 정보 */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">
                {userInfo?.name || user.fullName || user.emailAddresses[0]?.emailAddress || "사용자"}
              </h2>
              <p className="text-gray-600 mb-1">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              {userInfo?.phone && (
                <p className="text-sm text-gray-500">{userInfo.phone}</p>
              )}
              {userInfo?.role && (
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {userInfo.role === "owner" ? "차주" : "이용자"}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 카드 섹션 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="총 주문 수"
            value={stats.totalOrders}
            icon={ShoppingBag}
            iconColor="text-blue-600"
          />
          <StatsCard
            title="총 결제 금액"
            value={`${stats.totalAmount.toLocaleString()}원`}
            icon={CreditCard}
            iconColor="text-green-600"
          />
          <StatsCard
            title="진행 중 예약"
            value={stats.activeBookings}
            icon={Calendar}
            iconColor="text-orange-600"
            href="/bookings/my"
          />
          {stats.registeredVehicles > 0 && (
            <StatsCard
              title="등록 차량"
              value={stats.registeredVehicles}
              icon={Car}
              iconColor="text-purple-600"
              href="/vehicles/my"
            />
          )}
        </div>
      )}

      {/* 주문 내역 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              주문 내역
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterOption)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="paid">결제 완료</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="cancelled">취소됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2">주문 내역이 없습니다</p>
              <Button variant="outline" asChild>
                <a href="/vehicles">차량 검색하기</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

