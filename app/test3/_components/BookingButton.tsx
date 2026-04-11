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
          href={basePath ? `/${basePath}/booking/${vessel.id}?type=rent` : `/booking/${vessel.id}?type=rent`}
          className="flex items-center justify-center gap-2 w-full bg-ocean hover:bg-ocean-hover text-white py-3.5 text-sm font-semibold transition-colors"
        >
          <Calendar className="w-4 h-4" />
          임대 예약하기
        </Link>
      )}
      {canBuy && (
        <Link
          href={basePath ? `/${basePath}/booking/${vessel.id}?type=inquiry` : `/booking/${vessel.id}?type=inquiry`}
          className="flex items-center justify-center gap-2 w-full bg-navy-dark hover:bg-navy-dark text-white py-3.5 text-sm font-semibold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          구매 문의하기
        </Link>
      )}
    </div>
  );
}
