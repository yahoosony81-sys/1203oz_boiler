/**
 * @file image-uploader.tsx
 * @description 이미지 업로드 컴포넌트
 * 
 * Supabase Storage에 이미지를 업로드하고 미리보기를 제공합니다.
 * 드래그 앤 드롭 및 파일 선택을 지원합니다.
 */

"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  bucketName?: string;
  folderPath?: string;
  className?: string;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  bucketName = "vehicle-images",
  folderPath,
  className,
}: ImageUploaderProps) {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const supabase = createClient();

  // 파일 업로드 처리
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!user) {
      setUploadError("로그인이 필요합니다.");
      return null;
    }
    
    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      setUploadError("이미지 파일만 업로드 가능합니다.");
      return null;
    }
    
    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("파일 크기는 5MB 이하여야 합니다.");
      return null;
    }
    
    try {
      // 파일명 생성 (중복 방지)
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folderPath 
        ? `${user.id}/${folderPath}/${fileName}`
        : `${user.id}/${fileName}`;
      
      console.log("[ImageUploader] 업로드 시작:", filePath);
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      
      if (uploadError) {
        console.error("[ImageUploader] 업로드 실패:", uploadError);
        setUploadError(`업로드 실패: ${uploadError.message}`);
        return null;
      }
      
      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log("[ImageUploader] 업로드 성공:", publicUrl);
      return publicUrl;
    } catch (err) {
      console.error("[ImageUploader] 예외 발생:", err);
      setUploadError("업로드 중 오류가 발생했습니다.");
      return null;
    }
  }, [user, supabase, bucketName, folderPath]);

  // 파일 선택 처리
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploadError(null);
    setIsUploading(true);
    
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      setUploadError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`);
      setIsUploading(false);
      return;
    }
    
    const uploadedUrls: string[] = [];
    
    for (const file of filesToUpload) {
      const url = await uploadFile(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }
    
    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls]);
    }
    
    setIsUploading(false);
  }, [images, maxImages, uploadFile, onImagesChange]);

  // 이미지 삭제
  const handleRemoveImage = useCallback((indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // 드래그 앤 드롭 이벤트
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* 업로드 영역 */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading || images.length >= maxImages}
        />
        
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">업로드 중...</span>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400" />
              <span className="text-sm text-gray-600">
                이미지를 드래그하거나 클릭하여 업로드
              </span>
              <span className="text-xs text-gray-400">
                최대 {maxImages}개, 각 5MB 이하
              </span>
            </>
          )}
        </label>
      </div>

      {/* 에러 메시지 */}
      {uploadError && (
        <p className="text-sm text-red-500">{uploadError}</p>
      )}

      {/* 이미지 미리보기 */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square rounded-lg overflow-hidden border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`업로드 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* 삭제 버튼 */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* 첫 번째 이미지 표시 */}
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                  대표 이미지
                </div>
              )}
            </div>
          ))}
          
          {/* 빈 슬롯 표시 */}
          {Array.from({ length: maxImages - images.length }).map((_, index) => (
            <label
              key={`empty-${index}`}
              htmlFor="image-upload"
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

