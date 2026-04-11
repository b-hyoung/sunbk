import Link from "next/link";
import { CheckCircle, Phone, ArrowLeft } from "lucide-react";

export default function Test3BookingConfirmPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <div className="bg-navy-dark py-12">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div className="border-l-4 border-ocean pl-5">
            <p className="text-ocean text-xs font-semibold uppercase tracking-wider mb-1">CONFIRM</p>
            <h1 className="text-white text-2xl font-bold">접수 완료</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-20">
        <div className="border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 bg-ocean/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-ocean" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">예약·문의가 접수되었습니다</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            담당자가 확인 후 빠른 시간 내에 연락드리겠습니다.
          </p>
          <p className="text-gray-400 text-xs mb-10">영업시간 평일 09:00 – 18:00</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:010-0000-0000"
              className="inline-flex items-center justify-center gap-2 bg-ocean hover:bg-ocean-hover text-white px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              010-0000-0000
            </a>
            <Link
              href="/test3/vessels"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-600 px-8 py-3.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              선박 목록으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
