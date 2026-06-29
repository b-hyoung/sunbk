export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getVessels } from "@/lib/data";
import VesselsBrowser from "@/app/_components/VesselsBrowser";
import VesselsView from "@/app/_components/VesselsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "선박 목록",
  description:
    "임대 및 판매 가능한 선박 목록. 예인선·기타선(통선)·기타선(해양조사).",
};

export default async function VesselsPage() {
  // 전체 목록(상태 필터 + 정렬)만 서버에서 준비하고, type·cls 필터는 클라이언트에서 수행.
  // 정적 익스포트(GitHub Pages)에서도 쿼리스트링 필터가 동작하도록 하기 위함.
  const allVessels = await getVessels({});

  // useSearchParams는 Suspense가 필요하다. fallback으로 "필터 없는 전체 목록"을 렌더하면
  // 정적 HTML에 콘텐츠가 박혀 SEO·초기 표시가 유지되고, 하이드레이션 후 필터본으로 교체된다.
  return (
    <Suspense fallback={<VesselsView vessels={allVessels} />}>
      <VesselsBrowser allVessels={allVessels} />
    </Suspense>
  );
}
