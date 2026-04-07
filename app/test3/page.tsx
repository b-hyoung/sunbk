import Link from "next/link";
import { Phone, ArrowRight, MapPin, Ruler, Users } from "lucide-react";
import { getFeaturedVessels } from "@/lib/data";
import HeroVideo from "@/components/layout/HeroVideo";
import Image from "next/image";
import type { Vessel } from "@/lib/supabase";

const categories = [
  { label: "전체", href: "/test3/vessels", key: "all" },
  { label: "레저선", href: "/test3/vessels?vessel_type=레저선", key: "레저선" },
  { label: "어선", href: "/test3/vessels?vessel_type=어선", key: "어선" },
  { label: "화물선", href: "/test3/vessels?vessel_type=화물선", key: "화물선" },
  { label: "여객선", href: "/test3/vessels?vessel_type=여객선", key: "여객선" },
];

const typeLabel: Record<string, string> = { rent: "임대", sale: "판매", both: "임대·판매" };

function FeaturedRow({ vessel }: { vessel: Vessel }) {
  const img = vessel.vessel_images?.find((i) => i.is_primary) ?? vessel.vessel_images?.[0];
  return (
    <Link
      href={`/test3/vessels/${vessel.slug}`}
      className="group flex gap-4 border-b border-gray-100 py-5 hover:bg-gray-50 px-5 sm:px-6 transition-colors"
    >
      {/* 이미지 */}
      <div className="relative w-24 h-18 sm:w-32 sm:h-24 shrink-0 overflow-hidden bg-gray-100" style={{ height: "72px" }}>
        {img ? (
          <Image src={img.url} alt={vessel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 96px, 128px" />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl opacity-20">🚢</div>
        )}
      </div>

      {/* 정보 + 가격 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold text-[#036EB8] uppercase tracking-wider">{vessel.vessel_type}</span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[10px] text-gray-400">{typeLabel[vessel.type]}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1.5 truncate group-hover:text-[#036EB8] transition-colors">
              {vessel.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {vessel.length_m && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{vessel.length_m}m</span>}
              {vessel.capacity && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vessel.capacity}명</span>}
            </div>
          </div>
          {/* 가격 우측 정렬 */}
          <div className="shrink-0 text-right">
            {vessel.rent_price_per_day && (
              <div className="text-sm font-bold text-[#036EB8] whitespace-nowrap">
                {(vessel.rent_price_per_day / 10000).toFixed(0)}만
                <span className="text-xs font-normal text-gray-400">원/일</span>
              </div>
            )}
            {vessel.sale_price && (
              <div className="text-sm font-bold text-gray-800 whitespace-nowrap">
                {vessel.sale_price >= 100000000
                  ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                  : `${Math.floor(vessel.sale_price / 10000)}만`}
                <span className="text-xs font-normal text-gray-400">원</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function Test3HomePage() {
  const featuredVessels = await getFeaturedVessels();

  return (
    <div className="bg-white -mt-28">
      {/* ── 풀스크린 히어로 (중앙 정렬) ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-[#0a1628]/75" />

        {/* 중앙 콘텐츠 */}
        <div className="relative z-10 text-center px-6">
          <p className="text-[#036EB8] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            수연선박 · SOOYEON SHIPPING
          </p>
          <h1 className="text-white font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            선박 임대·판매<br />전문 기업
          </h1>
          <div className="w-12 h-0.5 bg-[#036EB8] mx-auto mb-6" />
          <p className="text-white/60 text-sm leading-relaxed mb-10">
            15년 경력 · 레저선 · 어선 · 화물선 · 여객선
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/test3/vessels" className="inline-flex items-center justify-center gap-2 bg-[#036EB8] hover:bg-[#0257a0] text-white px-8 py-3.5 text-sm font-semibold transition-colors">
              선박 목록 보기 <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:010-0000-0000" className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-3.5 text-sm font-semibold transition-colors">
              <Phone className="w-4 h-4" /> 전화 문의
            </a>
          </div>
        </div>

        {/* 하단 카테고리 탭바 */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#0a1628]/90 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className="shrink-0 px-6 py-4 text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10 last:border-r-0 whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 모바일 카테고리 탭 (lg 미만) ── */}
      <div className="lg:hidden border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex px-5 gap-0">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="shrink-0 px-4 py-3.5 text-sm font-semibold text-gray-500 hover:text-[#036EB8] transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-[#036EB8]"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── 메인 콘텐츠: 좌측 사이드바 + 우측 선박 리스트 ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="flex gap-10 lg:gap-16">

          {/* 좌측: 다크 사이드바 */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0">
            {/* 회사 소개 블록 */}
            <div className="bg-[#0a1628] p-6 mb-6">
              <p className="text-[#036EB8] text-[10px] font-bold tracking-widest uppercase mb-3">ABOUT</p>
              <h2 className="text-white text-sm font-bold leading-snug mb-4">
                인천 소재<br />선박 임대·판매<br />전문 기업
              </h2>
              <hr className="border-[#036EB8] mb-4" />
              <div className="space-y-3 text-xs text-white/50">
                <div><span className="block text-white/80 font-semibold">50+</span>보유 선박</div>
                <div><span className="block text-white/80 font-semibold">200+</span>누적 거래</div>
                <div><span className="block text-white/80 font-semibold">15년</span>영업 경력</div>
              </div>
            </div>

            {/* 카테고리 네비 */}
            <nav aria-label="선박 종류">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">선박 종류</p>
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="flex items-center justify-between px-3 py-2.5 text-sm text-gray-600 hover:text-[#036EB8] hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-[#036EB8]"
                >
                  {cat.label}
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>

            {/* 전화 문의 */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">문의</p>
              <a href="tel:010-0000-0000" className="flex items-center gap-2 text-sm font-bold text-[#036EB8] hover:text-[#0257a0] transition-colors">
                <Phone className="w-3.5 h-3.5" />
                010-0000-0000
              </a>
            </div>
          </aside>

          {/* 우측: 추천 선박 리스트 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#036EB8] text-[10px] font-bold tracking-widest uppercase mb-1">FEATURED VESSELS</p>
                <h2 className="text-xl font-bold text-gray-900">추천 선박</h2>
              </div>
              <Link href="/test3/vessels" className="text-xs font-semibold text-[#036EB8] hover:underline">
                전체 목록 →
              </Link>
            </div>

            <div className="border border-gray-200 overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-[1fr_auto] bg-[#0a1628] px-6 py-3">
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">선박 정보</span>
                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">가격</span>
              </div>

              {featuredVessels.length > 0 ? (
                featuredVessels.map((vessel) => <FeaturedRow key={vessel.id} vessel={vessel} />)
              ) : (
                <div className="py-20 text-center text-gray-400 text-sm">선박 정보를 불러오는 중입니다.</div>
              )}

              {/* 더보기 */}
              <div className="border-t border-gray-100">
                <Link href="/test3/vessels" className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[#036EB8] hover:bg-gray-50 transition-colors">
                  전체 선박 보기 <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA 풀위드 ── */}
      <section className="bg-[#036EB8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">원하는 선박을 찾지 못하셨나요?</h2>
            <p className="text-white/70 text-sm">전문 상담사가 조건에 맞는 최적의 선박을 찾아드립니다.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="tel:010-0000-0000" className="inline-flex items-center gap-2 bg-white text-[#036EB8] hover:bg-gray-100 px-6 py-3 text-sm font-bold transition-colors">
              <Phone className="w-4 h-4" /> 전화 문의
            </a>
            <Link href="/test3/vessels" className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white px-6 py-3 text-sm font-bold transition-colors">
              선박 목록
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
