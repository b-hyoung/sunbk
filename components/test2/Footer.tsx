import Link from "next/link";
import { COMPANY } from "@/constants/company";

export default function Test2Footer() {
  return (
    <footer className="bg-[#001e42] text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 브랜드 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#09388a] flex items-center justify-center text-white font-bold text-sm">
                수연
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-none">{COMPANY.name}</div>
                <div className="text-white/40 text-[10px] tracking-widest uppercase leading-none mt-0.5">{COMPANY.nameEn}</div>
              </div>
            </div>
            <p className="text-white/40 leading-relaxed max-w-xs text-sm">
              15년 경력의 선박 전문 업체로 레저선, 어선, 화물선, 여객선 임대 및 판매 서비스를 제공합니다.
            </p>
          </div>

          {/* 🔗 바로가기 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">🔗 바로가기</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                { href: "/test2/vessels?type=rent", label: "⚓ 선박 임대" },
                { href: "/test2/vessels?type=sale", label: "🏷️ 선박 판매" },
                { href: "/test2/about", label: "📷 작업사진" },
                { href: "/test2/contact", label: "📍 오시는길" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors text-sm">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 🏢 사업자정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">🏢 사업자정보</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              <div><span className="text-white/30 text-xs">📧 이메일</span><br /><a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a></div>
              <div><span className="text-white/30 text-xs">🏠 상호명</span><br /><span>{COMPANY.name}</span></div>
              <div><span className="text-white/30 text-xs">📋 사업자번호</span><br /><span>{COMPANY.businessNumber}</span></div>
              <div><span className="text-white/30 text-xs">👤 대표자</span><br /><span>{COMPANY.representative}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-white/25">
          <p>© {COMPANY.copyrightYear} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
