export const dynamic = "force-dynamic";
import { getVessels } from "@/lib/data";
import VesselCard from "@/app/_components/VesselCard";
import VesselFilter from "@/app/_components/VesselFilter";
import { Ship } from "lucide-react";
import type { Metadata } from "next";
import { USE_CASES } from "@/lib/vessel-types";
import type { UseCase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "선박 목록",
  description: "임대 및 판매 가능한 선박 목록. 통선·예항선·작업선·도선·화물선.",
};

interface SearchParams {
  type?: string;
  vessel_type?: string;
  use?: string;
}

function isUseCase(v: string | undefined): v is UseCase {
  return v === "survey" || v === "construction" || v === "cargo";
}

export default async function VesselsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const vessels = await getVessels(params);

  const typeLabel: Record<string, string> = {
    rent: "임대 선박",
    sale: "판매 선박",
  };

  let pageTitle = "전체 선박";
  let pageSubtitle: string | null = null;

  if (isUseCase(params.use)) {
    const info = USE_CASES[params.use];
    pageTitle = `${info.icon} ${info.label}`;
    pageSubtitle = info.description;
  } else if (params.type && typeLabel[params.type]) {
    pageTitle = typeLabel[params.type];
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 data-fade-up className="text-gray-900 mb-1">{pageTitle}</h1>
          {pageSubtitle ? (
            <p data-fade-up className="text-gray-500 text-sm max-w-2xl leading-relaxed">
              {pageSubtitle}
            </p>
          ) : (
            <p data-fade-up className="text-gray-400 text-sm">총 {vessels.length}척</p>
          )}
          {pageSubtitle && (
            <p data-fade-up className="text-gray-400 text-xs mt-2">총 {vessels.length}척</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          <aside data-fade-in className="w-full lg:w-48 shrink-0">
            <VesselFilter
              currentType={params.type}
              currentVesselType={params.vessel_type}
              currentUse={params.use}
            />
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
              <div data-fade-in className="flex flex-col items-center justify-center py-32 text-gray-300">
                <Ship className="w-12 h-12 mb-4" />
                <p className="text-base text-gray-400">해당 조건의 선박이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
