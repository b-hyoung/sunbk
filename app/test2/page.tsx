import Link from "next/link";
import { Phone, Ship, ArrowRight, ChevronRight } from "lucide-react";
import { getFeaturedVessels } from "@/lib/data";
import Test2VesselCard from "@/components/test2/VesselCard";

const stats = [
  { value: "50+", label: "보유 선박" },
  { value: "200+", label: "누적 거래" },
  { value: "98%", label: "고객 만족도" },
  { value: "15년", label: "영업 경력" },
];

const categories = [
  { icon: "⛵", label: "레저선", href: "/test2/vessels?vessel_type=레저선" },
  { icon: "🎣", label: "어선", href: "/test2/vessels?vessel_type=어선" },
  { icon: "🚢", label: "화물선", href: "/test2/vessels?vessel_type=화물선" },
  { icon: "🛳️", label: "여객선", href: "/test2/vessels?vessel_type=여객선" },
];

export default async function Test2HomePage() {
  const featuredVessels = await getFeaturedVessels();

  return (
    <div>
      {/* ── 히어로 ── */}
      <section className="relative bg-[#001e42] overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          poster="/hero-bg.jpg"
        >
          <source src="https://videos.pexels.com/video-files/4438522/4438522-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e42]/90 via-[#001e42]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-2xl">
            <p data-hero className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mb-6">
              선박 임대·판매 전문기업
            </p>
            <h1 data-hero className="text-white font-bold leading-tight mb-6 text-4xl md:text-5xl">
              최적의 선박을<br />합리적인 가격으로
            </h1>
            <p data-hero className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl">
              15년간 축적된 선박 전문 네트워크로 레저선부터 화물선까지, 고객님의 목적에 맞는 최고의 선박을 연결해드립니다.
            </p>
            <div data-hero className="flex flex-wrap gap-3">
              <Link
                href="/test2/vessels?type=rent"
                className="inline-flex items-center gap-2 bg-[#09388a] hover:bg-[#072d6e] text-white px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                선박 임대
              </Link>
              <Link
                href="/test2/vessels?type=sale"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                선박 판매
              </Link>
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors ml-2"
              >
                <Phone className="w-4 h-4" />
                무료 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 통계 ── */}
      <section className="bg-[#09388a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
            {stats.map((s) => (
              <div key={s.label} data-fade-up className="text-center px-6 py-8">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-white/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 선박 카테고리 ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div data-fade-up className="mb-12">
            <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-2">선박 종류</p>
            <h2 className="text-[#001e42] text-2xl font-bold">보유 선박 카테고리</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                data-stagger
                className="group border border-[#E6E7E9] hover:border-[#09388a] p-8 transition-all hover:shadow-md text-center"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-[#001e42] font-bold text-base group-hover:text-[#09388a] transition-colors">
                  {cat.label}
                </h3>
                <div className="mt-3 flex items-center justify-center gap-1 text-[#09388a] text-xs font-semibold md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  보기 <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 추천 선박 ── */}
      <section className="bg-[#F3F3F3] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div data-fade-up className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-2">Featured</p>
              <h2 className="text-[#001e42] text-2xl font-bold">추천 선박</h2>
            </div>
            <Link
              href="/test2/vessels"
              className="flex items-center gap-1 text-sm text-[#09388a] hover:text-[#072d6e] font-semibold transition-colors"
            >
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredVessels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVessels.map((vessel) => (
                <div key={vessel.id} data-stagger>
                  <Test2VesselCard vessel={vessel} />
                </div>
              ))}
            </div>
          ) : (
            <div data-fade-in className="text-center py-20 text-[#001e42]/30">
              <Ship className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>선박 정보를 불러오는 중입니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div data-scale-in className="border border-[#E6E7E9] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-3">Contact</p>
              <h2 className="text-[#001e42] text-2xl font-bold mb-2">원하는 선박이 없으신가요?</h2>
              <p className="text-[#001e42]/50 text-sm">전문 상담사가 맞춤 선박을 찾아드립니다.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center justify-center gap-2 bg-[#09388a] hover:bg-[#072d6e] text-white px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                010-0000-0000
              </a>
              <Link
                href="/test2/contact"
                className="inline-flex items-center justify-center gap-2 border border-[#E6E7E9] hover:border-[#09388a] hover:text-[#09388a] text-[#001e42]/70 px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                오시는길
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
