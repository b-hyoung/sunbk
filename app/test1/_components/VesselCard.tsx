import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Users, Phone } from "lucide-react";
import { Vessel } from "@/lib/supabase";

interface VesselCardProps {
  vessel: Vessel;
  basePath: string;
  filterType?: string;
}

const typeLabel: Record<string, string> = {
  rent: "임대",
  sale: "판매",
  both: "임대·판매",
};

const typeBadgeColor: Record<string, string> = {
  rent: "bg-blue-600/80",
  sale: "bg-emerald-600/80",
  both: "bg-black/50",
};

export default function VesselCard({ vessel, basePath, filterType }: VesselCardProps) {
  const primaryImage = vessel.vessel_images?.find((img) => img.is_primary) ?? vessel.vessel_images?.[0];

  // 필터 컨텍스트에 맞는 배지만 표시
  const badgeKey = filterType === "rent" || filterType === "sale" ? filterType : vessel.type ?? "both";
  const label = typeLabel[badgeKey] ?? typeLabel.both;
  const badgeColor = typeBadgeColor[badgeKey] ?? typeBadgeColor.both;

  return (
    <div className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-[border-color,box-shadow] duration-200">
      {/* 이미지 */}
      <Link href={basePath ? `/${basePath}/vessels/${vessel.slug}` : `/vessels/${vessel.slug}`}>
        <div className="relative h-48 bg-gray-50 overflow-hidden shrink-0">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={vessel.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl opacity-20">🚢</div>
          )}
          <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${badgeColor} text-white backdrop-blur-sm`}>
            {label}
          </span>
        </div>
      </Link>

      {/* 내용 */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={basePath ? `/${basePath}/vessels/${vessel.slug}` : `/vessels/${vessel.slug}`} className="flex-1">
          <div className="text-xs font-medium text-blue-600 mb-1">{vessel.vessel_type}</div>
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-1">{vessel.title}</h3>

          {/* 스펙 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {vessel.length_m && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                <Ruler className="w-3 h-3" />{vessel.length_m}m
              </span>
            )}
            {vessel.capacity && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                <Users className="w-3 h-3" />{vessel.capacity}인
              </span>
            )}
            {vessel.year_built && (
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{vessel.year_built}년</span>
            )}
          </div>

          {vessel.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{vessel.location}</span>
            </div>
          )}

          {/* 가격 */}
          <div className="pt-3 border-t border-gray-100 space-y-1">
            {vessel.rent_price_per_day && (!filterType || filterType === "rent") && (
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">임대</span>
                <span className="text-sm font-bold text-blue-600">
                  {vessel.rent_price_per_day.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400">원/일</span>
                </span>
              </div>
            )}
            {vessel.sale_price && (!filterType || filterType === "sale") && (
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-400">판매</span>
                <span className="text-sm font-bold text-gray-900">
                  {vessel.sale_price >= 100000000
                    ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                    : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                  <span className="text-xs font-normal text-gray-400">원</span>
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* 문의 버튼 */}
        <a
          href="tel:010-0000-0000"
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          바로 문의
        </a>
      </div>
    </div>
  );
}
