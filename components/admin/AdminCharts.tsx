"use client";

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── 월별 방문자 수 (바) ──
const monthlyVisitors = [
  { month: "1", visitors: 320 },
  { month: "2", visitors: 450 },
  { month: "3", visitors: 580 },
  { month: "4", visitors: 720 },
  { month: "5", visitors: 650 },
  { month: "6", visitors: 890 },
  { month: "7", visitors: 1100 },
  { month: "8", visitors: 980 },
  { month: "9", visitors: 760 },
  { month: "10", visitors: 640 },
  { month: "11", visitors: 510 },
  { month: "12", visitors: 430 },
];

// ── 월별 예약/문의 추이 (라인) ──
const monthlyBookings = [
  { month: "1", 임대예약: 5, 구매문의: 3 },
  { month: "2", 임대예약: 8, 구매문의: 4 },
  { month: "3", 임대예약: 12, 구매문의: 6 },
  { month: "4", 임대예약: 15, 구매문의: 8 },
  { month: "5", 임대예약: 11, 구매문의: 7 },
  { month: "6", 임대예약: 18, 구매문의: 10 },
  { month: "7", 임대예약: 25, 구매문의: 12 },
  { month: "8", 임대예약: 22, 구매문의: 9 },
  { month: "9", 임대예약: 16, 구매문의: 8 },
  { month: "10", 임대예약: 13, 구매문의: 6 },
  { month: "11", 임대예약: 9, 구매문의: 5 },
  { month: "12", 임대예약: 7, 구매문의: 4 },
];

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 월별 방문자 수 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">월별 방문자 수</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyVisitors}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={0} unit="월" />
            <YAxis tick={{ fontSize: 11 }} width={40} />
            <Tooltip />
            <Bar dataKey="visitors" name="방문자" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 예약/문의 추이 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">월별 예약·문의 추이</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={0} unit="월" />
            <YAxis tick={{ fontSize: 11 }} width={30} />
            <Tooltip />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="임대예약" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="구매문의" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
