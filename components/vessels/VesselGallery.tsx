"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryLabel } from "@/constants/photo-config";
import type { VesselImage } from "@/lib/supabase";

interface VesselGalleryProps {
  images: VesselImage[];
  vesselTitle: string;
  autoplayInterval?: number;
}

const FADE_DURATION = 500;

export default function VesselGallery({
  images,
  vesselTitle,
  autoplayInterval = 5000,
}: VesselGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [paused, setPaused] = useState(false);

  const indexRef = useRef(0);
  const lengthRef = useRef(images.length);
  useEffect(() => { indexRef.current = activeIndex; }, [activeIndex]);
  useEffect(() => { lengthRef.current = images.length; }, [images.length]);

  const goTo = useCallback((i: number) => {
    if (i === indexRef.current) return;
    setActiveIndex(i);
  }, []);

  const prev = useCallback(() => {
    goTo((indexRef.current - 1 + lengthRef.current) % lengthRef.current);
  }, [goTo]);

  const next = useCallback(() => {
    goTo((indexRef.current + 1) % lengthRef.current);
  }, [goTo]);

  // 자동 슬라이드
  useEffect(() => {
    if (autoplayInterval <= 0 || paused || lightboxOpen || images.length <= 1) return;
    const timer = setInterval(next, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplayInterval, paused, lightboxOpen, images.length, next]);

  // 라이트박스 키보드
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prev, next]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center text-gray-200 text-8xl select-none">
        🚢
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <>
      <style>{`
        @keyframes galleryFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .gallery-fade-in {
          animation: galleryFadeIn ${FADE_DURATION}ms ease-in-out;
        }
      `}</style>

      {/* 메인 이미지 */}
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 cursor-pointer group"
        onClick={() => setLightboxOpen(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Image
          key={`main-${activeIndex}`}
          src={activeImage.url}
          alt={`${vesselTitle} - ${getCategoryLabel(activeImage.category ?? "")}`}
          fill
          className="object-cover gallery-fade-in"
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        {activeImage.category && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
            {getCategoryLabel(activeImage.category)}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />

        {/* 좌우 화살표 */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="이전 사진"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="다음 사진"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 인디케이터 닷 */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goTo(i); }}
                aria-label={`사진 ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 썸네일 스트립 */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i)}
              aria-label={getCategoryLabel(img.category ?? "") + " 보기"}
              className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex ? "border-blue-500" : "border-gray-100 hover:border-blue-300"
              }`}
            >
              <Image src={img.url} alt={getCategoryLabel(img.category ?? "")} fill className="object-cover" sizes="80px" />
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-lightbox-title"
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="닫기"
          >
            <X className="w-7 h-7" />
          </button>

          <button
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-4xl mx-4 sm:mx-8 lg:mx-16 aspect-[16/9]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={`lightbox-${activeIndex}`}
              src={images[activeIndex].url}
              alt={`${vesselTitle} - ${getCategoryLabel(images[activeIndex].category ?? "")}`}
              fill
              className="object-contain gallery-fade-in"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p id="gallery-lightbox-title" className="text-white font-semibold">
                {vesselTitle} — {getCategoryLabel(images[activeIndex].category ?? "")}
              </p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="다음 사진"
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
