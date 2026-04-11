// components/admin/AdminVesselTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Vessel } from "@/lib/supabase";

const typeLabel: Record<string, string> = { rent: "임대", sale: "판매", both: "임대·판매" };
const statusLabel: Record<string, string> = { active: "운영중", inactive: "비활성", sold: "판매완료" };
const statusColor: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-gray-100 text-gray-500",
  sold: "bg-red-50 text-red-600",
};

interface AdminVesselTableProps {
  vessels: Vessel[];
}

export default function AdminVesselTable({ vessels: initial }: AdminVesselTableProps) {
  const router = useRouter();
  const [vessels, setVessels] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/vessels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVessels((prev) => prev.filter((v) => v.id !== id));
        router.refresh();
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <p className="text-xs text-gray-400 px-4 py-2 md:hidden">← 좌우로 스크롤하세요</p>
        <table className="w-full text-sm">
          <caption className="sr-only">선박 관리 목록</caption>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-16">사진</th>
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">선박명</th>
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">선종</th>
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">거래</th>
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">가격</th>
              <th scope="col" className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide">상태</th>
              <th scope="col" className="text-right px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vessels.map((v) => {
              const primary = v.vessel_images?.find((img) => img.is_primary) ?? v.vessel_images?.[0];
              return (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors relative">
                  <td className="px-6 py-3">
                    <div className="relative w-12 h-9 rounded overflow-hidden bg-gray-100">
                      {primary ? (
                        <Image src={primary.url} alt="" fill className="object-cover" sizes="48px" unoptimized />
                      ) : (
                        <span className="flex items-center justify-center h-full text-gray-300 text-xs">🚢</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">{v.title}</td>
                  <td className="px-6 py-3 text-gray-500">{v.vessel_type}</td>
                  <td className="px-6 py-3 text-gray-500">{typeLabel[v.type]}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {v.rent_price_per_day ? `${v.rent_price_per_day.toLocaleString()}원/일` : ""}
                    {v.rent_price_per_day && v.sale_price ? " / " : ""}
                    {v.sale_price ? (v.sale_price >= 100000000 ? `${(v.sale_price / 100000000).toFixed(1)}억` : `${Math.floor(v.sale_price / 10000).toLocaleString()}만`) : ""}
                    {!v.rent_price_per_day && !v.sale_price ? "-" : ""}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[v.status]}`}>
                      {statusLabel[v.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/test1/admin/vessels/${v.id}/edit`}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmId(v.id)}
                        disabled={deleting === v.id}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {confirmId === v.id && (
                      <div className="absolute inset-0 bg-white/95 flex items-center justify-center gap-3 z-10">
                        <span className="text-sm text-gray-600">삭제하시겠습니까?</span>
                        <button
                          onClick={() => { handleDelete(v.id); setConfirmId(null); }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          취소
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {vessels.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                  등록된 선박이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
