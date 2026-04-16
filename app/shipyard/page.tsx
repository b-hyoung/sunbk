import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Anchor } from "lucide-react";
import { COMPANY } from "@/constants/company";
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
      <section className="border-b border-gray-100 bg-gray-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Anchor className="w-4 h-4" />
            <span>선박 건조·수리 <span className="text-gray-300">·</span> 제일산업공사</span>
          </div>
          <h1 className="text-gray-900 mb-4">1985년부터, 인천 연안부두에서</h1>
          <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
            목선과 철선, 소형 어선과 작업선의 신조·수리를 41년간 이어오고 있습니다.
            인천 지역 유일의 소형 선박 건조·수리 업체로, 정직한 작업으로 선주와 함께합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 px-5 py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              오시는길
            </Link>
          </div>
        </div>
      </section>
      <ServiceCards />
      <RepairGallery />

      {/* ── 상담 CTA ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="text-gray-900 mb-3">상담 문의</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
          선박 상태, 작업 범위, 일정은 전화로 상담하시는 것이 가장 빠릅니다.
          현장 방문 실사도 가능합니다.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            {COMPANY.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            오시는길 보기
          </Link>
        </div>
      </section>
    </div>
  );
}
