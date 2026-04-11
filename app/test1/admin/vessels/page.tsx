export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { getAllVesselsFromStore } from "@/lib/admin-store";
import AdminVesselTable from "@/components/admin/AdminVesselTable";

export default function AdminVesselsPage() {
  const vessels = getAllVesselsFromStore();

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/test1/admin" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
                <ChevronLeft className="w-4 h-4" /> 대시보드
              </Link>
              <h1 className="text-gray-900">선박 관리</h1>
              <p className="text-gray-400 text-sm mt-0.5">총 {vessels.length}척</p>
            </div>
            <Link href="/test1/admin/vessels/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" /> 선박 등록
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AdminVesselTable vessels={vessels} />
      </div>
    </div>
  );
}
