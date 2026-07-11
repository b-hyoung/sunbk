"use client";

import { useSearchParams } from "next/navigation";
import type { Vessel } from "@/lib/supabase";
import { matchesVesselClass, type VesselClass } from "@/lib/vessel-types";
import VesselsView from "./VesselsView";

function isVesselClass(v: string | undefined): v is VesselClass {
  return v === "tug" || v === "utility" || v === "coastal";
}

interface Props {
  /** status 필터(active/rented)·정렬까지 끝난 전체 목록. 클라이언트에서 type·cls만 거른다. */
  allVessels: Vessel[];
}

/**
 * 선박 목록 필터링을 클라이언트에서 수행한다.
 * 정적 익스포트(GitHub Pages)에는 서버가 없어 searchParams 기반 서버 필터링이
 * 동작하지 않으므로, useSearchParams로 브라우저에서 거른다. (동적 호스트에서도 동일하게 동작)
 */
export default function VesselsBrowser({ allVessels }: Props) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? undefined;
  const cls = searchParams.get("cls") ?? undefined;

  let vessels = allVessels;
  if (type === "rent") {
    vessels = vessels.filter((v) => v.type === "rent" || v.type === "both");
  } else if (type === "sale") {
    vessels = vessels.filter((v) => v.type === "sale" || v.type === "both");
  }
  if (isVesselClass(cls)) {
    vessels = vessels.filter((v) => matchesVesselClass(v, cls));
  }

  return <VesselsView vessels={vessels} type={type} cls={cls} />;
}
