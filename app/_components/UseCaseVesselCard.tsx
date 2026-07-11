import Link from "next/link";
import Image from "next/image";
import { Ship, Anchor, Gauge, Ruler, Users } from "lucide-react";
import type { Vessel, VesselType } from "@/lib/supabase";
import { getVesselCategory } from "@/lib/vessel-types";

interface Props {
  vessel: Vessel;
}

const AVAILABILITY_LABEL: Record<VesselType, string> = {
  both: "임대·판매 가능",
  rent: "임대 가능",
  sale: "판매 가능",
};

/** description에서 "주요 작업 이력:" 블록을 추출. 없으면 null. */
function extractWorkHistory(description: string | null | undefined): string[] | null {
  if (!description) return null;
  const match = description.match(/주요 작업 이력:\s*\n([\s\S]+?)(?:\n\n|$)/);
  if (!match) return null;
  const items = match[1]
    .split("\n")
    .map((line) => line.replace(/^[·•\-]\s*/, "").trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

export default function UseCaseVesselCard({ vessel }: Props) {
  const primary =
    vessel.vessel_images?.find((i) => i.is_primary) ?? vessel.vessel_images?.[0];
  const category = getVesselCategory(vessel);
  const material = vessel.vessel_type.includes("FRP")
    ? "FRP"
    : vessel.vessel_type.includes("강선")
      ? "강선"
      : null;
  const badgeLabel = AVAILABILITY_LABEL[vessel.type];
  const history = extractWorkHistory(vessel.description);

  return (
    <Link
      href={`/vessels/${vessel.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all"
    >
      <div className="relative aspect-[4/3] bg-gray-50">
        {primary ? (
          <Image
            src={primary.url}
            alt={vessel.title}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Ship className="w-10 h-10" />
          </div>
        )}
        {badgeLabel && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-600/95 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            {badgeLabel}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-3.5">
        <div className="text-xs text-blue-600 font-medium mb-1.5">
          {category}
          {material && <span className="text-gray-300 mx-1">·</span>}
          {material && <span className="text-gray-500">{material}</span>}
        </div>
        <div className="font-semibold text-gray-900 text-base leading-tight tracking-tight">
          {vessel.title}
        </div>
        {vessel.tagline && (
          <p className="text-xs text-gray-500 leading-snug mt-1.5 line-clamp-2">
            {vessel.tagline}
          </p>
        )}
        {(history || (vessel.features && vessel.features.length > 0)) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-blue-600 font-medium mb-1.5">
              {history ? "주요 작업 이력" : "특징"}
            </p>
            <ul className="space-y-1 text-xs text-gray-600 pl-1 min-h-[3.75rem]">
              {(history ?? vessel.features ?? [])
                .slice(0, 3)
                .map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-gray-400 mt-px">-</span>
                    <span className="truncate flex-1">{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto pt-3 border-t border-gray-100 text-xs text-gray-600">
          {vessel.tonnage && (
            <span className="inline-flex items-center gap-1">
              <Anchor className="w-3 h-3 text-gray-400" />
              {vessel.tonnage}t
            </span>
          )}
          {vessel.horsepower && (
            <span className="inline-flex items-center gap-1">
              <Gauge className="w-3 h-3 text-gray-400" />
              {vessel.horsepower.toLocaleString()}마력
            </span>
          )}
          {vessel.length_m && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="w-3 h-3 text-gray-400" />
              {vessel.length_m}m
            </span>
          )}
          {vessel.capacity && (
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-400" />
              {vessel.capacity}명
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
