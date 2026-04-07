"use client";

import Link from "next/link";
import { Calendar, MessageCircle } from "lucide-react";
import { Vessel } from "@/lib/supabase";

interface BookingButtonProps {
  vessel: Vessel;
  basePath: string;
}

export default function BookingButton({ vessel, basePath }: BookingButtonProps) {
  const canRent = vessel.type === "rent" || vessel.type === "both";
  const canBuy = vessel.type === "sale" || vessel.type === "both";

  return (
    <div className="space-y-2">
      {canRent && (
        <Link
          href={`/${basePath}/booking/${vessel.id}?type=rent`}
          className="flex items-center justify-center gap-2 w-full bg-[#036EB8] hover:bg-[#0257a0] text-white py-3.5 text-sm font-semibold transition-colors"
        >
          <Calendar className="w-4 h-4" />
          임대 예약하기
        </Link>
      )}
      {canBuy && (
        <Link
          href={`/${basePath}/booking/${vessel.id}?type=inquiry`}
          className="flex items-center justify-center gap-2 w-full bg-[#0a1628] hover:bg-[#0d1f3c] text-white py-3.5 text-sm font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          구매 문의하기
        </Link>
      )}
    </div>
  );
}
