import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    vessel_id,
    booking_type,
    customer_name,
    customer_phone,
    customer_email,
    start_date,
    end_date,
    total_price,
    message,
  } = body;

  if (!vessel_id || !customer_name || !customer_phone) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase.from("bookings").insert({
    vessel_id,
    booking_type,
    customer_name,
    customer_phone,
    customer_email: customer_email || null,
    start_date: start_date || null,
    end_date: end_date || null,
    total_price: total_price || null,
    message: message || null,
    status: "pending",
  }).select().single();

  if (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "예약 저장 중 오류가 발생했습니다." }, { status: 500 });
  }

  // TODO: 이메일 알림 (Resend) 연동

  return NextResponse.json({ success: true, booking: data });
}
