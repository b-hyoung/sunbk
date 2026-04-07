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

export default function AboutClient({ photos }: { photos: WorkPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! - 1 + photos.length) % photos.length);
  const next = () => setLightboxIndex((i) => (i! + 1) % photos.length);

  return (
    <div className="bg-white">
      {/* ── 히어로 ── */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-20" poster="/hero-bg.jpg">
          <source src="https://videos.pexels.com/video-files/6472920/6472920-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Work Photos
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            현장의 기록,<br />수연선박의 작업사진
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            해상 작업부터 화물 하역, 다이버 작업까지 — 수연선박의 다양한 현장을 사진으로 확인하세요.
          </p>
        </div>
      </section>

      {/* ── 작업사진 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-10">
          <h2 className="text-gray-900 mb-2">작업사진</h2>
          <p className="text-sm text-gray-400">❈ 사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="mt-3">
                <p className="text-[#407EC0] font-bold text-base">{photo.title}</p>
                <p className="text-gray-400 text-sm mt-0.5">▨ {photo.ship}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-600 rounded-2xl px-8 py-14 md:py-16 text-center">
            <h2 className="text-white mb-3">궁금한 점이 있으신가요?</h2>
            <p className="text-blue-100 text-base mb-8 max-w-md mx-auto">
              선박 전문 상담사가 친절하게 안내해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-7 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                010-0000-0000
              </a>
              <Link
                href="/test1/contact"
                className="inline-flex items-center justify-center gap-2 border border-blue-400 hover:bg-blue-500 text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                온라인 문의
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 라이트박스 ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
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
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-5 py-3 text-center">
              <p className="text-white font-semibold">{photos[lightboxIndex].title}</p>
              <p className="text-white/60 text-sm">▨ {photos[lightboxIndex].ship}</p>
            </div>
          </div>

          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-5 text-white/50 text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
