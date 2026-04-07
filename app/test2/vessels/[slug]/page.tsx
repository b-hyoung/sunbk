import { supabase, Vessel } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Ruler, Users, Calendar, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import BookingButton from "@/app/test1/_components/BookingButton";

async function getVessel(slug: string): Promise<Vessel | null> {
  const { data } = await supabase
    .from("vessels")
    .select("*, vessel_images(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vessel = await getVessel(slug);
  if (!vessel) return {};
  return {
    title: vessel.title,
    description: vessel.description?.slice(0, 160) ?? `${vessel.title} - 선박 임대·판매`,
    openGraph: {
      title: vessel.title,
      description: vessel.description?.slice(0, 160) ?? "",
      images: vessel.vessel_images?.[0]?.url ? [vessel.vessel_images[0].url] : [],
    },
  };
}

const typeLabel: Record<string, string> = {
  rent: "임대",
  sale: "판매",
  both: "임대·판매",
};

const typeBadge: Record<string, string> = {
  rent: "bg-emerald-50 text-emerald-700",
  sale: "bg-blue-50 text-blue-700",
  both: "bg-violet-50 text-violet-700",
};

export default async function VesselDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vessel = await getVessel(slug);
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

  return (
    <div className="bg-white min-h-screen">
      {/* 브레드크럼 */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">홈</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/vessels" className="hover:text-gray-600 transition-colors">선박 목록</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{vessel.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 좌측 */}
          <div className="lg:col-span-2 space-y-10">
            {/* 메인 이미지 */}
            <div data-fade-up>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={vessel.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-200 text-8xl select-none">
                    🚢
                  </div>
                )}
              </div>

              {/* 썸네일 */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-colors"
                    >
                      <Image src={img.url} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 선박 소개 */}
            <div data-fade-up>
              <h2 className="text-gray-900 mb-3">선박 소개</h2>
              <p className="text-gray-500 leading-relaxed whitespace-pre-line">{vessel.description}</p>
            </div>

            {/* 특징 */}
            {vessel.features && vessel.features.length > 0 && (
              <div data-fade-up>
                <h2 className="text-gray-900 mb-4">특징 및 옵션</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {vessel.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 선박 제원 */}
            {specs.length > 0 && (
              <div data-fade-up>
                <h2 className="text-gray-900 mb-4">선박 제원</h2>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-50">
                      {specs.map((spec) => (
                        <tr key={spec.label}>
                          <td className="px-5 py-3.5 text-gray-400 font-medium w-28">{spec.label}</td>
                          <td className="px-5 py-3.5 text-gray-700">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 우측 사이드바 */}
          <aside data-fade-in className="lg:col-span-1">
            <div className="sticky top-20 border border-gray-100 rounded-2xl p-6 space-y-6">
              {/* 타이틀 */}
              <div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${typeBadge[vessel.type]}`}>
                  {typeLabel[vessel.type]}
                </span>
                <h1 className="text-xl font-bold text-gray-900 leading-snug">{vessel.title}</h1>
                <p className="text-sm text-gray-400 mt-0.5">{vessel.vessel_type}</p>
              </div>

              {/* 가격 */}
              <div className="space-y-2 py-5 border-y border-gray-100">
                {vessel.rent_price_per_day && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-400">임대가</span>
                    <span className="text-xl font-bold text-blue-600">
                      {vessel.rent_price_per_day.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">원/일</span>
                    </span>
                  </div>
                )}
                {vessel.sale_price && (
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-400">판매가</span>
                    <span className="text-xl font-bold text-gray-900">
                      {vessel.sale_price >= 100000000
                        ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                        : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                      <span className="text-sm font-normal text-gray-400">원</span>
                    </span>
                  </div>
                )}
              </div>

              {/* 간단 스펙 */}
              <div className="grid grid-cols-2 gap-3">
                {vessel.length_m && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Ruler className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    {vessel.length_m}m
                  </div>
                )}
                {vessel.capacity && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    {vessel.capacity}인승
                  </div>
                )}
                {vessel.year_built && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    {vessel.year_built}년
                  </div>
                )}
                {vessel.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    <span className="truncate">{vessel.location}</span>
                  </div>
                )}
              </div>

              {/* 예약/문의 버튼 */}
              <BookingButton vessel={vessel} basePath="test2" />

              {/* 전화 */}
              <a
                href="tel:010-0000-0000"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                전화 문의
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
