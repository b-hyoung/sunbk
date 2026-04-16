import Link from "next/link";
import { CheckCircle, Phone, ArrowLeft } from "lucide-react";

export default function BookingConfirmPage() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">접수 완료</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          담당자가 확인 후 연락드리겠습니다.<br />
          영업시간 평일 09:00–18:00
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="tel:010-0000-0000"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            010-0000-0000 바로 전화
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
