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

  return (
    <div className="space-y-8">
      {/* 거래 유형 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">거래 유형</p>
        <div className="space-y-0.5">
          {[
            { label: "전체", value: "" },
            { label: "임대", value: "rent" },
            { label: "판매", value: "sale" },
          ].map((item) => (
            <Link
              key={item.value}
              href={item.value ? `${base}?type=${item.value}` : base}
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
          <Link
            href={currentType ? `${base}?type=${currentType}` : base}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentVesselType ? activeClass : inactiveClass
            }`}
          >
            전체
          </Link>
          {vesselTypes.map((type) => {
            const href = currentType
              ? `${base}?type=${currentType}&vessel_type=${type}`
              : `${base}?vessel_type=${type}`;
            return (
              <Link
                key={type}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentVesselType === type ? activeClass : inactiveClass
                }`}
              >
                {type}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
