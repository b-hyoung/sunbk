"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { WORK_FILTER_CATEGORIES } from "@/constants/photo-config";

interface WorkPhoto {
  id: string;
  src: string;
  title: string;
  ship: string;
  vessel_id: string;
  category: string;
  taken_date?: string;
}

interface WorkGalleryProps {
  photos: WorkPhoto[];
}

export default function WorkGallery({ photos }: WorkGalleryProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shipFilter, setShipFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const ships = useMemo(() => {
    const unique = [...new Map(photos.map((p) => [p.vessel_id, p.ship])).entries()];
    return [{ id: "all", name: "전체 선박" }, ...unique.map(([id, name]) => ({ id, name }))];
  }, [photos]);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (categoryFilter !== "all" && !p.category.startsWith(categoryFilter)) return false;
      if (shipFilter !== "all" && p.vessel_id !== shipFilter) return false;
      return true;
    });
  }, [photos, categoryFilter, shipFilter]);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + filtered.length) % filtered.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % filtered.length);

  return (
    <>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {WORK_FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            aria-pressed={categoryFilter === cat.key}
            className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
              categoryFilter === cat.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 선박 필터 */}
      <div className="flex gap-2 flex-wrap mb-8">
        {ships.map((s) => (
          <button
            key={s.id}
            onClick={() => setShipFilter(s.id)}
            aria-pressed={shipFilter === s.id}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              shipFilter === s.id
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-400 hover:border-gray-400"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* 사진 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo, i) => (
          <button
            key={photo.id}
            className="group cursor-pointer text-left"
            onClick={() => openLightbox(i)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={photo.src}
                alt={`${photo.ship} ${photo.title}`}
                fill
                loading={i < 8 ? "eager" : "lazy"}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                {photo.title}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-800">{photo.ship}</p>
              {photo.taken_date && (
                <p className="text-xs text-gray-400">{photo.taken_date}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          해당 조건의 사진이 없습니다.
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-lightbox-title"
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white"
            onClick={closeLightbox}
            aria-label="닫기"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 text-white/70 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div
            className="relative w-full max-w-4xl mx-4 sm:mx-8 lg:mx-16 aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={`${filtered[lightboxIndex].ship} ${filtered[lightboxIndex].title}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p id="work-lightbox-title" className="text-white font-semibold">
                {filtered[lightboxIndex].ship} — {filtered[lightboxIndex].title}
              </p>
              {filtered[lightboxIndex].taken_date && (
                <p className="text-white/50 text-sm">{filtered[lightboxIndex].taken_date}</p>
              )}
            </div>
          </div>
          <button
            className="absolute right-4 text-white/70 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="다음 사진"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="absolute bottom-5 text-white/50 text-sm">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </>
  );
}
