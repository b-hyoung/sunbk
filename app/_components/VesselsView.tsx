import { Ship } from "lucide-react";
import type { Vessel } from "@/lib/supabase";
import { VESSEL_CLASS_INFO, type VesselClass } from "@/lib/vessel-types";
import VesselCard from "./VesselCard";
import VesselFilter from "./VesselFilter";
import TradeTypeBar from "./TradeTypeBar";

const typeLabel: Record<string, string> = {
  rent: "임대 선박",
  sale: "판매 선박",
};

function isVesselClass(v: string | undefined): v is VesselClass {
  return v === "tug" || v === "passenger" || v === "survey";
}

interface Props {
  /** 이미 필터링된, 화면에 그릴 선박 목록 */
  vessels: Vessel[];
  type?: string;
  cls?: string;
}

/**
 * 선박 목록 화면(헤더 + 필터 + 카드 그리드)의 표현 전담 컴포넌트.
 * 훅을 쓰지 않으므로 서버에서 정적 HTML로 프리렌더된다 (Suspense fallback으로도 사용).
 */
export default function VesselsView({ vessels, type, cls }: Props) {
  let pageTitle = "전체 선박";
  let pageSubtitle: string | null = null;
  if (isVesselClass(cls)) {
    const info = VESSEL_CLASS_INFO[cls];
    pageTitle = `${info.icon} ${info.label}`;
    pageSubtitle = info.description;
  } else if (type && typeLabel[type]) {
    pageTitle = typeLabel[type];
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1 data-fade-up className="text-gray-900 mb-1">{pageTitle}</h1>
              {pageSubtitle ? (
                <p
                  data-fade-up
                  className="text-gray-500 text-sm max-w-2xl leading-relaxed"
                >
                  {pageSubtitle}
                </p>
              ) : (
                <p data-fade-up className="text-gray-400 text-sm">
                  총 {vessels.length}척
                </p>
              )}
              {pageSubtitle && (
                <p data-fade-up className="text-gray-400 text-xs mt-2">
                  총 {vessels.length}척
                </p>
              )}
            </div>
            <div data-fade-in className="shrink-0">
              <TradeTypeBar currentType={type} currentCls={cls} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <aside data-fade-in className="w-full lg:w-48 shrink-0">
            <VesselFilter currentType={type} currentCls={cls} />
          </aside>

          <div className="flex-1">
            {vessels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {vessels.map((vessel) => (
                  <div key={vessel.id} data-stagger>
                    <VesselCard vessel={vessel} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                data-fade-in
                className="flex flex-col items-center justify-center py-32 text-gray-300"
              >
                <Ship className="w-12 h-12 mb-4" />
                <p className="text-base text-gray-400">
                  해당 조건의 선박이 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
