import Link from "next/link";
import { ChevronRight, Ship } from "lucide-react";
import type { Vessel } from "@/lib/supabase";
import {
  VESSEL_CLASS_INFO,
  VESSEL_CLASS_ORDER,
  type VesselClass,
} from "@/lib/vessel-types";
import UseCaseVesselCard from "./UseCaseVesselCard";

interface Group {
  cls: VesselClass;
  vessels: Vessel[];
  total: number;
}

interface Props {
  groups: Group[];
}

export default function VesselClassSections({ groups }: Props) {
  const order = VESSEL_CLASS_ORDER.filter((c) =>
    groups.some((g) => g.cls === c),
  );

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
        <div className="space-y-24 lg:space-y-32">
          {order.map((cls) => {
            const g = groups.find((gg) => gg.cls === cls);
            if (!g) return null;
            const info = VESSEL_CLASS_INFO[cls];
            return (
              <div key={cls} data-stagger>
                {/* 섹션 헤더 (타이틀 + 설명 = 한 그룹, 타이트) */}
                <div className="mb-10 lg:mb-12">
                  <div className="flex items-center justify-between gap-4 mb-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl lg:text-3xl leading-none opacity-80">
                        {info.icon}
                      </span>
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight leading-none">
                        {info.label}
                        <span className="ml-2 text-sm font-normal text-gray-400">
                          {g.total}척
                        </span>
                      </h3>
                    </div>
                    {g.total > g.vessels.length && (
                      <Link
                        href={`/vessels?cls=${cls}`}
                        className="group flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                      >
                        더보기
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>

                  {/* 설명 (HWPX 발췌) — 타이틀과 한 그룹 */}
                  {/* 모바일: 자동 wrap (\n 무시), 데스크탑: \n을 줄바꿈으로 + 넓은 폭 */}
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-prose lg:max-w-5xl whitespace-normal lg:whitespace-pre-line">
                    {info.description}
                  </p>
                </div>

                {/* 카드 그리드 — 척수에 맞춰 적응 */}
                {g.vessels.length > 0 ? (
                  <div
                    className={`grid gap-3 lg:gap-4 ${
                      g.vessels.length === 1
                        ? "grid-cols-1 sm:max-w-xs"
                        : g.vessels.length === 2
                          ? "grid-cols-2 sm:max-w-2xl"
                          : g.vessels.length === 3
                            ? "grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-2 lg:grid-cols-4"
                    }`}
                  >
                    {g.vessels.map((v) => (
                      <UseCaseVesselCard key={v.id} vessel={v} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-300 border border-dashed border-gray-200 rounded-xl">
                    <Ship className="w-10 h-10 mb-3" />
                    <p className="text-sm text-gray-400">
                      이 유형의 선박을 추가 중입니다.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
