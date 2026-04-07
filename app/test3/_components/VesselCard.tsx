import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Users } from "lucide-react";
import { Vessel } from "@/lib/supabase";

interface VesselCardProps {
  vessel: Vessel;
  basePath: string;
}

const typeLabel: Record<string, string> = {
  rent: "임대",
  sale: "판매",
  both: "임대·판매",
};

export default function VesselCard({ vessel, basePath }: VesselCardProps) {
  const primaryImage = vessel.vessel_images?.find((img) => img.is_primary) ?? vessel.vessel_images?.[0];
  const label = typeLabel[vessel.type] ?? typeLabel.both;

  return (
    <Link
      href={`/${basePath}/vessels/${vessel.slug}`}
      className="group flex flex-col bg-white border border-gray-200 overflow-hidden hover:border-[#036EB8] hover:shadow-lg hover:shadow-[#036EB8]/10 transition-[border-color,box-shadow] duration-200"
    >
      {/* 이미지 */}
      <div className="relative h-52 bg-gray-100 overflow-hidden shrink-0">
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
        {/* 타입 배지 */}
        <span className="absolute top-0 left-0 text-xs font-semibold px-3 py-1.5 bg-[#036EB8] text-white">
          {label}
        </span>
      </div>

      {/* 내용 */}
      <div className="flex flex-col flex-1 p-5">
        <div className="text-xs font-semibold text-[#036EB8] mb-1 uppercase tracking-wider">
          {vessel.vessel_type}
        </div>
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-1 text-base">{vessel.title}</h3>

        {/* 스펙 */}
        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500">
          {vessel.length_m && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="w-3 h-3" />{vessel.length_m}m
            </span>
          )}
          {vessel.capacity && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3" />{vessel.capacity}명
            </span>
          )}
          {vessel.year_built && <span>{vessel.year_built}년</span>}
        </div>

        {vessel.location && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{vessel.location}</span>
          </div>
        )}

        {/* 가격 */}
        <div className="mt-auto pt-4 border-t border-gray-100 space-y-1">
          {vessel.rent_price_per_day && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400">임대가</span>
              <span className="text-sm font-bold text-[#036EB8]">
                {vessel.rent_price_per_day.toLocaleString()}
                <span className="text-xs font-normal text-gray-400">원/일</span>
              </span>
            </div>
          )}
          {vessel.sale_price && (
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-400">판매가</span>
              <span className="text-sm font-bold text-gray-900">
                {vessel.sale_price >= 100000000
                  ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                  : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                <span className="text-xs font-normal text-gray-400">원</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
