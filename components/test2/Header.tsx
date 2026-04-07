"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown, Search } from "lucide-react";

const navLinks = [
  {
    label: "선박 매물",
    href: "/test2/vessels",
    children: [
      { href: "/test2/vessels?type=rent", label: "임대 선박" },
      { href: "/test2/vessels?type=sale", label: "판매 선박" },
      { href: "/test2/vessels?vessel_type=레저선", label: "레저선" },
      { href: "/test2/vessels?vessel_type=어선", label: "어선" },
      { href: "/test2/vessels?vessel_type=화물선", label: "화물선" },
    ],
  },
  { label: "서비스", href: "/test2/vessels" },
  { label: "회사 소개", href: "/test2/about" },
  { label: "문의하기", href: "/test2/contact" },
];

export default function Test2Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E6E7E9]">
      {/* 상단 파란 띠 */}
      <div className="bg-[#09388a] hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-9">
          <span className="text-white/60 text-xs">수연선박 | 선박 임대·판매 전문기업</span>
          <div className="flex items-center gap-6">
            <a href="tel:010-0000-0000" className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />
              010-0000-0000
            </a>
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-[68px]">
          {/* 로고 */}
          <Link href="/test2" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#09388a] flex items-center justify-center text-white font-bold text-sm">
              수연
            </div>
            <div>
              <div className="text-[#001e42] font-bold text-lg leading-none tracking-tight">수연선박</div>
              <div className="text-[#09388a] text-[10px] tracking-widest uppercase leading-none mt-0.5">Ship Trading Co.</div>
            </div>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center h-full">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative h-full flex items-center group"
                onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-5 h-full text-sm text-[#001e42] hover:text-[#09388a] font-medium transition-colors border-b-2 border-transparent hover:border-[#09388a]"
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3 h-3 mt-0.5 opacity-50" />}
                </Link>

                {link.children && openDropdown === link.label && (
                  <div className="absolute top-full left-0 w-48 bg-white border border-[#E6E7E9] shadow-lg z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-5 py-3 text-sm text-[#001e42] hover:text-[#09388a] hover:bg-[#F3F3F3] border-b border-[#E6E7E9] last:border-0 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-[#001e42]/50 hover:text-[#09388a] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <a
              href="tel:010-0000-0000"
              className="bg-[#09388a] hover:bg-[#072d6e] text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              무료 상담
            </a>
          </div>

          <button
            className="md:hidden p-2 text-[#001e42]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E6E7E9]">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block px-6 py-4 text-sm text-[#001e42] font-medium border-b border-[#E6E7E9] hover:bg-[#F3F3F3] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-10 py-3 text-sm text-[#001e42]/60 border-b border-[#E6E7E9] hover:bg-[#F3F3F3] hover:text-[#09388a] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="px-6 py-4">
            <a href="tel:010-0000-0000" className="flex items-center gap-2 text-sm font-semibold text-[#09388a]">
              <Phone className="w-4 h-4" />
              010-0000-0000
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
