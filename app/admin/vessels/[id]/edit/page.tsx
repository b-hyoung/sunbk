import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getVesselFromStore } from "@/lib/admin-store";
import VesselForm from "@/components/admin/VesselForm";

export default async function EditVesselPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vessel = getVesselFromStore(id);
  if (!vessel) notFound();

  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/admin" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ChevronLeft className="w-4 h-4" /> 선박 관리
          </Link>
          <h1 className="text-gray-900">{vessel.title} 수정</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <VesselForm vessel={vessel} mode="edit" />
      </div>
    </div>
  );
}
