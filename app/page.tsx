export const dynamic = "force-dynamic";
import { getVesselsByClass } from "@/lib/data";
import { getAllVesselsFromStore } from "@/lib/admin-store";
import HeroVideo from "@/components/layout/HeroVideo";
import VesselClassSections from "@/app/_components/VesselClassSections";
import {
  VESSEL_CLASS_ORDER,
  matchesVesselClass,
} from "@/lib/vessel-types";

export default async function HomePage() {
  const allVessels = getAllVesselsFromStore();
  const groups = await Promise.all(
    VESSEL_CLASS_ORDER.map(async (cls) => {
      const vessels = await getVesselsByClass(cls, 4);
      return {
        cls,
        vessels,
        total: allVessels.filter(
          (v) =>
            (v.status === "active" || v.status === "rented") &&
            matchesVesselClass(v, cls),
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
            <p data-hero className="text-white/55 text-xs sm:text-sm font-medium mb-2.5">
              선박 임대·판매 전문
            </p>
            <h1 data-hero className="text-white font-semibold mb-8 leading-[1.15] tracking-tight text-3xl sm:text-4xl lg:text-5xl">
              최적의 선박을<br />합리적인 가격으로
            </h1>
            <p data-hero className="text-white/80 text-sm sm:text-base leading-relaxed mb-4 max-w-lg lg:max-w-2xl">
              선박 임대, 판매 전문업체인 수연선박에서{" "}
              <span className="font-semibold text-white">예인선, 통선, 해양조사선</span>,{" "}
              <span className="font-semibold text-white">내수면에서의 공사</span> 등<br />
              목적에 맞는 최적의 선박을 안내해 드립니다.
            </p>
            <p data-hero className="text-white/75 text-sm sm:text-base leading-relaxed max-w-lg lg:max-w-2xl">
              자매회사 <span className="font-semibold text-white">제일산업공사(조선소)</span>로 선박은 항상 최상급으로 유지됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 선박 유형별 섹션 ── */}
      <VesselClassSections groups={groups} />
    </div>
  );
}
