export const dynamic = "force-dynamic";

import { getAdminStats, getRecentBookings } from "@/lib/data";
import { getAllVesselsFromStore } from "@/lib/admin-store";
import Link from "next/link";
import { Ship, Calendar, MessageCircle, Plus, ChevronDown } from "lucide-react";
import AdminCharts from "@/components/admin/AdminCharts";
import AdminVesselTable from "@/components/admin/AdminVesselTable";

const statusLabel: Record<string, string> = {
  pending: "대기",
  confirmed: "확정",
  cancelled: "취소",
  completed: "완료",
};

const statusColor: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-gray-100 text-gray-500",
};

export default async function AdminPage() {
  const [stats, recentBookings] = await Promise.all([getAdminStats(), getRecentBookings()]);
  const vessels = getAllVesselsFromStore();

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-gray-900">선박 관리</h1>
              <p className="text-gray-400 text-sm mt-0.5">총 {vessels.length}척 운영 중</p>
            </div>
            <Link
              href="/admin/vessels/new"
              className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">선박 등록</span>
              <span className="sm:hidden">등록</span>
            </Link>
          </div>

          {/* 컴팩트 통계 바 */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/40">
            <div className="px-4 py-3 sm:py-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                <Ship className="w-3.5 h-3.5" />선박
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.vessels}<span className="text-sm font-normal text-gray-400 ml-0.5">척</span></div>
            </div>
            <div className="px-4 py-3 sm:py-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                <Calendar className="w-3.5 h-3.5" />전체 예약
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.bookings}<span className="text-sm font-normal text-gray-400 ml-0.5">건</span></div>
            </div>
            <div className="px-4 py-3 sm:py-4">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">
                <MessageCircle className="w-3.5 h-3.5" />대기
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingBookings}<span className="text-sm font-normal text-gray-400 ml-0.5">건</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 메인: 선박 목록 */}
        <AdminVesselTable vessels={vessels} />

        {/* 최근 예약/문의 */}
        <section className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">최근 예약/문의</h2>
            <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              전체보기
            </Link>
          </div>

          {/* 모바일: 카드 */}
          <ul className="md:hidden divide-y divide-gray-50">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recentBookings.slice(0, 5).map((booking: Record<string, any>) => (
              <li key={booking.id} className="px-5 py-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-gray-900 truncate">{booking.customer_name}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium ${booking.booking_type === "rent" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {booking.booking_type === "rent" ? "임대" : "구매문의"}
                    </span>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColor[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <a href={`tel:${booking.customer_phone}`} className="hover:text-blue-600 transition-colors">{booking.customer_phone}</a>
                  <span>{new Date(booking.created_at).toLocaleDateString("ko-KR")}</span>
                </div>
                <div className="text-xs text-gray-400 truncate">{booking.vessels?.title ?? "-"}</div>
              </li>
            ))}
            {recentBookings.length === 0 && (
              <li className="px-6 py-12 text-center text-gray-400 text-sm">예약/문의 내역이 없습니다.</li>
            )}
          </ul>

          {/* 데스크탑: 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">고객명</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">연락처</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">선박</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">유형</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">날짜</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentBookings.slice(0, 5).map((booking: Record<string, any>) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{booking.customer_name}</td>
                    <td className="px-6 py-3.5 text-gray-500">{booking.customer_phone}</td>
                    <td className="px-6 py-3.5 text-gray-600">{booking.vessels?.title ?? "-"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.booking_type === "rent" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {booking.booking_type === "rent" ? "임대" : "구매문의"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">{new Date(booking.created_at).toLocaleDateString("ko-KR")}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[booking.status]}`}>
                        {statusLabel[booking.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">예약/문의 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 접히는 차트 */}
        <details className="group border border-gray-100 rounded-2xl overflow-hidden">
          <summary className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer list-none hover:bg-gray-50/60 transition-colors">
            <h2 className="text-base font-semibold text-gray-900">통계 차트</h2>
            <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-5 sm:px-6 pb-6">
            <AdminCharts />
          </div>
        </details>
      </div>
    </div>
  );
}
