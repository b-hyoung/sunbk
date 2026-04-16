import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { COMPANY } from "@/constants/company";
import HeroVideo from "@/components/layout/BackgroundVideo";
import ServiceCards from "./_components/ServiceCards";
import RepairGallery from "./_components/RepairGallery";

export const metadata: Metadata = {
  title: "선박 건조·수리",
  description: "1985년 창업, 인천 연안부두에서 41년. 제일산업공사 — 소형 어선·작업선의 신조 건조와 목선·철선 수리를 전문으로 합니다.",
};

export default function ShipyardPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative bg-gray-900 py-28 min-h-[360px] overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest mb-4">
            선박 건조·수리 · 제일산업공사
          </p>
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

      {/* ── 상담 CTA (다크) ── */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-gray-400 text-base italic mb-8">
            "정직함을 철학으로 삼아, 이 일을 해왔습니다"
          </p>
          <h2 className="text-white mb-3">상담 문의</h2>
          <p className="text-sm text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            선박 상태, 작업 범위, 일정은 전화 상담이 가장 빠릅니다.
          </p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            {COMPANY.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
