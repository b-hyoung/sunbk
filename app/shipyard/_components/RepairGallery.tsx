"use client";

import { useState, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";

type Category = "all" | "build" | "hull" | "paint" | "engine";

const categoryLabel: Record<Category, string> = {
  all: "전체",
  build: "신조",
  hull: "수리",
  paint: "도장",
  engine: "기관",
};

interface RepairCase {
  id: string;
  category: Exclude<Category, "all">;
  title: string;
  desc: string;
}

const cases: RepairCase[] = [
  { id: "case-1", category: "hull", title: "FRP 선체 파손 복원", desc: "측면 충돌로 뚫린 선체 FRP 보강 후 도장 마감" },
  { id: "case-2", category: "paint", title: "선체 도장 재시공", desc: "방오도료 재도포 + 상부 색상 정비" },
  { id: "case-3", category: "engine", title: "메인 엔진 정비", desc: "실린더 헤드 오버홀, 냉각 계통 점검" },
  { id: "case-4", category: "build", title: "신조 작업선 건조", desc: "15m급 작업선 신규 제작 (설계~인도)" },
  { id: "case-5", category: "hull", title: "강판 용접 보수", desc: "선저 강판 부식부 절삭 후 신강판 용접" },
  { id: "case-6", category: "paint", title: "데크 논슬립 코팅", desc: "갑판 미끄럼 방지 에폭시 코팅 시공" },
];

const categories: Category[] = ["all", "build", "hull", "paint", "engine"];

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
        <p className="text-sm text-gray-400 mb-6">Before · After 비교로 보는 실제 작업</p>

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
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                <Placeholder label="Before" />
                <Placeholder label="After" />
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

function Placeholder({ label }: { label: string }) {
  return (
    <div className="aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300">
      <ImageIcon className="w-8 h-8" />
      <span className="text-xs font-medium tracking-wide">{label}</span>
      <span className="text-[10px] text-gray-300">사진 준비 중</span>
    </div>
  );
}
