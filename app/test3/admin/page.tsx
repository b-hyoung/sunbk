import { getAdminStats, getRecentBookings } from "@/lib/data";
import Link from "next/link";
import { Ship, Calendar, MessageCircle } from "lucide-react";

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

export default async function Test3AdminPage() {
  const [stats, recentBookings] = await Promise.all([getAdminStats(), getRecentBookings()]);

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <div className="bg-[#0a1628] py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="border-l-4 border-[#036EB8] pl-5">
            <p className="text-[#036EB8] text-xs font-semibold uppercase tracking-wider mb-1">ADMIN</p>
            <h1 className="text-white text-2xl font-bold">관리자 대시보드</h1>
            <p className="text-white/40 text-sm mt-1">수연선박 운영 현황</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 space-y-10">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200">
          <div className="p-8 border-r border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Ship className="w-4 h-4 text-[#036EB8]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">등록 선박</span>
            </div>
            <div className="text-4xl font-bold text-[#036EB8]">
              {stats.vessels}
              <span className="text-base font-normal text-gray-400 ml-1">척</span>
            </div>
          </div>
          <div className="p-8 border-r border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-[#036EB8]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">전체 예약</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.bookings}
              <span className="text-base font-normal text-gray-400 ml-1">건</span>
            </div>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-[#036EB8]" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">처리 대기</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.pendingBookings}
              <span className="text-base font-normal text-gray-400 ml-1">건</span>
            </div>
          </div>
        </div>

        {/* 최근 예약 */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-[#036EB8]">최근 예약/문의</h2>
            <hr className="border-t-2 border-[#036EB8] w-10 mt-2" />
          </div>
          <div className="border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a1628]">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">고객명</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">연락처</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">선박</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">유형</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">날짜</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-white/60 uppercase tracking-wider">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {recentBookings.map((booking: Record<string, any>) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{booking.customer_name}</td>
                      <td className="px-5 py-3.5 text-gray-500">{booking.customer_phone}</td>
                      <td className="px-5 py-3.5 text-gray-600">{booking.vessels?.title ?? "-"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-semibold ${booking.booking_type === "rent" ? "bg-[#036EB8]/10 text-[#036EB8]" : "bg-gray-100 text-gray-600"}`}>
                          {booking.booking_type === "rent" ? "임대" : "구매문의"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString("ko-KR")}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-semibold ${statusColor[booking.status]}`}>
                          {statusLabel[booking.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                        예약/문의 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 빠른 메뉴 */}
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/test3/vessels"
            className="px-6 py-3 border border-[#036EB8] text-[#036EB8] hover:bg-[#036EB8] hover:text-white text-sm font-semibold transition-colors"
          >
            선박 목록
          </Link>
          <Link
            href="/admin/vessels"
            className="px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
            선박 관리
          </Link>
          <Link
            href="/admin/bookings"
            className="px-6 py-3 border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
            예약 관리
          </Link>
        </div>
      </div>
    </div>
  );
}
