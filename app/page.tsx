export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight, ChevronRight, Ship } from "lucide-react";
import { COMPANY } from "@/constants/company";
import { USE_CASES, getVesselCategory } from "@/lib/vessel-types";
import { getVesselsByUseCase } from "@/lib/data";
import HeroVideo from "@/components/layout/HeroVideo";
import type { UseCase, Vessel } from "@/lib/supabase";

const useCaseOrder: UseCase[] = ["survey", "construction", "cargo"];

function MiniVesselCard({ vessel }: { vessel: Vessel }) {
  const img = vessel.vessel_images?.find((i) => i.is_primary) ?? vessel.vessel_images?.[0];
  const category = getVesselCategory(vessel);
  return (
    <Link
      href={`/vessels/${vessel.slug}`}
      className="group flex items-center gap-3 p-2.5 bg-white border border-gray-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 rounded-lg transition-all"
    >
      <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-50 shrink-0">
        {img ? (
          <Image
            src={img.url}
            alt={vessel.title}
            fill
            sizes="56px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Ship className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-0.5">
          {category}
        </div>
        <div className="font-semibold text-gray-900 text-sm leading-tight truncate">
          {vessel.title}
        </div>
        <div className="flex gap-1.5 text-xs text-gray-500 mt-0.5">
          {vessel.tonnage && <span>{vessel.tonnage}t</span>}
          {vessel.tonnage && vessel.capacity && <span className="text-gray-300">·</span>}
          {vessel.capacity && <span>{vessel.capacity}인</span>}
          {!vessel.tonnage && !vessel.capacity && vessel.length_m && (
            <span>{vessel.length_m}m</span>
          )}
        </div>
      </div>
      <ChevronRight className="hidden sm:block w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

export default async function HomePage() {
  const sections = await Promise.all(
    useCaseOrder.map(async (uc) => ({
      uc,
      vessels: await getVesselsByUseCase(uc, 3),
    })),
  );

  return (
    <div className="bg-white">
      {/* ── 한 화면 안에 모든 것 ── */}
      <section
        className="relative bg-gradient-to-br from-white via-blue-50/20 to-blue-50/40"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        {/* 데코 블롭 */}
        <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 좌측 — 영상 Hero 카드 */}
            <div className="lg:col-span-4 relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-900 min-h-[280px] lg:min-h-[560px]">
              <HeroVideo />

              <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                <p data-hero className="text-blue-300 text-xs font-semibold tracking-widest uppercase mb-3">
                  수연선박 · 임대·판매 전문
                </p>
                <h1
                  data-hero
                  className="text-white font-bold leading-[1.05] tracking-tight text-3xl sm:text-4xl lg:text-[2.6rem] mb-4"
                >
                  어떤 일에<br />
                  선박이<br className="hidden lg:block" />
                  필요하신가요?
                </h1>
                <p data-hero className="text-white/75 text-sm leading-relaxed mb-6 max-w-md">
                  인천 연안부두 — 통선·예항·작업선 임대·판매.
                  <br />
                  지오스토리·현대스틸 등 다수 실적.
                </p>
                <div data-hero className="flex flex-col gap-2.5">
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-600/40"
                  >
                    <Phone className="w-4 h-4" />
                    {COMPANY.phone}
                  </a>
                  <Link
                    href="/vessels"
                    className="group inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
                  >
                    전체 둘러보기
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 우측 — 3개 카테고리 행 (한 화면 안에 다 노출) */}
            <div className="lg:col-span-8 space-y-5">
              {sections.map(({ uc, vessels }) => {
                const info = USE_CASES[uc];
                if (vessels.length === 0) return null;
                return (
                  <div key={uc} data-stagger>
                    {/* 카테고리 헤더 */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl">{info.icon}</span>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                          {info.label}
                        </h2>
                        <span className="hidden sm:inline text-xs text-gray-400 ml-1">
                          {info.description}
                        </span>
                      </div>
                      <Link
                        href={`/vessels?use=${uc}`}
                        className="group flex items-center gap-0.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors shrink-0"
                      >
                        전체보기
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* 미니 카드 행 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {vessels.slice(0, 3).map((v) => (
                        <MiniVesselCard key={v.id} vessel={v} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
