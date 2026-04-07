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

  // 사진을 3개씩 묶어서 벤토 그리드 행 생성
  const rows: WorkPhoto[][] = [];
  for (let i = 0; i < photos.length; i += 3) {
    rows.push(photos.slice(i, i + 3));
  }

  return (
    <div className="bg-white">
      {/* ── 히어로 ── */}
      <section className="relative bg-[#001e42] py-28 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-15" poster="/hero-bg.jpg">
          <source src="https://videos.pexels.com/video-files/6472920/6472920-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>
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

      {/* ── 작업사진 벤토 그리드 ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-2">Gallery</p>
          <h2 className="text-[#001e42] text-2xl font-bold mb-2">작업사진</h2>
          <p className="text-sm text-[#001e42]/40">❈ 사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>

        <div className="space-y-4">
          {rows.map((row, rowIdx) => {
            const globalOffset = rowIdx * 3;
            const isReversed = rowIdx % 2 === 1;

            if (row.length === 3) {
              // 대형 1장 + 소형 2장 (홀수 행은 좌우 반전)
              const large = row[0];
              const smallPhotos = [row[1], row[2]];

              const largeBlock = (
                <div
                  key={large.id}
                  className="group cursor-pointer relative overflow-hidden bg-[#F3F3F3]"
                  onClick={() => openLightbox(globalOffset)}
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px]">
                    <Image src={large.src} alt={large.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001e42]/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-white font-bold text-lg">{large.title}</p>
                      <p className="text-white/50 text-sm">▨ {large.ship}</p>
                    </div>
                  </div>
                </div>
              );

              const smallBlock = (
                <div key={`small-${rowIdx}`} className="flex flex-col gap-4">
                  {smallPhotos.map((photo, si) => (
                    <div
                      key={photo.id}
                      className="group cursor-pointer relative overflow-hidden bg-[#F3F3F3] flex-1"
                      onClick={() => openLightbox(globalOffset + 1 + si)}
                    >
                      <div className="relative aspect-[16/9] md:aspect-auto md:h-full min-h-[134px]">
                        <Image src={photo.src} alt={photo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#001e42]/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm">{photo.title}</p>
                          <p className="text-white/50 text-xs">▨ {photo.ship}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );

              return (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:min-h-[320px]">
                  {isReversed ? (
                    <>
                      <div className="md:col-span-1">{smallBlock}</div>
                      <div className="md:col-span-2">{largeBlock}</div>
                    </>
                  ) : (
                    <>
                      <div className="md:col-span-2">{largeBlock}</div>
                      <div className="md:col-span-1">{smallBlock}</div>
                    </>
                  )}
                </div>
              );
            }

            // 남은 1~2장
            return (
              <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {row.map((photo, si) => (
                  <div
                    key={photo.id}
                    className="group cursor-pointer relative overflow-hidden bg-[#F3F3F3]"
                    onClick={() => openLightbox(globalOffset + si)}
                  >
                    <div className="relative aspect-[16/9]">
                      <Image src={photo.src} alt={photo.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001e42]/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-semibold text-base">{photo.title}</p>
                        <p className="text-white/50 text-sm">▨ {photo.ship}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#001e42] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">궁금한 점이 있으신가요?</h2>
            <p className="text-white/50 text-sm">선박 전문 상담사가 친절하게 안내해드립니다.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="tel:010-0000-0000"
              className="inline-flex items-center gap-2 bg-[#09388a] hover:bg-[#072d6e] text-white px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              010-0000-0000
            </a>
            <Link
              href="/test2/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              오시는길
            </Link>
          </div>
        </div>
      </section>

      {/* ── 라이트박스 ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#001e42]/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors" onClick={closeLightbox}>
            <X className="w-7 h-7" />
          </button>
          <button className="absolute left-4 text-white/70 hover:text-white transition-colors p-2" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-4xl mx-16 aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image src={photos[lightboxIndex].src} alt={photos[lightboxIndex].title} fill className="object-contain" unoptimized />
            <div className="absolute bottom-0 left-0 right-0 bg-[#001e42]/70 px-5 py-4 text-center">
              <p className="text-white font-bold text-lg">{photos[lightboxIndex].title}</p>
              <p className="text-white/50 text-sm">▨ {photos[lightboxIndex].ship}</p>
            </div>
          </div>

          <button className="absolute right-4 text-white/70 hover:text-white transition-colors p-2" onClick={(e) => { e.stopPropagation(); next(); }}>
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
