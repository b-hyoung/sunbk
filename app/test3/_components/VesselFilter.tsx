"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface VesselFilterProps {
  basePath: string;
  currentType?: string;
  currentVesselType?: string;
}

const VESSEL_TYPES = ["레저선", "어선", "화물선", "여객선"];

export default function VesselFilter({ basePath, currentType, currentVesselType }: VesselFilterProps) {
  const pathname = usePathname();
  const base = `/${basePath}/vessels`;

  const typeHref = (type?: string) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (currentVesselType) params.set("vessel_type", currentVesselType);
    return `${base}${params.toString() ? `?${params}` : ""}`;
  };

  const vesselTypeHref = (vt?: string) => {
    const params = new URLSearchParams();
    if (currentType) params.set("type", currentType);
    if (vt) params.set("vessel_type", vt);
    return `${base}${params.toString() ? `?${params}` : ""}`;
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* 거래 유형 탭 */}
        <nav aria-label="거래 유형 필터" className="flex gap-0 overflow-x-auto scrollbar-hide">
          {[
            { label: "전체", type: undefined },
            { label: "임대", type: "rent" },
            { label: "판매", type: "sale" },
          ].map(({ label, type }) => {
            const active = (type === undefined && !currentType) || type === currentType;
            return (
              <Link
                key={label}
                href={typeHref(type)}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? "text-[#036EB8] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#036EB8]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {/* 구분선 */}
          <div className="w-px bg-gray-200 my-3 mx-2 shrink-0" />

          {/* 선박 종류 탭 */}
          <Link
            href={vesselTypeHref(undefined)}
            aria-current={!currentVesselType ? "page" : undefined}
            className={`relative shrink-0 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
              !currentVesselType
                ? "text-[#036EB8] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#036EB8]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            종류 전체
          </Link>
          {VESSEL_TYPES.map((vt) => {
            const active = currentVesselType === vt;
            return (
              <Link
                key={vt}
                href={vesselTypeHref(vt)}
                aria-current={active ? "page" : undefined}
                className={`relative shrink-0 px-5 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? "text-[#036EB8] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#036EB8]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {vt}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
