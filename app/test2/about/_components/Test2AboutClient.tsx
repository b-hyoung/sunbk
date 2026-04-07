"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, X, ChevronLeft, ChevronRight } from "lucide-react";

interface WorkPhoto {
  id: number;
  src: string;
  title: string;
  ship: string;
}

export default function Test2AboutClient({ photos }: { photos: WorkPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % photos.length);

  return (
    <div className="bg-white">
      {/* ── 히어로 ── */}
      <section className="relative bg-[#001e42] py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e42]/90 via-[#001e42]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Work Photos
          </p>
          <h1 className="text-white font-bold text-4xl md:text-5xl mb-5 max-w-xl leading-tight">
            현장의 기록,<br />수연선박의 작업사진
          </h1>
          <p className="text-white/50 text-lg max-w-lg leading-relaxed">
            해상 작업부터 화물 하역, 다이버 작업까지 — 수연선박의 다양한 현장을 사진으로 확인하세요.
          </p>
        </div>
      </section>

      {/* ── 작업사진 ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-2">Gallery</p>
          <h2 className="text-[#001e42] text-2xl font-bold mb-2">작업사진</h2>
          <p className="text-sm text-[#001e42]/40">❈ 사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F3F3] rounded-none">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="mt-3">
                <p className="text-[#09388a] font-bold text-base">{photo.title}</p>
                <p className="text-[#001e42]/40 text-sm mt-0.5">▨ {photo.ship}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-[#E6E7E9] rounded-none p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-3">Contact</p>
              <h2 className="text-[#001e42] text-2xl font-bold mb-2">궁금한 점이 있으신가요?</h2>
              <p className="text-[#001e42]/50 text-sm">선박 전문 상담사가 친절하게 안내해드립니다.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center justify-center gap-2 bg-[#09388a] hover:bg-[#072d6e] text-white px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                010-0000-0000
              </a>
              <Link
                href="/test2/contact"
                className="inline-flex items-center justify-center gap-2 border border-[#E6E7E9] hover:border-[#09388a] hover:text-[#09388a] text-[#001e42]/70 px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                오시는길
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 라이트박스 ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#001e42]/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            onClick={closeLightbox}
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
            <div className="absolute bottom-0 left-0 right-0 bg-[#001e42]/70 px-5 py-3 text-center">
              <p className="text-white font-semibold">{photos[lightboxIndex].title}</p>
              <p className="text-white/50 text-sm">▨ {photos[lightboxIndex].ship}</p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-5 text-white/40 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
