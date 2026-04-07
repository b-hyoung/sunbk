export const runtime = "edge";
import { getVesselBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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

  const images = vessel.vessel_images ?? [];
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];

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
      {/* ── 풀위드 히어로 이미지 ── */}
      <div className="relative h-[60vh] min-h-[360px] bg-[#0a1628] overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={vessel.title}
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-8xl opacity-10">🚢</div>
        )}
        {/* 하단 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent" />

        {/* 브레드크럼 (상단 좌) */}
        <div className="absolute top-6 left-6 sm:left-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/test3" className="hover:text-white/80 transition-colors">메인</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/test3/vessels" className="hover:text-white/80 transition-colors">선박 목록</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 truncate max-w-[120px]">{vessel.title}</span>
          </nav>
        </div>

        {/* 하단 타이틀 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-8">
          <span className="inline-block text-[#036EB8] text-[10px] font-bold tracking-widest uppercase mb-2">
            {vessel.vessel_type} · {typeLabel[vessel.type]}
          </span>
          <h1 className="text-white text-3xl sm:text-4xl font-bold">{vessel.title}</h1>
        </div>

        {/* 썸네일 (우하단) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {images.slice(0, 4).map((img, i) => (
              <div key={img.id} className="relative w-14 h-10 overflow-hidden border border-white/20">
                <Image src={img.url} alt={`${vessel.title} 사진 ${i + 1}`} fill sizes="56px" className="object-cover opacity-80 hover:opacity-100 transition-opacity" />
                {i === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 핵심 스펙 가로 바 ── */}
      {keyStats.length > 0 && (
        <div className="bg-[#036EB8]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex overflow-x-auto scrollbar-hide divide-x divide-white/20">
              {keyStats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-4 shrink-0">
                  <Icon className="w-4 h-4 text-white/60" />
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-wider">{label}</p>
                    <p className="text-white font-bold text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 메인 콘텐츠: 좌 가격사이드바 + 우 상세내용 ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex gap-10 lg:gap-14 flex-col lg:flex-row">

          {/* 좌측: 가격 + 예약 (sticky) */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-20 space-y-0 border border-gray-200">
              {/* 가격 헤더 */}
              <div className="bg-[#0a1628] px-5 py-4">
                <p className="text-[#036EB8] text-[10px] font-bold uppercase tracking-widest mb-1">가격 안내</p>
                <p className="text-white/60 text-xs">{typeLabel[vessel.type]}</p>
              </div>

              <div className="p-5 space-y-4 border-b border-gray-100">
                {vessel.rent_price_per_day && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">임대가</p>
                    <p className="text-2xl font-bold text-[#036EB8]">
                      {vessel.rent_price_per_day.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">원/일</span>
                    </p>
                  </div>
                )}
                {vessel.sale_price && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">판매가</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {vessel.sale_price >= 100000000
                        ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                        : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                      <span className="text-sm font-normal text-gray-400">원</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <BookingButton vessel={vessel} basePath="test3" />
                <a
                  href="tel:010-0000-0000"
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-[#036EB8] hover:text-[#036EB8] text-gray-600 py-3 text-sm font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  전화 문의
                </a>
              </div>
            </div>
          </aside>

          {/* 우측: 상세 내용 */}
          <div className="flex-1 min-w-0 space-y-12">

            {/* 선박 소개 */}
            <div>
              <h2 className="text-lg font-bold text-[#036EB8] mb-2">선박 소개</h2>
              <hr className="border-t-2 border-[#036EB8] w-10 mb-5" />
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{vessel.description}</p>
            </div>

            {/* 특징 + 제원 2열 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* 특징 */}
              {vessel.features && vessel.features.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#036EB8] mb-2">특징 및 옵션</h2>
                  <hr className="border-t-2 border-[#036EB8] w-10 mb-5" />
                  <ul className="space-y-2.5">
                    {vessel.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-[#036EB8] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 제원 */}
              {specs.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-[#036EB8] mb-2">선박 제원</h2>
                  <hr className="border-t-2 border-[#036EB8] w-10 mb-5" />
                  <dl className="space-y-0 border border-gray-200">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex border-b border-gray-100 last:border-b-0">
                        <dt className="w-28 shrink-0 px-4 py-3 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                          {spec.label}
                        </dt>
                        <dd className="px-4 py-3 text-sm text-gray-800 font-medium">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* 목록으로 돌아가기 */}
            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/test3/vessels"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#036EB8] transition-colors"
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
