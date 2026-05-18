"use client";

import Link from "next/link";
import { VESSEL_CATEGORIES, USE_CASES } from "@/lib/vessel-types";
import type { UseCase } from "@/lib/supabase";

interface VesselFilterProps {
  currentType?: string;
  currentVesselType?: string;
  currentUse?: string;
}

const useCaseOrder: UseCase[] = ["survey", "construction", "cargo"];

export default function VesselFilter({
  currentType,
  currentVesselType,
  currentUse,
}: VesselFilterProps) {
  const base = `/vessels`;
  const activeClass = "bg-blue-600 text-white font-medium";
  const inactiveClass = "text-gray-500 hover:text-gray-900 hover:bg-gray-50";
  const typePillActive = "bg-blue-600 text-white font-medium";
  const typePillInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const typeItems = [
    { label: "전체", value: "" },
    { label: "임대", value: "rent" },
    { label: "판매", value: "sale" },
  ];

  const useItems = [
    { label: "전체 용도", value: "" },
    ...useCaseOrder.map((uc) => ({ label: `${USE_CASES[uc].icon} ${USE_CASES[uc].label}`, value: uc })),
  ];

  const vesselTypeItems = [
    { label: "전체", value: "" },
    ...VESSEL_CATEGORIES.map((c) => ({ label: c, value: c })),
  ];

  function buildHref(overrides: { type?: string; vessel_type?: string; use?: string }) {
    const params = new URLSearchParams();
    const type = overrides.type ?? currentType ?? "";
    const vesselType = overrides.vessel_type ?? currentVesselType ?? "";
    const use = overrides.use ?? currentUse ?? "";
    if (type) params.set("type", type);
    if (vesselType) params.set("vessel_type", vesselType);
    if (use) params.set("use", use);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  return (
    <>
      {/* ── 모바일: 가로 스크롤 pill ── */}
      <nav aria-label="선박 필터" className="lg:hidden space-y-2">
        {/* 용도 */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {useItems.map((item) => (
              <Link
                key={`m-use-${item.value}`}
                href={buildHref({ use: item.value })}
                aria-current={(currentUse ?? "") === item.value ? "page" : undefined}
                className={`shrink-0 px-4 py-3 rounded-full text-sm transition-colors leading-none ${
                  (currentUse ?? "") === item.value ? typePillActive : typePillInactive
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* 거래 유형 */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {typeItems.map((item) => (
              <Link
                key={`m-type-${item.value}`}
                href={buildHref({ type: item.value })}
                aria-current={(currentType ?? "") === item.value ? "page" : undefined}
                className={`shrink-0 px-4 py-3 rounded-full text-sm transition-colors leading-none ${
                  (currentType ?? "") === item.value ? typePillActive : typePillInactive
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* 선박 종류 */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {vesselTypeItems.map((item) => (
              <Link
                key={`m-cat-${item.value}`}
                href={buildHref({ vessel_type: item.value })}
                aria-current={(currentVesselType ?? "") === item.value ? "page" : undefined}
                className={`shrink-0 px-4 py-3 rounded-full text-sm transition-colors leading-none ${
                  (currentVesselType ?? "") === item.value ? typePillActive : typePillInactive
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </nav>

      {/* ── 데스크탑: 세로 사이드바 ── */}
      <nav aria-label="선박 필터" className="hidden lg:block space-y-8">
        {/* 용도 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">용도</p>
          <div className="space-y-0.5">
            {useItems.map((item) => (
              <Link
                key={`d-use-${item.value}`}
                href={buildHref({ use: item.value })}
                aria-current={(currentUse ?? "") === item.value ? "page" : undefined}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  (currentUse ?? "") === item.value ? activeClass : inactiveClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 거래 유형 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">거래 유형</p>
          <div className="space-y-0.5">
            {typeItems.map((item) => (
              <Link
                key={`d-type-${item.value}`}
                href={buildHref({ type: item.value })}
                aria-current={(currentType ?? "") === item.value ? "page" : undefined}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  (currentType ?? "") === item.value ? activeClass : inactiveClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 선박 종류 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">선박 종류</p>
          <div className="space-y-0.5">
            {vesselTypeItems.map((item) => (
              <Link
                key={`d-cat-${item.value}`}
                href={buildHref({ vessel_type: item.value })}
                aria-current={(currentVesselType ?? "") === item.value ? "page" : undefined}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  (currentVesselType ?? "") === item.value ? activeClass : inactiveClass
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
