import { getAdminStats, getRecentBookings } from "@/lib/data";
import Link from "next/link";
import { Ship, Calendar, MessageCircle, Plus } from "lucide-react";

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

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-400 text-sm mt-0.5">수연선박 운영 현황</p>
            </div>
            <Link
              href="/admin/vessels/new"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              선박 등록
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-fade-up>
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Ship className="w-4 h-4 text-gray-300" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">등록 선박</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.vessels}
              <span className="text-base font-normal text-gray-400 ml-1">척</span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Calendar className="w-4 h-4 text-gray-300" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">전체 예약</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.bookings}
              <span className="text-base font-normal text-gray-400 ml-1">건</span>
            </div>
          </div>
          <div className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <MessageCircle className="w-4 h-4 text-gray-300" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">처리 대기</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">
              {stats.pendingBookings}
              <span className="text-base font-normal text-gray-400 ml-1">건</span>
            </div>
          </div>
        </div>

        {/* 최근 예약 */}
        <div data-fade-up className="border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">최근 예약/문의</h2>
            <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              전체보기
            </Link>
          </div>
          <div className="overflow-x-auto">
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
                {recentBookings.map((booking: Record<string, any>) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-gray-900">{booking.customer_name}</td>
                    <td className="px-6 py-3.5 text-gray-500">{booking.customer_phone}</td>
                    <td className="px-6 py-3.5 text-gray-600">{booking.vessels?.title ?? "-"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${booking.booking_type === "rent" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                        {booking.booking_type === "rent" ? "임대" : "구매문의"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[booking.status]}`}>
                        {statusLabel[booking.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                      예약/문의 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 빠른 메뉴 */}
        <div data-fade-in className="flex gap-3 flex-wrap">
          <Link href="/admin/vessels" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            선박 관리
          </Link>
          <Link href="/admin/bookings" className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
            예약 관리
          </Link>
        </div>
      </div>
    </div>
  );
}
