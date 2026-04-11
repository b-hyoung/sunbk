export const runtime = "edge";
import { getAllWorkPhotos } from "@/lib/data";
import WorkGallery from "@/components/work/WorkGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "작업현장 | 수연선박",
  description: "수연선박의 정비, 항해, 상가 작업 등 현장 기록을 사진으로 확인하세요.",
};

export default async function WorkPage() {
  const photos = await getAllWorkPhotos();

  return (
    <div className="bg-white min-h-screen">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Work & Maintenance
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            수연선박의 작업현장
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
          </p>
        </div>
      </section>

      {/* 갤러리 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">작업사진</h2>
          <p className="text-sm text-gray-400">❈ 사진을 클릭하시면 크게 보실 수 있습니다.</p>
        </div>
        <WorkGallery photos={photos} />
      </section>
    </div>
  );
}
