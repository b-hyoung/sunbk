export const runtime = "edge";
import { getVessels } from "@/lib/data";
import VesselFilter from "@/app/test3/_components/VesselFilter";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Users, Calendar, ChevronRight } from "lucide-react";
import type { Vessel } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선박 목록",
  description: "임대 및 판매 가능한 선박 목록을 확인하세요.",
};

interface SearchParams {
  type?: string;
  vessel_type?: string;
}

const typeLabel: Record<string, string> = { rent: "임대", sale: "판매", both: "임대·판매" };
const typeBadge: Record<string, string> = {
  rent: "bg-ocean text-white",
  sale: "bg-navy-dark text-white",
  both: "bg-ocean/80 text-white",
};

function VesselRow({ vessel }: { vessel: Vessel }) {
  const img = vessel.vessel_images?.find((i) => i.is_primary) ?? vessel.vessel_images?.[0];

  return (
    <Link
      href={`/test3/vessels/${vessel.slug}`}
      className="group flex flex-col sm:grid sm:grid-cols-[auto_1fr_auto] gap-4 sm:gap-6 items-start sm:items-center px-5 sm:px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* 이미지 — 모바일: 풀위드, 데스크탑: 고정폭 */}
      <div className="relative w-full sm:w-32 h-44 sm:h-24 shrink-0 overflow-hidden bg-gray-100">
        {img ? (
          <Image
            src={img.url}
            alt={vessel.title}
            fill
            sizes="(max-width: 640px) 100vw, 128px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl opacity-20">🚢</div>
        )}
        {/* 모바일에서 배지 이미지 위에 */}
        <span className={`absolute top-0 left-0 text-[10px] font-bold px-2 py-1 sm:hidden ${typeBadge[vessel.type]}`}>
          {typeLabel[vessel.type]}
        </span>
      </div>

      {/* 정보 */}
      <div className="min-w-0 w-full">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`hidden sm:inline text-[10px] font-bold px-2 py-0.5 ${typeBadge[vessel.type]}`}>
            {typeLabel[vessel.type]}
          </span>
          <span className="text-xs text-ocean font-semibold">{vessel.vessel_type}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-base mb-2 truncate group-hover:text-ocean transition-colors">
          {vessel.title}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          {vessel.length_m && (
            <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{vessel.length_m}m</span>
          )}
          {vessel.capacity && (
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vessel.capacity}명</span>
          )}
          {vessel.year_built && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{vessel.year_built}년</span>
          )}
          {vessel.location && (
            <span className="flex items-center gap-1 max-w-[180px] truncate"><MapPin className="w-3 h-3 shrink-0" />{vessel.location}</span>
          )}
        </div>

        {/* 가격 — 모바일에서는 정보 아래 */}
        <div className="flex items-center gap-4 mt-3 sm:hidden">
          {vessel.rent_price_per_day && (
            <span className="text-sm font-bold text-ocean">
              {vessel.rent_price_per_day.toLocaleString()}
              <span className="text-xs font-normal text-gray-400">원/일</span>
            </span>
          )}
          {vessel.sale_price && (
            <span className="text-sm font-bold text-gray-900">
              {vessel.sale_price >= 100000000
                ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
              <span className="text-xs font-normal text-gray-400">원</span>
            </span>
          )}
        </div>
      </div>

      {/* 가격 + 화살표 — 데스크탑만 */}
      <div className="hidden sm:flex shrink-0 text-right items-center gap-4">
        <div>
          {vessel.rent_price_per_day && (
            <div className="text-base font-bold text-ocean">
              {vessel.rent_price_per_day.toLocaleString()}
              <span className="text-xs font-normal text-gray-400">원/일</span>
            </div>
          )}
          {vessel.sale_price && (
            <div className="text-base font-bold text-gray-900">
              {vessel.sale_price >= 100000000
                ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
              <span className="text-xs font-normal text-gray-400">원</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-ocean transition-colors" />
      </div>
    </Link>
  );
}

export default async function Test3VesselsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const vessels = await getVessels(params);

  const pageTitleMap: Record<string, string> = { rent: "임대 선박", sale: "판매 선박" };
  const pageTitle = params.type ? (pageTitleMap[params.type] ?? "선박 목록") : "전체 선박";

  return (
    <div className="bg-white min-h-screen">
      {/* 다크 헤더 */}
      <div className="bg-navy-dark py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link href="/test3" className="hover:text-white/70 transition-colors">메인</Link>
            <span>〉</span>
            <span className="text-white/70">선박 목록</span>
          </nav>
          <div className="border-l-4 border-ocean pl-5">
            <p className="text-ocean text-[10px] font-bold tracking-widest uppercase mb-1">VESSELS</p>
            <h1 className="text-white text-2xl font-bold">{pageTitle}</h1>
            <p className="text-white/40 text-sm mt-1">총 {vessels.length}척</p>
          </div>
        </div>
      </div>

      {/* 수평 탭 필터 */}
      <VesselFilter basePath="test3" currentType={params.type} currentVesselType={params.vessel_type} />

      {/* 리스트 테이블 */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="border border-gray-200 overflow-hidden">
          {/* 컬럼 헤더 */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-6 px-6 py-3 bg-navy-dark">
            <span className="w-36 text-[10px] font-semibold text-white/50 uppercase tracking-wider">이미지</span>
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">선박 정보</span>
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider text-right pr-8">가격</span>
          </div>

          {vessels.length > 0 ? (
            vessels.map((vessel) => <VesselRow key={vessel.id} vessel={vessel} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-300">
              <p className="text-base text-gray-400">해당 조건의 선박이 없습니다.</p>
              <Link href="/test3/vessels" className="mt-4 text-sm text-ocean hover:underline">
                전체 선박 보기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
