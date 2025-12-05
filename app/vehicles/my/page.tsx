/**
 * @file app/vehicles/my/page.tsx
 * @description 내 차량 관리 페이지
 * 
 * 차주가 자신이 등록한 차량을 관리할 수 있는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 내 차량 목록 표시
 * 2. 차량 수정/삭제
 * 3. 차량 활성/비활성 토글
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Plus, Car, RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle-card";
import { getMyVehiclesWithBookingSummary, deleteVehicle, toggleVehicleStatus } from "@/actions/vehicle-actions";
import type { Vehicle } from "@/types/vehicle";

export const dynamic = "force-dynamic";

// 예약 현황 포함 차량 타입
interface VehicleWithSummary extends Vehicle {
  bookingSummary: {
    pending: number;
    approved: number;
    completed: number;
  };
}

export default function MyVehiclesPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  const [vehicles, setVehicles] = useState<VehicleWithSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 차량 목록 조회 (예약 현황 포함)
  const fetchVehicles = useCallback(async () => {
    console.group("[MyVehiclesPage] 차량 목록 조회");
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getMyVehiclesWithBookingSummary();
      
      if (result.success && result.data) {
        console.log("조회 성공:", result.data.length, "건");
        setVehicles(result.data);
      } else {
        console.error("조회 실패:", result.error);
        setError(result.error || "차량 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      setError("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, []);

  // 페이지 로드 시 조회
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchVehicles();
    }
  }, [isLoaded, isSignedIn, fetchVehicles]);

  // 차량 수정
  const handleEdit = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}/edit`);
  };

  // 차량 삭제
  const handleDelete = async (vehicleId: string) => {
    if (!confirm("정말 이 차량을 삭제하시겠습니까?")) return;
    
    console.log("[MyVehiclesPage] 차량 삭제:", vehicleId);
    
    const result = await deleteVehicle(vehicleId);
    
    if (result.success) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } else {
      alert(result.error || "삭제에 실패했습니다.");
    }
  };

  // 차량 상태 토글
  const handleToggleStatus = async (vehicleId: string, status: "active" | "unavailable") => {
    console.log("[MyVehiclesPage] 상태 변경:", vehicleId, "->", status);
    
    const result = await toggleVehicleStatus(vehicleId, status);
    
    if (result.success && result.data) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicleId ? { ...result.data!, bookingSummary: v.bookingSummary } : v))
      );
    } else {
      alert(result.error || "상태 변경에 실패했습니다.");
    }
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
        <p className="text-gray-600 mb-4">내 차량을 관리하려면 먼저 로그인해주세요.</p>
        <Button onClick={() => router.push("/sign-in")}>로그인</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 차량 관리</h1>
          <p className="text-gray-600 mt-1">
            등록한 차량을 관리하고 새 차량을 추가하세요.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchVehicles} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus className="w-4 h-4 mr-2" />
              차량 등록
            </Link>
          </Button>
        </div>
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
      {!isLoading && !error && vehicles.length === 0 && (
        <div className="text-center py-20">
          <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            등록된 차량이 없습니다
          </h2>
          <p className="text-gray-500 mb-6">
            첫 번째 차량을 등록하고 공유를 시작하세요!
          </p>
          <Button asChild>
            <Link href="/vehicles/new">
              <Plus className="w-4 h-4 mr-2" />
              차량 등록하기
            </Link>
          </Button>
        </div>
      )}

      {/* 차량 목록 */}
      {!isLoading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              showActions
              bookingSummary={vehicle.bookingSummary}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
