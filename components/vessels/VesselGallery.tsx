"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryLabel } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselGalleryProps {
  images: VesselImage[];
  vesselTitle: string;
}

export default function VesselGallery({ images, vesselTitle }: VesselGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center text-gray-200 text-8xl select-none">
        🚢
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <>
      {/* 메인 이미지 */}
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={activeImage.url}
          alt={`${vesselTitle} - ${getCategoryLabel(activeImage.category ?? "")}`}
          fill
          className="object-cover"
          priority
        />
        {activeImage.category && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {getCategoryLabel(activeImage.category)}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* 썸네일 스트립 */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-blue-500" : "border-gray-100 hover:border-blue-300"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              {img.category && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 leading-tight">
                  {getCategoryLabel(img.category)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-7 h-7" />
          </button>

          <button
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-4xl mx-16 aspect-[16/9]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].url}
              alt={`${vesselTitle} - ${getCategoryLabel(images[activeIndex].category ?? "")}`}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p className="text-white font-semibold">
                {vesselTitle} — {getCategoryLabel(images[activeIndex].category ?? "")}
              </p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-5 text-white/50 text-sm">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
