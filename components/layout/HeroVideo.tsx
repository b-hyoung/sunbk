"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=1920&q=80&auto=format&fit=crop",
    alt: "선박 항해",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80&auto=format&fit=crop",
    alt: "컨테이너선",
  },
  {
    src: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1920&q=80&auto=format&fit=crop",
    alt: "인천항",
  },
  {
    src: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=1920&q=80&auto=format&fit=crop",
    alt: "항구 풍경",
  },
];

export default function HeroVideo() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  // 클라이언트에서만 랜덤 시작 인덱스 설정 (SSR hydration mismatch 방지)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(Math.floor(Math.random() * IMAGES.length));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        const next = (c + 1) % IMAGES.length;
        setTimeout(() => setPrev(null), 1000);
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {/* 이전 이미지 (페이드아웃) */}
      {prev !== null && (
        <Image
          key={`prev-${prev}`}
          src={IMAGES[prev].src}
          alt={IMAGES[prev].alt}
          fill
          className="object-cover animate-fadeout"
          priority
          unoptimized
        />
      )}

      {/* 현재 이미지 (페이드인) */}
      <Image
        key={`curr-${current}`}
        src={IMAGES[current].src}
        alt={IMAGES[current].alt}
        fill
        className="object-cover animate-fadein"
        priority
        unoptimized
      />

      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
    </div>
  );
}
