import type { Metadata } from "next";
import HeroVideo from "@/components/layout/BackgroundVideo";
import ServiceCards from "./_components/ServiceCards";
import RepairGallery from "./_components/RepairGallery";

export const metadata: Metadata = {
  title: "자매회사 · 제일산업공사 (조선소)",
  description: "수연선박 자매회사 제일산업공사. 1985년 창업, 인천 연안부두에서 41년. 소형 어선·작업선의 신조 건조와 목선·철선 수리를 전문으로 합니다.",
};

export default function ShipyardPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gray-900 py-28 min-h-[360px] overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            제일산업공사 (조선소)
          </div>
          <h1 className="text-white font-bold mb-5 leading-tight">
            1985년부터, 인천 연안부두에서
          </h1>
          <p className="text-white/75 text-lg leading-relaxed">
            목선과 철선, 소형 선박의 신조·수리를 41년간 이어오고 있습니다.<br />
            인천 지역 유일의 소형 선박 건조·수리 업체.
          </p>
        </div>
      </section>
      <ServiceCards />
      <RepairGallery />
    </div>
  );
}
