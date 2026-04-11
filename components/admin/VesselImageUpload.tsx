"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, X, Star, Loader2 } from "lucide-react";
import { VESSEL_FILTER_CATEGORIES } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselImageUploadProps {
  images: VesselImage[];
  onChange: (images: VesselImage[]) => void;
  vesselSlug: string;
}

const categoryOptions = VESSEL_FILTER_CATEGORIES.filter((c) => c.key !== "all");

export default function VesselImageUpload({ images, onChange, vesselSlug }: VesselImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const newImages: VesselImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("vesselSlug", vesselSlug || `vessel-${Date.now()}`);

      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) continue;
        const { url } = await res.json();

        newImages.push({
          id: `img-${Date.now()}-${i}`,
          vessel_id: "",
          url,
          is_primary: images.length === 0 && newImages.length === 0,
          sort_order: images.length + newImages.length + 1,
          category: "exterior",
        });
      } catch {
        // skip failed uploads
      }
    }

    onChange([...images, ...newImages]);
    if (inputRef.current) inputRef.current.value = "";
    setUploading(false);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.is_primary)) {
      filtered[0].is_primary = true;
    }
    onChange(filtered);
  };

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

              {/* 대표 이미지 별 — 항상 표시 */}
              <button
                type="button"
                onClick={() => setPrimary(img.id)}
                className={`absolute top-1.5 left-1.5 rounded-full p-1 transition-colors ${
                  img.is_primary
                    ? "bg-blue-600 text-white"
                    : "bg-black/30 text-white/60 hover:bg-blue-600 hover:text-white"
                }`}
                title="대표 이미지 변경"
              >
                <Star className={`w-3.5 h-3.5 ${img.is_primary ? "fill-current" : ""}`} />
              </button>

              {/* 삭제 버튼 */}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 bg-black/30 hover:bg-red-500 text-white/60 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                aria-label="사진 삭제"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              <select
                value={categoryOptions.some((c) => c.key === img.category) ? img.category ?? "exterior" : "__custom__"}
                onChange={(e) => setCategory(img.id, e.target.value === "__custom__" ? "" : e.target.value)}
                className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
                <option value="__custom__">기타 (직접 입력)</option>
              </select>
              {!categoryOptions.some((c) => c.key === img.category) && img.category !== "exterior" && (
                <input
                  type="text"
                  value={img.category ?? ""}
                  onChange={(e) => setCategory(img.id, e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600"
                  placeholder="카테고리 입력"
                />
              )}
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">업로드 중...</span>
            </>
          ) : (
            <>
              <Plus className="w-6 h-6" />
              <span className="text-xs">사진 추가</span>
            </>
          )}
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
