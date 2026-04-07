import Link from "next/link";
import Image from "next/image";
import { MapPin, Ruler, Users, Calendar, Phone } from "lucide-react";
import { Vessel } from "@/lib/supabase";

const typeLabel: Record<string, string> = {
  rent: "임대",
  sale: "판매",
  both: "임대·판매",
};

const typeBadge: Record<string, string> = {
  rent: "bg-[#09388a] text-white",
  sale: "bg-[#001e42] text-white",
  both: "bg-[#001e42] text-white",
};

interface Test2VesselCardProps {
  vessel: Vessel;
  filterType?: string;
}

export default function Test2VesselCard({ vessel, filterType }: Test2VesselCardProps) {
  const images = vessel.vessel_images ?? [];
  const primary = images.find((i) => i.is_primary) ?? images[0];

  const badgeKey = filterType === "rent" || filterType === "sale" ? filterType : vessel.type ?? "both";
  const label = typeLabel[badgeKey] ?? typeLabel.both;
  const badge = typeBadge[badgeKey] ?? typeBadge.both;

  return (
    <div className="group block bg-white border border-[#E6E7E9] hover:border-[#09388a] hover:shadow-md transition-all overflow-hidden rounded-none">
      {/* 이미지 */}
      <Link href={`/test2/vessels/${vessel.slug}`}>
        <div className="relative h-52 bg-[#F3F3F3] overflow-hidden">
          {primary ? (
            <Image
              src={primary.url}
              alt={vessel.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[#001e42]/20 text-6xl">🚢</div>
          )}
          <div className="absolute top-0 left-0">
            <span className={`text-xs font-bold px-3 py-1.5 ${badge}`}>
              {label}
            </span>
          </div>
        </div>
      </Link>

      {/* 내용 */}
      <div className="p-6">
        <Link href={`/test2/vessels/${vessel.slug}`} className="block">
          <p className="text-[#09388a] text-xs font-semibold mb-1.5">{vessel.vessel_type}</p>
          <h3 className="text-[#001e42] font-bold text-base mb-3 group-hover:text-[#09388a] transition-colors line-clamp-1">
            {vessel.title}
          </h3>

          <div className="flex flex-wrap gap-3 text-xs text-[#001e42]/50 mb-4">
            {vessel.length_m && (
              <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{vessel.length_m}m</span>
            )}
            {vessel.capacity && (
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{vessel.capacity}인</span>
            )}
            {vessel.year_built && (
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{vessel.year_built}년</span>
            )}
            {vessel.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vessel.location}</span>
            )}
          </div>

          <div className="border-t border-[#E6E7E9] pt-4 flex items-end justify-between">
            <div>
              {vessel.rent_price_per_day && (!filterType || filterType === "rent") && (
                <div>
                  <span className="text-xs text-[#001e42]/40">임대가</span>
                  <div className="text-[#09388a] font-bold text-lg">
                    {vessel.rent_price_per_day.toLocaleString()}
                    <span className="text-xs font-normal text-[#001e42]/40">원/일</span>
                  </div>
                </div>
              )}
              {vessel.sale_price && (!filterType || filterType === "sale") && (
                <div>
                  <span className="text-xs text-[#001e42]/40">판매가</span>
                  <div className="text-[#001e42] font-bold text-lg">
                    {vessel.sale_price >= 100000000
                      ? `${(vessel.sale_price / 100000000).toFixed(1)}억`
                      : `${Math.floor(vessel.sale_price / 10000).toLocaleString()}만`}
                    <span className="text-xs font-normal text-[#001e42]/40">원</span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs text-[#09388a] font-semibold group-hover:underline">상세보기 →</span>
          </div>
        </Link>

        {/* 바로 문의 */}
        <a
          href="tel:010-0000-0000"
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 border border-[#E6E7E9] text-xs font-medium text-[#001e42]/60 hover:border-[#09388a] hover:text-[#09388a] hover:bg-[#09388a]/5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          바로 문의
        </a>
      </div>
    </div>
  );
}
