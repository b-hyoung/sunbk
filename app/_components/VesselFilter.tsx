"use client";

import Link from "next/link";
import {
  VESSEL_CLASS_INFO,
  VESSEL_CLASS_ORDER,
  type VesselClass,
} from "@/lib/vessel-types";

interface VesselFilterProps {
  currentType?: string;
  currentCls?: string;
}

export default function VesselFilter({
  currentType,
  currentCls,
}: VesselFilterProps) {
  const base = `/vessels`;
  const activeClass = "bg-blue-600 text-white font-medium";
  const inactiveClass = "text-gray-500 hover:text-gray-900 hover:bg-gray-50";
  const typePillActive = "bg-blue-600 text-white font-medium";
  const typePillInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const classItems = [
    { label: "전체 유형", value: "" },
    ...VESSEL_CLASS_ORDER.map((c) => ({
      label: `${VESSEL_CLASS_INFO[c].icon} ${VESSEL_CLASS_INFO[c].label}`,
      value: c as VesselClass,
    })),
  ];

  function buildHref(overrides: { type?: string; cls?: string }) {
    const params = new URLSearchParams();
    const type = overrides.type ?? currentType ?? "";
    const cls = overrides.cls ?? currentCls ?? "";
    if (type) params.set("type", type);
    if (cls) params.set("cls", cls);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  return (
    <>
      {/* ── 모바일: 가로 스크롤 pill ── */}
      <nav aria-label="선박 필터" className="lg:hidden">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {classItems.map((item) => (
              <Link
                key={`m-cls-${item.value}`}
                href={buildHref({ cls: item.value })}
                aria-current={(currentCls ?? "") === item.value ? "page" : undefined}
                className={`shrink-0 px-4 py-3 rounded-full text-sm transition-colors leading-none ${
                  (currentCls ?? "") === item.value ? typePillActive : typePillInactive
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
      <nav aria-label="선박 필터" className="hidden lg:block">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          선박 유형
        </p>
        <div className="space-y-0.5">
          {classItems.map((item) => (
            <Link
              key={`d-cls-${item.value}`}
              href={buildHref({ cls: item.value })}
              aria-current={(currentCls ?? "") === item.value ? "page" : undefined}
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                (currentCls ?? "") === item.value ? activeClass : inactiveClass
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
