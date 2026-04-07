import { getVessels } from "@/lib/data";
import VesselCard from "@/app/test1/_components/VesselCard";
import VesselFilter from "@/app/test1/_components/VesselFilter";
import { Ship } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선박 목록",
  description: "임대 및 판매 가능한 선박 목록을 확인하세요. 레저선, 어선, 화물선, 여객선 등 다양한 선박을 보유하고 있습니다.",
};

interface SearchParams {
  type?: string;
  vessel_type?: string;
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
  const pageTitle = params.type ? (typeLabel[params.type] ?? "선박 목록") : "전체 선박";

  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 data-fade-up className="text-gray-900 mb-1">{pageTitle}</h1>
          <p data-fade-up className="text-gray-400 text-sm">총 {vessels.length}척</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 사이드바 필터 */}
          <aside data-fade-in className="w-full lg:w-48 shrink-0">
            <VesselFilter basePath="" currentType={params.type} currentVesselType={params.vessel_type} />
          </aside>

          {/* 선박 목록 */}
          <div className="flex-1">
            {vessels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vessels.map((vessel) => (
                  <div key={vessel.id} data-stagger>
                    <VesselCard vessel={vessel} basePath="" />
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
