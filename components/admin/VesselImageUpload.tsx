"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, X, Star } from "lucide-react";
import { VESSEL_FILTER_CATEGORIES } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselImageUploadProps {
  images: VesselImage[];
  onChange: (images: VesselImage[]) => void;
}

const categoryOptions = VESSEL_FILTER_CATEGORIES.filter((c) => c.key !== "all");

export default function VesselImageUpload({ images, onChange }: VesselImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blobUrls = useRef<string[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImages: VesselImage[] = files.map((file, i) => ({
      id: `img-${Date.now()}-${i}`,
      vessel_id: "",
      url: URL.createObjectURL(file),
      is_primary: images.length === 0 && i === 0,
      sort_order: images.length + i + 1,
      category: "exterior",
    }));
    blobUrls.current.push(...newImages.map((img) => img.url));
    onChange([...images, ...newImages]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    const removed = images.find((img) => img.id === id);
    if (removed?.url.startsWith("blob:")) {
      URL.revokeObjectURL(removed.url);
    }
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
      filtered[0].is_primary = true;
    }
    onChange(filtered);
  };

  useEffect(() => {
    return () => {
      blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const setPrimary = (id: string) => {
    onChange(images.map((img) => ({ ...img, is_primary: img.id === id })));
  };

  const setCategory = (id: string, category: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, category } : img)));
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image src={img.url} alt="" fill className="object-cover" sizes="200px" unoptimized />
              {img.is_primary && (
                <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5" /> 대표
                </span>
              )}
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(img.id)}
                    className="bg-white/90 hover:bg-white text-gray-600 rounded-full p-1"
                    aria-label="대표 이미지로 설정"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1"
                  aria-label="사진 삭제"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <select
                value={img.category ?? "exterior"}
                onChange={(e) => setCategory(img.id, e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs">사진 추가</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
        aria-label="사진 파일 선택"
      />
    </div>
  );
}
