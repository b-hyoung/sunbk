import { getVesselBySlug, getVesselPhotos } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import VesselGallery from "@/components/vessels/VesselGallery";
import { Phone, MapPin, Ruler, Users, Calendar, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import BookingButton from "@/app/test3/_components/BookingButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);
  if (!vessel) return {};
  return {
    title: vessel.title,
    description: vessel.description?.slice(0, 160) ?? `${vessel.title} - 선박 임대·판매`,
  };
}

const typeLabel: Record<string, string> = { rent: "임대", sale: "판매", both: "임대·판매" };

export default async function Test3VesselDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vessel = await getVesselBySlug(slug);
  if (!vessel) notFound();

  const images = await getVesselPhotos(vessel.id, "vessel");

  const specs = [
    { label: "선박 종류", value: vessel.vessel_type },
    { label: "건조 연도", value: vessel.year_built ? `${vessel.year_built}년` : null },
    { label: "전장", value: vessel.length_m ? `${vessel.length_m}m` : null },
    { label: "톤수", value: vessel.tonnage ? `${vessel.tonnage}톤` : null },
    { label: "엔진 출력", value: vessel.engine_power },
    { label: "승선 정원", value: vessel.capacity ? `${vessel.capacity}명` : null },
    { label: "정박 위치", value: vessel.location },
  ].filter((s) => s.value);

  const keyStats = [
    vessel.length_m && { icon: Ruler, label: "전장", value: `${vessel.length_m}m` },
    vessel.capacity && { icon: Users, label: "정원", value: `${vessel.capacity}명` },
    vessel.year_built && { icon: Calendar, label: "건조", value: `${vessel.year_built}년` },
    vessel.location && { icon: MapPin, label: "위치", value: vessel.location },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <div className="bg-white min-h-screen">
      {/* ── 타이틀 헤더 ── */}
      <div className="bg-navy-dark px-6 sm:px-8 pt-6 pb-10">
        {/* 브레드크럼 */}
        <nav aria-label="브레드크럼" className="flex items-center gap-2 text-sm text-white/60 mb-6">
          <Link href="/test3" className="hover:text-white/80 transition-colors">메인</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/test3/vessels" className="hover:text-white/80 transition-colors">선박 목록</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white truncate max-w-[160px]">{vessel.title}</span>
        </nav>
        <span className="inline-block text-ocean text-xs font-bold tracking-widest uppercase mb-3">
          {vessel.vessel_type} · {typeLabel[vessel.type]}
        </span>
        <h1 className="text-white text-4xl sm:text-5xl font-bold">{vessel.title}</h1>
      </div>

      {/* ── 갤러리 ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
        <div data-fade-up>
          <VesselGallery images={images} vesselTitle={vessel.title} />
        </div>
      </div>

      {/* ── 핵심 스펙 가로 바 ── */}
      {keyStats.length > 0 && (
        <div className="bg-ocean">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex overflow-x-auto scrollbar-hide divide-x divide-white/20">
              {keyStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-5 shrink-0">
                  <Icon className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
                    <p className="text-white font-bold text-base">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 메인 콘텐츠 ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="flex gap-10 lg:gap-14 flex-col lg:flex-row">

          {/* 좌측: 가격 + 예약 */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-28 space-y-0 border border-gray-200">
              <div className="bg-navy-dark px-6 py-5">
                <p className="text-ocean text-xs font-bold uppercase tracking-widest mb-1">가격 안내</p>
                <p className="text-white/60 text-sm">{typeLabel[vessel.type]}</p>
              </div>

              <div className="p-6 space-y-5 border-b border-gray-100">
                {vessel.rent_price_per_day && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">임대가</p>
                    <p className="text-3xl font-bold text-ocean">
                      {vessel.rent_price_per_day.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">원/일</span>
                    </p>
                  </div>
                )}
                {vessel.sale_price && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">판매가</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {vessel.sale_price >= 100000000
                        ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                        : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                      <span className="text-sm font-normal text-gray-400">원</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <BookingButton vessel={vessel} basePath="test3" />
                <a
                  href="tel:010-0000-0000"
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-ocean hover:text-ocean text-gray-600 py-3.5 text-sm font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  전화 문의
                </a>
              </div>
            </div>
          </aside>

          {/* 우측: 상세 내용 */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* 선박 소개 */}
            <div>
              <h2 className="text-xl font-bold text-ocean mb-2">선박 소개</h2>
              <hr className="border-t-2 border-ocean w-12 mb-5" />
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-base">{vessel.description}</p>
            </div>

            {/* 특징 + 제원 2열 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {vessel.features && vessel.features.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-ocean mb-2">특징 및 옵션</h2>
                  <hr className="border-t-2 border-ocean w-12 mb-5" />
                  <ul className="space-y-3">
                    {vessel.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                        <span className="mt-2 w-1.5 h-1.5 bg-ocean shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {specs.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-ocean mb-2">선박 제원</h2>
                  <hr className="border-t-2 border-ocean w-12 mb-5" />
                  <dl className="space-y-0 border border-gray-200">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex border-b border-gray-100 last:border-b-0">
                        <dt className="w-28 shrink-0 px-4 py-3.5 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                          {spec.label}
                        </dt>
                        <dd className="px-4 py-3.5 text-base text-gray-800 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/test3/vessels"
                className="inline-flex items-center gap-2 text-base text-gray-400 hover:text-ocean transition-colors"
              >
                ← 선박 목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
