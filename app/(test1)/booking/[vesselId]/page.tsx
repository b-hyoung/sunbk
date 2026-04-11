import { getVesselById } from "@/lib/data";
import { notFound } from "next/navigation";
import BookingForm from "@/app/test1/_components/BookingForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "예약/문의" };

export default async function BookingPage({
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
      <div className="border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/vessels" className="hover:text-gray-600 transition-colors">선박 목록</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/vessels/${vessel.slug}`} className="hover:text-gray-600 transition-colors">{vessel.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{bookingType === "rent" ? "임대 예약" : "구매 문의"}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-1">{bookingType === "rent" ? "임대 예약" : "구매 문의"}</h1>
          <p className="text-gray-400 text-sm">{vessel.title}</p>
        </div>
        <BookingForm vessel={vessel} bookingType={bookingType as "rent" | "inquiry"} />
      </div>
    </div>
  );
}
