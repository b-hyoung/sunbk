"use client";

import Link from "next/link";

const vesselTypes = ["레저선", "어선", "화물선", "여객선", "예인선", "기타"];

interface VesselFilterProps {
  basePath: string;
  currentType?: string;
  currentVesselType?: string;
}

export default function VesselFilter({ basePath, currentType, currentVesselType }: VesselFilterProps) {
  const base = `/${basePath}/vessels`;
  const activeClass = "bg-blue-600 text-white font-medium";
  const inactiveClass = "text-gray-500 hover:text-gray-900 hover:bg-gray-50";
  const typePillActive = "bg-blue-600 text-white font-medium";
  const typePillInactive = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const typeItems = [
    { label: "전체", value: "" },
    { label: "임대", value: "rent" },
    { label: "판매", value: "sale" },
  ];

  const vesselTypeItems = [{ label: "전체", value: "" }, ...vesselTypes.map((t) => ({ label: t, value: t }))];

  const getVesselTypeHref = (value: string) =>
    value
      ? currentType
        ? `${base}?type=${currentType}&vessel_type=${value}`
        : `${base}?vessel_type=${value}`
      : currentType
        ? `${base}?type=${currentType}`
        : base;

  return (
    <>
      {/* ── 모바일: 가로 스크롤 pill ── */}
      <nav aria-label="선박 필터" className="lg:hidden space-y-2">
        {/* 거래 유형 */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {typeItems.map((item) => (
              <Link
                key={item.value}
                href={item.value ? `${base}?type=${item.value}` : base}
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
                key={item.value}
                href={getVesselTypeHref(item.value)}
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
        {/* 거래 유형 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">거래 유형</p>
          <div className="space-y-0.5">
            {typeItems.map((item) => (
              <Link
                key={item.value}
                href={item.value ? `${base}?type=${item.value}` : base}
                aria-current={(currentType ?? "") === item.value ? "page" : undefined}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
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
                key={item.value}
                href={getVesselTypeHref(item.value)}
                aria-current={(currentVesselType ?? "") === item.value ? "page" : undefined}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
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
