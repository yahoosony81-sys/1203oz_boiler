/**
 * @file app/vehicles/new/page.tsx
 * @description 차량 등록 페이지
 * 
 * 차주가 새로운 차량을 등록할 수 있는 폼 페이지입니다.
 * 
 * 주요 기능:
 * 1. 차량 기본 정보 입력 (차종, 연식, 번호판)
 * 2. 상세 설명 및 가격 설정
 * 3. 이용 가능 날짜 선택
 * 4. 공항 및 주차 위치 입력
 * 5. 차량 이미지 업로드
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { DateRange } from "react-day-picker";
import { Car, MapPin, Calendar, DollarSign, FileText, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { ImageUploader } from "@/components/image-uploader";
import { createVehicle } from "@/actions/vehicle-actions";
import { AIRPORTS } from "@/types/vehicle";

export const dynamic = "force-dynamic";

export default function NewVehiclePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  
  // 폼 상태
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [plateNumber, setPlateNumber] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState<number>(50000);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [airportLocation, setAirportLocation] = useState("");
  const [parkingLocation, setParkingLocation] = useState("");
  const [images, setImages] = useState<string[]>([]);
  
  // UI 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        <p className="text-gray-600 mb-4">차량을 등록하려면 먼저 로그인해주세요.</p>
        <Button onClick={() => router.push("/sign-in")}>로그인</Button>
      </div>
    );
  }

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      model.trim() !== "" &&
      year > 1990 &&
      year <= new Date().getFullYear() + 1 &&
      plateNumber.trim() !== "" &&
      pricePerDay > 0 &&
      dateRange?.from &&
      dateRange?.to &&
      airportLocation !== ""
    );
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    console.group("[NewVehiclePage] 차량 등록 제출");
    console.log("사용자:", user?.id);
    
    try {
      const result = await createVehicle(
        {
          model,
          year,
          plate_number: plateNumber,
          description,
          price_per_day: pricePerDay,
          available_from: dateRange!.from!,
          available_until: dateRange!.to!,
          airport_location: airportLocation,
          parking_location: parkingLocation,
        },
        images
      );
      
      if (result.success) {
        console.log("등록 성공:", result.data);
        console.groupEnd();
        router.push("/vehicles/my");
      } else {
        console.error("등록 실패:", result.error);
        console.groupEnd();
        setError(result.error || "차량 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("예외 발생:", err);
      console.groupEnd();
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 연식 옵션 생성 (최근 20년)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">차량 등록</h1>
        <p className="text-gray-600 mt-2">
          공유할 차량 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 차량 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              차량 기본 정보
            </CardTitle>
            <CardDescription>차량의 기본적인 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">차종 *</Label>
                <Input
                  id="model"
                  placeholder="예: 현대 아반떼"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">연식 *</Label>
                <Select
                  value={year.toString()}
                  onValueChange={(value) => setYear(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="연식 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plateNumber">차량 번호판 *</Label>
              <Input
                id="plateNumber"
                placeholder="예: 12가 3456"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 상세 설명 및 가격 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              상세 정보
            </CardTitle>
            <CardDescription>차량에 대한 추가 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">차량 설명</Label>
              <Textarea
                id="description"
                placeholder="차량의 특징, 상태, 옵션 등을 자유롭게 설명해주세요."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerDay" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                일일 대여료 (원) *
              </Label>
              <Input
                id="pricePerDay"
                type="number"
                min={10000}
                step={1000}
                value={pricePerDay}
                onChange={(e) => setPricePerDay(parseInt(e.target.value) || 0)}
                required
              />
              <p className="text-sm text-gray-500">
                권장 가격: 30,000원 ~ 100,000원
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 이용 가능 기간 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              이용 가능 기간
            </CardTitle>
            <CardDescription>차량을 대여할 수 있는 기간을 선택해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="이용 가능 기간 선택"
            />
          </CardContent>
        </Card>

        {/* 위치 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              위치 정보
            </CardTitle>
            <CardDescription>차량 픽업 위치 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="airportLocation">공항 *</Label>
              <Select
                value={airportLocation}
                onValueChange={setAirportLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="공항 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AIRPORTS).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parkingLocation">주차 위치 상세</Label>
              <Input
                id="parkingLocation"
                placeholder="예: 제1주차장 B구역 123번"
                value={parkingLocation}
                onChange={(e) => setParkingLocation(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                이용자가 차량을 찾을 수 있도록 구체적인 위치를 입력해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 차량 이미지 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              차량 이미지
            </CardTitle>
            <CardDescription>
              차량 사진을 업로드해주세요. 첫 번째 사진이 대표 이미지가 됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              folderPath="vehicles"
            />
          </CardContent>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid()}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                등록 중...
              </>
            ) : (
              "차량 등록"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
