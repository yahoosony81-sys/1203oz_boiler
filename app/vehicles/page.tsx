/**
 * @file app/vehicles/page.tsx
 * @description 차량 검색 결과 페이지
 * 
 * 검색 조건에 맞는 차량 목록을 표시합니다.
 * 
 * 주요 기능:
 * 1. 검색 필터 (날짜, 공항, 가격, 연식)
 * 2. 차량 목록 표시
 * 3. 정렬 기능
 */

"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SortAsc, Car, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard } from "@/components/vehicle-card";
import { searchVehicles } from "@/actions/vehicle-actions";
import { AIRPORTS } from "@/types/vehicle";
import type { Vehicle, VehicleSearchFilters } from "@/types/vehicle";

export const dynamic = "force-dynamic";

function VehicleSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL 파라미터에서 초기값 추출
  const initialFrom = searchParams.get("from") || "";
  const initialTo = searchParams.get("to") || "";
  const initialAirport = searchParams.get("airport") || "";
  
  // 상태
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 필터 상태
  const [filters, setFilters] = useState<VehicleSearchFilters>({
    airport_location: initialAirport || undefined,
    start_date: initialFrom ? new Date(initialFrom) : undefined,
    end_date: initialTo ? new Date(initialTo) : undefined,
    min_price: undefined,
    max_price: undefined,
  });
  
  // 필터 UI 상태
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "year" | "created">("created");

  // 차량 검색
  const fetchVehicles = useCallback(async () => {
    console.group("[VehiclesPage] 차량 검색");
    console.log("필터:", filters);
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchVehicles(filters);
      
      if (result.success && result.data) {
        console.log("검색 결과:", result.data.length, "건");
        
        // 정렬 적용
        let sortedVehicles = [...result.data];
        switch (sortBy) {
          case "price":
            sortedVehicles.sort((a, b) => a.price_per_day - b.price_per_day);
            break;
          case "year":
            sortedVehicles.sort((a, b) => b.year - a.year);
            break;
          case "created":
          default:
            sortedVehicles.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        }
        
        setVehicles(sortedVehicles);
      } else {
        console.error("검색 실패:", result.error);
        setError(result.error || "차량 검색에 실패했습니다.");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      setError("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, [filters, sortBy]);

  // 초기 로드 및 필터 변경 시 검색
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // 필터 적용
  const handleApplyFilters = () => {
    fetchVehicles();
    setShowFilters(false);
  };

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters({
      airport_location: undefined,
      start_date: undefined,
      end_date: undefined,
      min_price: undefined,
      max_price: undefined,
    });
    router.push("/vehicles");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">차량 검색</h1>
        <p className="text-gray-600 mt-1">
          {filters.airport_location && `${filters.airport_location} · `}
          총 {vehicles.length}대의 차량이 있습니다.
        </p>
      </div>

      {/* 필터 & 정렬 바 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
          
          {/* 빠른 필터: 공항 선택 */}
          <Select
            value={filters.airport_location || "all"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                airport_location: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="공항 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 공항</SelectItem>
              {Object.entries(AIRPORTS).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 정렬 */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">최신순</SelectItem>
              <SelectItem value="price">가격순</SelectItem>
              <SelectItem value="year">연식순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 확장 필터 패널 */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 이용 시작일 */}
            <div className="space-y-2">
              <Label>이용 시작일</Label>
              <Input
                type="datetime-local"
                value={
                  filters.start_date
                    ? filters.start_date.toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    start_date: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>

            {/* 이용 종료일 */}
            <div className="space-y-2">
              <Label>이용 종료일</Label>
              <Input
                type="datetime-local"
                value={
                  filters.end_date
                    ? filters.end_date.toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    end_date: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>

            {/* 최소 가격 */}
            <div className="space-y-2">
              <Label>최소 가격 (원/일)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.min_price || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    min_price: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>

            {/* 최대 가격 */}
            <div className="space-y-2">
              <Label>최대 가격 (원/일)</Label>
              <Input
                type="number"
                placeholder="100000"
                value={filters.max_price || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    max_price: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleApplyFilters}>
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              초기화
            </Button>
          </div>
        </div>
      )}

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
            검색 결과가 없습니다
          </h2>
          <p className="text-gray-500 mb-6">
            다른 조건으로 검색해보세요.
          </p>
          <Button variant="outline" onClick={handleResetFilters}>
            필터 초기화
          </Button>
        </div>
      )}

      {/* 차량 목록 */}
      {!isLoading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <VehicleSearchContent />
    </Suspense>
  );
}
