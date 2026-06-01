import Link from "next/link";
import Image from "next/image";
import { Ship, Anchor, Ruler, Users } from "lucide-react";
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
        <div className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-1">
          {category}
          {material && <span className="text-gray-300 mx-1">·</span>}
          {material && <span className="text-gray-500 normal-case">{material}</span>}
        </div>
        <div className="font-bold text-gray-900 text-base leading-tight">
          {vessel.title}
        </div>
        {vessel.tagline && (
          <p className="text-xs text-gray-500 leading-snug mt-1.5 line-clamp-2">
            {vessel.tagline}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-auto pt-3 border-t border-gray-100 text-xs text-gray-600">
          {vessel.tonnage && (
            <span className="inline-flex items-center gap-1">
              <Anchor className="w-3 h-3 text-gray-400" />
              {vessel.tonnage}t
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
