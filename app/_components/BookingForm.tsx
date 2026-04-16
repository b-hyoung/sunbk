"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vessel } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  vessel: Vessel;
  bookingType: "rent" | "inquiry";
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-3 sm:py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors";
const labelClass = "block text-sm font-medium text-gray-600 mb-1.5";

export default function BookingForm({ vessel, bookingType }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    start_date: "",
    end_date: "",
    message: "",
  });

  const totalDays =
    form.start_date && form.end_date
      ? Math.max(0, Math.floor(
          (new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / 86400000
        ))
      : 0;

  const totalPrice = vessel.rent_price_per_day && totalDays > 0
    ? vessel.rent_price_per_day * totalDays
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vessel_id: vessel.id, booking_type: bookingType, ...form, total_price: totalPrice }),
    });
    setLoading(false);
    if (res.ok) router.push("/booking/confirm");
    else alert("오류가 발생했습니다. 다시 시도해주세요.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 고객 정보 */}
      <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">고객 정보</h2>
        <div>
          <label className={labelClass}>이름 <span className="text-red-400">*</span></label>
          <input type="text" required placeholder="홍길동" value={form.customer_name}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>연락처 <span className="text-red-400">*</span></label>
          <input type="tel" required placeholder="010-0000-0000" value={form.customer_phone}
            onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>이메일 <span className="text-gray-300 text-xs font-normal">(선택)</span></label>
          <input type="email" placeholder="example@email.com" value={form.customer_email}
            onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* 임대 기간 */}
      {bookingType === "rent" && (
        <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">임대 기간</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>시작일 <span className="text-red-400">*</span></label>
              <input type="date" required min={new Date().toISOString().split("T")[0]}
                value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>종료일 <span className="text-red-400">*</span></label>
              <input type="date" required min={form.start_date || new Date().toISOString().split("T")[0]}
                value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className={inputClass} />
            </div>
          </div>
          {totalDays > 0 && vessel.rent_price_per_day && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{vessel.rent_price_per_day.toLocaleString()}원 × {totalDays}일</span>
                <span>{totalPrice?.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-gray-900">
                <span>예상 금액</span>
                <span className="text-blue-600">{totalPrice?.toLocaleString()}원</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 문의 내용 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <label className={labelClass}>
          문의 내용 <span className="text-gray-300 text-xs font-normal">(선택)</span>
        </label>
        <textarea rows={4}
          placeholder={bookingType === "rent" ? "임대 목적, 요청사항 등을 입력해주세요." : "구매 문의 내용을 입력해주세요."}
          value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> 처리 중...</>
          : bookingType === "rent" ? "예약 신청하기" : "문의 보내기"}
      </button>

      <p className="text-xs text-center text-gray-300">
        접수 후 담당자가 확인하여 연락드립니다 · 영업시간 평일 09:00–18:00
      </p>
    </form>
  );
}
