"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── 선박 종류별 비율 (파이) ──
const vesselTypeData = [
  { name: "레저선", value: 2, color: "#3B82F6" },
  { name: "어선", value: 2, color: "#10B981" },
  { name: "화물선", value: 1, color: "#F59E0B" },
  { name: "여객선", value: 1, color: "#8B5CF6" },
];

// ── 거래 유형별 비율 (도넛) ──
const dealTypeData = [
  { name: "임대", value: 3, color: "#3B82F6" },
  { name: "판매", value: 3, color: "#001e42" },
  { name: "임대·판매", value: 1, color: "#06B6D4" },
];

// ── 월별 방문자 수 (바) ──
const monthlyVisitors = [
  { month: "1월", visitors: 320 },
  { month: "2월", visitors: 450 },
  { month: "3월", visitors: 580 },
  { month: "4월", visitors: 720 },
  { month: "5월", visitors: 650 },
  { month: "6월", visitors: 890 },
  { month: "7월", visitors: 1100 },
  { month: "8월", visitors: 980 },
  { month: "9월", visitors: 760 },
  { month: "10월", visitors: 640 },
  { month: "11월", visitors: 510 },
  { month: "12월", visitors: 430 },
];

// ── 월별 예약/문의 추이 (라인) ──
const monthlyBookings = [
  { month: "1월", 임대예약: 5, 구매문의: 3 },
  { month: "2월", 임대예약: 8, 구매문의: 4 },
  { month: "3월", 임대예약: 12, 구매문의: 6 },
  { month: "4월", 임대예약: 15, 구매문의: 8 },
  { month: "5월", 임대예약: 11, 구매문의: 7 },
  { month: "6월", 임대예약: 18, 구매문의: 10 },
  { month: "7월", 임대예약: 25, 구매문의: 12 },
  { month: "8월", 임대예약: 22, 구매문의: 9 },
  { month: "9월", 임대예약: 16, 구매문의: 8 },
  { month: "10월", 임대예약: 13, 구매문의: 6 },
  { month: "11월", 임대예약: 9, 구매문의: 5 },
  { month: "12월", 임대예약: 7, 구매문의: 4 },
];

const RADIAN = Math.PI / 180;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AdminCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 선박 종류별 비율 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">선박 종류별 비율</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={vesselTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={90}
              dataKey="value"
            >
              {vesselTypeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 거래 유형별 비율 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">거래 유형별 비율</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={dealTypeData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              labelLine={false}
              label={renderCustomLabel}
              dataKey="value"
            >
              {dealTypeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 방문자 수 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">월별 방문자 수</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyVisitors}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="visitors" name="방문자" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 예약/문의 추이 */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">월별 예약·문의 추이</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={monthlyBookings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
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
