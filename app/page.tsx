export const dynamic = "force-dynamic";
import Link from "next/link";
import { Phone, Ship, ArrowRight } from "lucide-react";
import { getVesselsByUseCase } from "@/lib/data";
import { getAllVesselsFromStore } from "@/lib/admin-store";
import HeroVideo from "@/components/layout/HeroVideo";
import UseCaseTabs from "@/app/_components/UseCaseTabs";
import { USE_CASE_ORDER } from "@/lib/vessel-types";

export default async function HomePage() {
  const allVessels = getAllVesselsFromStore();
  const groups = await Promise.all(
    USE_CASE_ORDER.map(async (useCase) => {
      const vessels = await getVesselsByUseCase(useCase, 4);
      return {
        useCase,
        vessels,
        total: allVessels.filter(
          (v) =>
            (v.status === "active" || v.status === "rented") &&
            v.use_cases?.includes(useCase),
        ).length,
      };
    }),
  );

  return (
    <div className="bg-white -mt-28">
      {/* ── 히어로 ── */}
      <section className="relative min-h-[420px] h-[60vh] max-h-[600px] flex items-center overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <p data-hero className="text-blue-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              선박 임대·판매 전문
            </p>
            <h1 data-hero className="text-white font-bold mb-4 leading-tight text-3xl sm:text-4xl lg:text-5xl">
              최적의 선박을<br />합리적인 가격으로
            </h1>
            <p data-hero className="text-white/70 text-sm sm:text-base leading-relaxed mb-7 max-w-lg">
              선박 전문가가 어선·화물선 등
              고객님의 목적에 맞는 최적의 선박을 제안해드립니다.
            </p>
            <div data-hero className="flex flex-wrap gap-2.5">
              <Link
                href="/vessels"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <Ship className="w-4 h-4" />
                선박 둘러보기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                전화 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 용도별 추천 선박 ── */}
      <UseCaseTabs groups={groups} />
    </div>
  );
}
