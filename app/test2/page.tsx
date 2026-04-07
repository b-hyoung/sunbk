import Link from "next/link";
import { Phone, Ship, ArrowRight, CheckCircle, ChevronRight } from "lucide-react";
import { supabase, Vessel } from "@/lib/supabase";
import Test2VesselCard from "@/components/test2/VesselCard";

async function getFeaturedVessels(): Promise<Vessel[]> {
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("is_featured", true)
    .eq("status", "active")
    .limit(6);
  return data ?? [];
}

const stats = [
  { value: "50+", label: "보유 선박" },
  { value: "200+", label: "누적 거래" },
  { value: "98%", label: "고객 만족도" },
  { value: "15년", label: "영업 경력" },
];

const categories = [
  { icon: "⛵", label: "레저선", desc: "요트·보트·레저용 선박", href: "/test2/vessels?vessel_type=레저선" },
  { icon: "🎣", label: "어선", desc: "연근해·원양 어선", href: "/test2/vessels?vessel_type=어선" },
  { icon: "🚢", label: "화물선", desc: "컨테이너·화물 운반선", href: "/test2/vessels?vessel_type=화물선" },
  { icon: "🛳️", label: "여객선", desc: "여객·관광용 선박", href: "/test2/vessels?vessel_type=여객선" },
];

const advantages = [
  "국내 최다 선박 보유 네트워크",
  "선종별 전문 상담사 배치",
  "법적 서류 및 검사 원스톱 지원",
  "계약 후 A/S 및 사후 관리",
  "24시간 긴급 연락 가능",
  "국내외 항구 직접 연결",
];

export default async function Test2HomePage() {
  const featuredVessels = await getFeaturedVessels();

  return (
    <div>
      {/* ── 히어로 ── */}
      <section className="relative bg-[#001e42] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=1920&q=80&auto=format&fit=crop)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e42]/90 via-[#001e42]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-2xl">
            <p data-hero className="text-[#09388a] text-xs font-bold tracking-[0.2em] uppercase mb-6 brightness-[1.8]">
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
                href="/test2/vessels"
                className="inline-flex items-center gap-2 bg-[#09388a] hover:bg-[#072d6e] text-white px-8 py-3.5 text-sm font-semibold transition-colors"
              >
                <Ship className="w-4 h-4" />
                선박 매물 보기
              </Link>
              <a
                href="tel:010-0000-0000"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white px-8 py-3.5 text-sm font-semibold transition-colors"
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
                className="group border border-[#E6E7E9] hover:border-[#09388a] p-8 rounded-lg transition-all hover:shadow-md text-center"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-[#001e42] font-bold text-base mb-1 group-hover:text-[#09388a] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[#001e42]/50 text-xs">{cat.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-[#09388a] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* ── 왜 수연선박? ── */}
      <section className="bg-[#001e42] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div data-fade-up>
              <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-3 brightness-[1.8]">Why Us</p>
              <h2 className="text-white text-2xl font-bold mb-5">수연선박을 선택해야 하는 이유</h2>
              <p className="text-white/50 leading-relaxed text-sm">
                15년간 국내 선박 시장에서 축적한 경험과 네트워크로 고객이 원하는 최적의 선박을 연결해드립니다.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advantages.map((adv, i) => (
                <div key={i} data-stagger className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#09388a] shrink-0 mt-0.5 brightness-[1.8]" />
                  <span className="text-white/70 text-sm">{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div data-scale-in className="border border-[#E6E7E9] rounded-lg p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#09388a] text-xs font-bold tracking-[0.15em] uppercase mb-3">문의하기</p>
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
                온라인 문의
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
