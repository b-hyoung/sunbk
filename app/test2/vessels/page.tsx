export const runtime = "edge";
import { getVessels } from "@/lib/data";
import Test2VesselCard from "@/components/test2/VesselCard";
import VesselFilter from "@/app/test1/_components/VesselFilter";
import { Ship } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선박 목록",
  description: "임대 및 판매 가능한 선박 목록을 확인하세요.",
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
  const hasFilter = !!params.type || !!params.vessel_type;

  return (
    <div className="bg-white min-h-screen">
      {/* 페이지 헤더 */}
      <div className="border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-navy-light text-xs font-bold tracking-[0.15em] uppercase mb-2">Vessels</p>
          <h1 data-fade-up className="text-navy text-2xl font-bold mb-1">{pageTitle}</h1>
          <p data-fade-up className="text-navy/40 text-sm">총 {vessels.length}척</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* 필터 */}
          <aside data-fade-in className="w-full lg:w-48 shrink-0">
            <VesselFilter basePath="test2" currentType={params.type} currentVesselType={params.vessel_type} />
          </aside>

          {/* 선박 목록 */}
          <div className="flex-1">
            {vessels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vessels.map((vessel) => (
                  <div key={vessel.id} data-stagger>
                    <Test2VesselCard vessel={vessel} filterType={params.type} />
                  </div>
                ))}
              </div>
            ) : (
              <div data-fade-in className="flex flex-col items-center justify-center py-32 text-navy/30">
                <Ship className="w-12 h-12 mb-4" />
                <p className="text-base text-navy/40 mb-1">해당 조건의 선박이 없습니다.</p>
                {hasFilter && (
                  <Link
                    href="/test2/vessels"
                    className="mt-4 px-4 py-2 text-sm text-navy-light border border-navy-light/30 hover:bg-navy-light/5 transition-colors"
                  >
                    필터 초기화하고 전체 보기
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
