"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { COMPANY } from "@/constants/company";

interface WorkPhoto {
  id: number;
  src: string;
  title: string;
  ship: string;
}

export default function Test3AboutClient({ photos }: { photos: WorkPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % photos.length);

  return (
    <div className="bg-white">
      {/* ── 히어로 ── */}
      <div className="bg-[#0a1628] py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/test3" className="hover:text-white/70 transition-colors">메인</Link>
            <span>〉</span>
            <span className="text-white/70">작업사진</span>
          </nav>
          <div className="border-l-4 border-[#036EB8] pl-5">
            <p className="text-[#036EB8] text-[10px] font-bold tracking-widest uppercase mb-2">WORK PHOTOS</p>
            <h1 className="text-white text-2xl font-bold mb-2">현장의 기록</h1>
            <p className="text-white/50 text-sm">
              해상 작업부터 화물 하역, 다이버 작업까지 — {COMPANY.name}의 다양한 현장을 확인하세요.
            </p>
          </div>
        </div>
      </div>

      {/* ── 작업사진 그리드 ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-[#036EB8]">작업사진</h2>
            <hr className="border-t-2 border-[#036EB8] w-10 mt-2" />
          </div>
          <p className="text-xs text-gray-400">사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-[#036EB8] transition-colors">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-[#036EB8]/0 group-hover:bg-[#036EB8]/20 transition-colors duration-300" />
              </div>
              <div className="mt-3 pl-1">
                <p className="text-[#036EB8] font-bold text-sm">{photo.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">▨ {photo.ship}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0a1628] py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">궁금한 점이 있으신가요?</h2>
            <p className="text-white/50 text-sm">선박 전문 상담사가 친절하게 안내해드립니다.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-[#036EB8] hover:bg-[#0257a0] text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/test3/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              온라인 문의
            </Link>
          </div>
        </div>
      </section>

      {/* ── 라이트박스 ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-7 h-7" />
          </button>

          <button
            className="absolute left-4 text-white/60 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div
            className="relative w-full max-w-3xl mx-16 aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].title}
              fill
              className="object-contain"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#0a1628]/80 border-t border-[#036EB8]/30 px-5 py-3 text-center">
              <p className="text-white font-semibold text-sm">{photos[lightboxIndex].title}</p>
              <p className="text-white/50 text-xs mt-0.5">▨ {photos[lightboxIndex].ship}</p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/60 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-5 text-white/40 text-xs">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
