export const dynamic = "force-dynamic";
import Link from "next/link";
import { Phone, Ship, ArrowRight, ChevronRight } from "lucide-react";
import { getFeaturedVessels } from "@/lib/data";
import VesselCard from "@/app/test1/_components/VesselCard";
import HeroVideo from "@/components/layout/HeroVideo";

const stats = [
  { value: "10", suffix: "척", label: "운영 선박" },
  { value: "인천", suffix: "", label: "소재지" },
  { value: "365", suffix: "일", label: "연중 상담" },
];

const vesselCategories = [
  { label: "어선", icon: "🎣", href: "/test1/vessels?vessel_type=어선" },
  { label: "화물선", icon: "🚢", href: "/test1/vessels?vessel_type=화물선" },
];

export default async function HomePage() {
  const featuredVessels = await getFeaturedVessels();

  return (
    <div className="bg-white -mt-28">
      {/* ── 히어로 ── */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-2xl">
            <p data-hero className="text-blue-300 text-sm font-semibold tracking-widest uppercase mb-5">
              선박 임대·판매 전문
            </p>
            <h1 data-hero className="text-white font-bold mb-6 leading-tight">
              최적의 선박을<br />합리적인 가격으로
            </h1>
            <p data-hero className="text-white/70 text-lg leading-relaxed mb-10 max-w-lg">
              선박 전문가가 어선·화물선 등
              고객님의 목적에 맞는 최적의 선박을 제안해드립니다.
            </p>
            <div data-hero className="flex flex-wrap gap-3">
              <Link
                href="/test1/vessels"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                <Ship className="w-4 h-4" />
                선박 둘러보기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                전화 문의
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 ── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {stats.map((s) => (
              <div key={s.label} data-fade-up className="text-center px-6 py-2">
                <div
                  data-count={`${s.value}${s.suffix}`}
                  className="text-2xl font-bold text-gray-900"
                >
                  {s.value}{s.suffix}
                </div>
                <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 카테고리 ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 data-fade-up className="text-gray-900">선박 종류</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {vesselCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              data-stagger
              className="group flex flex-col items-center gap-3 py-8 px-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/40 transition-all text-center"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 추천 선박 ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 data-fade-up className="text-gray-900">추천 선박</h2>
            <Link
              href="/test1/vessels"
              data-fade-in
              className="group flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 font-medium transition-colors"
            >
              전체보기
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredVessels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredVessels.map((vessel) => (
                <div key={vessel.id} data-stagger>
                  <VesselCard vessel={vessel} basePath="test1" />
                </div>
              ))}
            </div>
          ) : (
            <div data-fade-in className="text-center py-20 text-gray-400">
              <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">선박 정보를 불러오는 중입니다.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
