import { getVesselById } from "@/lib/data";
import { notFound } from "next/navigation";
import BookingForm from "@/app/test3/_components/BookingForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "예약/문의" };

export default async function Test3BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ vesselId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { vesselId } = await params;
  const { type } = await searchParams;

  const vessel = await getVesselById(vesselId);
  if (!vessel) notFound();

  const bookingType = type === "inquiry" ? "inquiry" : "rent";

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <div className="bg-[#0a1628] py-12">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/test3" className="hover:text-white/70 transition-colors">메인</Link>
            <span>〉</span>
            <Link href="/test3/vessels" className="hover:text-white/70 transition-colors">선박 목록</Link>
            <span>〉</span>
            <Link href={`/test3/vessels/${vessel.slug}`} className="hover:text-white/70 transition-colors truncate max-w-[120px]">
              {vessel.title}
            </Link>
            <span>〉</span>
            <span className="text-white/70">{bookingType === "rent" ? "임대 예약" : "구매 문의"}</span>
          </nav>
          <div className="border-l-4 border-[#036EB8] pl-5">
            <p className="text-[#036EB8] text-xs font-semibold uppercase tracking-wider mb-1">
              {bookingType === "rent" ? "BOOKING" : "INQUIRY"}
            </p>
            <h1 className="text-white text-2xl font-bold">
              {bookingType === "rent" ? "임대 예약" : "구매 문의"}
            </h1>
            <p className="text-white/40 text-sm mt-1">{vessel.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12">
        <BookingForm vessel={vessel} bookingType={bookingType as "rent" | "inquiry"} />
      </div>
    </div>
  );
}
