"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

type Category = "all" | "build" | "hull" | "wood" | "steel" | "maintain";

const categoryLabel: Record<Category, string> = {
  all: "전체",
  build: "신조",
  hull: "선체 복원",
  wood: "목선 수리",
  steel: "철선 수리",
  maintain: "점검·정비",
};

interface RepairCase {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  desc: string;
  beforeUrl?: string;
  afterUrl?: string;
}

const cases: RepairCase[] = [
  {
    id: "case-hull-1",
    category: "hull",
    title: "선체 파손 복원·재도장",
    desc: "외판 파손부 보수 후 전체 재도장 — 방오도료 포함",
    beforeUrl: "/images/shipyard/a_before.jpg",
    afterUrl: "/images/shipyard/a_after.jpg",
  },
  { id: "case-build-1", category: "build", title: "소형 어선 신조 건조", desc: "어업용 소형 어선 신규 제작 — 설계부터 인도까지" },
  { id: "case-wood-1", category: "wood", title: "목선 선체 복원", desc: "노후 목선 전체 복원 — 손상 부재 교체 후 방부·마감" },
  { id: "case-wood-2", category: "wood", title: "목선 부분 목재 교체", desc: "부식·파손된 늑골·외판 부분 교체, 기존 구조 유지" },
  { id: "case-steel-1", category: "steel", title: "철선 강판 교체", desc: "선체 외판 부식부 절삭 후 신강판 용접 접합" },
  { id: "case-steel-2", category: "steel", title: "선저 용접 보수", desc: "선저 균열·파손부 용접 보수, 재도장까지 일괄 진행" },
  { id: "case-maintain-1", category: "maintain", title: "연례 정기 점검", desc: "장기 거래 선주 대상 입거 점검 — 필요한 작업만 정직하게" },
];

const categories: Category[] = ["all", "build", "hull", "wood", "steel", "maintain"];

export default function RepairGallery() {
  const [active, setActive] = useState<Category>("all");

  const filtered = useMemo(
    () => (active === "all" ? cases : cases.filter((c) => c.category === active)),
    [active]
  );

  return (
    <section className="bg-gray-50/60 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="text-gray-900 mb-2">작업 사례</h2>
        <p className="text-sm text-gray-400 mb-6">목선부터 철선까지 — 40년간 이어온 실제 작업 기록</p>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                active === c
                  ? "bg-blue-600 text-white font-medium"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {categoryLabel[c]}
            </button>
          ))}
        </div>

        {/* 페어 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="bg-white border border-gray-300 rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
                <Slot label="Before" src={c.beforeUrl} />
                <Slot label="After" src={c.afterUrl} />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {categoryLabel[c.category]}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-12">해당 카테고리 작업 사례가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

function Slot({ label, src }: { label: string; src?: string }) {
  if (src) {
    return (
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Image
          src={src}
          alt={`${label} — 선체 파손 복원 작업`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain"
        />
        <span className="absolute top-2 left-2 bg-gray-900/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          {label}
        </span>
      </div>
    );
  }
  return (
    <div className="aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300">
      <ImageIcon className="w-8 h-8" />
      <span className="text-xs font-medium tracking-wide">{label}</span>
      <span className="text-[10px] text-gray-300">사진 준비 중</span>
    </div>
  );
}
