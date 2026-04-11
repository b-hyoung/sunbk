export const runtime = "edge";
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
      <div className="border-b border-border-light">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-navy/40">
            <Link href="/test2/vessels" className="hover:text-navy-light transition-colors">선박 목록</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/test2/vessels/${vessel.slug}`} className="hover:text-navy-light transition-colors">{vessel.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy font-medium">{bookingType === "rent" ? "임대 예약" : "구매 문의"}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-navy font-bold text-2xl mb-1">{bookingType === "rent" ? "임대 예약" : "구매 문의"}</h1>
          <p className="text-navy/40 text-sm">{vessel.title}</p>
        </div>
        <BookingForm vessel={vessel} bookingType={bookingType as "rent" | "inquiry"} />
      </div>
    </div>
  );
}
