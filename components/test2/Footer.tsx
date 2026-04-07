import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Test2Footer() {
  return (
    <footer className="bg-[#001e42] text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* 브랜드 */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#09388a] flex items-center justify-center text-white font-bold text-sm">
              수연
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">수연선박</div>
              <div className="text-[#09388a] text-[10px] tracking-widest uppercase leading-none mt-0.5 brightness-150">Ship Trading Co.</div>
            </div>
          </div>
          <p className="text-white/40 leading-relaxed max-w-xs text-sm">
            15년 경력의 선박 전문 업체로 레저선, 어선, 화물선, 여객선 임대 및 판매 서비스를 제공합니다.
          </p>
        </div>

        {/* 빠른 링크 */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">선박 매물</h4>
          <ul className="space-y-3">
            {[
              { href: "/test2/vessels", label: "전체 선박" },
              { href: "/test2/vessels?type=rent", label: "임대 선박" },
              { href: "/test2/vessels?type=sale", label: "판매 선박" },
              { href: "/test2/vessels?vessel_type=레저선", label: "레저선" },
              { href: "/test2/vessels?vessel_type=어선", label: "어선" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors text-sm">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 연락처 */}
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">연락처</h4>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#09388a] brightness-150 shrink-0 mt-0.5" />
              <span>010-0000-0000</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#09388a] brightness-150 shrink-0 mt-0.5" />
              <span>info@sooyeon.com</span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#09388a] brightness-150 shrink-0 mt-0.5" />
              <span>인천광역시 중구 항동</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/30 text-xs">© 2024 수연선박. All rights reserved.</p>
          <p className="text-white/30 text-xs">사업자등록번호: 000-00-00000</p>
        </div>
      </div>
    </footer>
  );
}
