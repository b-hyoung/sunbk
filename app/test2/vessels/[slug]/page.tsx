export const runtime = "edge";
import { getVesselBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import VesselGallery from "@/components/vessels/VesselGallery";
import { Phone, MapPin, Ruler, Users, Calendar, Anchor, ChevronRight, MessageCircle } from "lucide-react";
import { COMPANY } from "@/constants/company";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);
  if (!vessel) return {};
  return {
    title: vessel.title,
    description: vessel.description?.slice(0, 160) ?? `${vessel.title} - 선박 임대·판매`,
  };
}

const typeLabel: Record<string, string> = {
  rent: "임대",
  sale: "판매",
  both: "임대·판매",
};

export default async function VesselDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);
  if (!vessel) notFound();

  const images = vessel.vessel_images ?? [];

  const specs = [
    { icon: Anchor, label: "선박 종류", value: vessel.vessel_type },
    { icon: Calendar, label: "건조 연도", value: vessel.year_built ? `${vessel.year_built}년` : null },
    { icon: Ruler, label: "전장", value: vessel.length_m ? `${vessel.length_m}m` : null },
    { icon: Anchor, label: "톤수", value: vessel.tonnage ? `${vessel.tonnage}톤` : null },
    { icon: Anchor, label: "엔진 출력", value: vessel.engine_power },
    { icon: Users, label: "승선 정원", value: vessel.capacity ? `${vessel.capacity}명` : null },
    { icon: MapPin, label: "정박 위치", value: vessel.location },
  ].filter((s) => s.value);

  return (
    <div className="bg-white min-h-screen">
      {/* ── 타이틀 헤더 ── */}
      <section className="bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* 브레드크럼 */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs text-white/50 mb-4">
            <Link href="/test2" className="hover:text-white/70 transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/test2/vessels" className="hover:text-white/70 transition-colors">선박 목록</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">{vessel.title}</span>
          </nav>
          <span className="inline-block text-xs font-bold px-3 py-1 bg-navy-light text-white mb-3">
            {typeLabel[vessel.type]}
          </span>
          <h1 className="text-white font-bold text-3xl md:text-4xl leading-tight">{vessel.title}</h1>
          <p className="text-white/50 text-sm mt-2">{vessel.vessel_type}</p>
        </div>
      </section>

      {/* ── 갤러리 ── */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div data-fade-up>
          <VesselGallery images={images} vesselTitle={vessel.title} />
        </div>
      </div>

      {/* ── 가격 + CTA 바 ── */}
      <section className="border-b border-border-light bg-white sticky top-[100px] md:top-[136px] z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-6">
            {!vessel.rent_price_per_day && !vessel.sale_price && (
              <span className="text-sm text-navy/40">가격 문의</span>
            )}
            {vessel.rent_price_per_day && (
              <div>
                <span className="text-xs text-navy/40 block">임대가</span>
                <span className="text-2xl font-bold text-navy-light">
                  {vessel.rent_price_per_day.toLocaleString()}
                  <span className="text-sm font-normal text-navy/40">원/일</span>
                </span>
              </div>
            )}
            {vessel.sale_price && (
              <div>
                <span className="text-xs text-navy/40 block">판매가</span>
                <span className="text-2xl font-bold text-navy">
                  {vessel.sale_price >= 100000000
                    ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                    : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                  <span className="text-sm font-normal text-navy/40">원</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(vessel.type === "rent" || vessel.type === "both") && (
              <Link
                href={`/test2/booking/${vessel.id}?type=rent`}
                className="flex items-center gap-1.5 bg-navy-light hover:bg-navy-hover text-white px-5 py-3 text-sm font-semibold transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">임대 예약</span>
                <span className="sm:hidden">임대</span>
              </Link>
            )}
            {(vessel.type === "sale" || vessel.type === "both") && (
              <Link
                href={`/test2/booking/${vessel.id}?type=inquiry`}
                className="flex items-center gap-1.5 bg-navy hover:bg-[#001633] text-white px-5 py-3 text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">구매 문의</span>
                <span className="sm:hidden">문의</span>
              </Link>
            )}
            <a
              href={`tel:${COMPANY.phone}`}
              className="flex items-center justify-center gap-1.5 border border-border-light hover:border-navy-light hover:text-navy-light text-navy/60 px-4 py-3 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">전화</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 제원 카드 그리드 ── */}
      {specs.length > 0 && (
        <section className="bg-surface py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-navy font-bold text-xl mb-6">선박 제원</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className={`bg-white border border-border-light p-4 ${spec.label === "정박 위치" ? "col-span-2" : ""}`}
                >
                  <spec.icon className="w-4 h-4 text-navy-light mb-2" />
                  <p className="text-xs text-navy/40 mb-0.5">{spec.label}</p>
                  <p className="text-sm font-bold text-navy">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 선박 소개 ── */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-navy font-bold text-xl mb-4">선박 소개</h2>
          <p className="text-navy/60 leading-relaxed whitespace-pre-line max-w-3xl">
            {vessel.description}
          </p>
        </div>
      </section>

      {/* ── 특징 및 옵션 ── */}
      {vessel.features && vessel.features.length > 0 && (
        <section className="bg-surface py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-navy font-bold text-xl mb-6">특징 및 옵션</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {vessel.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white border border-border-light px-4 py-3 text-sm text-navy/70">
                  <span className="w-1.5 h-1.5 bg-navy-light rounded-full shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 하단 CTA ── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="border border-border-light p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-navy font-bold text-xl mb-2">이 선박에 관심이 있으신가요?</h3>
              <p className="text-navy/50 text-sm">전문 상담사가 자세히 안내해드립니다.</p>
            </div>
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-navy-light hover:bg-navy-hover text-white px-8 py-3.5 text-sm font-semibold transition-colors shrink-0"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
