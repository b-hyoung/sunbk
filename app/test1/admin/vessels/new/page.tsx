import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VesselForm from "@/components/admin/VesselForm";

export default function NewVesselPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/test1/admin/vessels" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ChevronLeft className="w-4 h-4" /> 선박 관리
          </Link>
          <h1 className="text-gray-900">선박 등록</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <VesselForm mode="create" />
      </div>
    </div>
  );
}
