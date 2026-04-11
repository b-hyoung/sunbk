"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const navLinks = [
  {
    label: "선박 매물",
    href: "/test2/vessels",
    children: [
      { href: "/test2/vessels?type=rent", label: "선박 임대" },
      { href: "/test2/vessels?type=sale", label: "선박 판매" },
    ],
  },
  { label: "작업현장", href: "/test2/work" },
  { label: "회사소개", href: "/test2/about" },
  { label: "오시는길", href: "/test2/contact" },
];

export default function Test2Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  const isActive = (href: string) => currentUrl === href || currentUrl.startsWith(href + "&");

  return (
    <header className="fixed top-8 left-0 right-0 z-50 bg-white border-b border-border-light">
      {/* 상단 파란 띠 */}
      <div className="bg-navy-light hidden md:block">
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
            <div className="w-9 h-9 bg-navy-light flex items-center justify-center text-white font-bold text-sm">
              수연
            </div>
            <div>
              <div className="text-navy font-bold text-lg leading-none tracking-tight">수연선박</div>
              <div className="text-navy-light text-[10px] tracking-widest uppercase leading-none mt-0.5">Ship Trading Co.</div>
            </div>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center h-full">
            {navLinks.map((link) => {
              const active = isActive(link.href) || link.children?.some((c) => isActive(c.href));
              return (
                <div
                  key={link.label}
                  className="relative h-full flex items-center group"
                  onMouseEnter={() => link.children && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-5 h-full text-sm font-medium transition-colors border-b-2 ${
                      active
                        ? "text-navy-light border-navy-light"
                        : "text-navy hover:text-navy-light border-transparent hover:border-navy-light"
                    }`}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3 h-3 mt-0.5 opacity-50" />}
                  </Link>

                  {link.children && openDropdown === link.label && (
                    <div className="absolute top-full left-0 w-48 bg-white border border-border-light shadow-lg z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-5 py-3 text-sm border-b border-border-light last:border-0 transition-colors ${
                            isActive(child.href)
                              ? "text-navy-light bg-surface font-semibold"
                              : "text-navy hover:text-navy-light hover:bg-surface"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 우측 액션 */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:010-0000-0000"
              className="bg-navy-light hover:bg-navy-hover text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              무료 상담
            </a>
          </div>

          <button
            className="md:hidden p-2.5 w-11 h-11 flex items-center justify-center text-navy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border-light" role="menu">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block px-6 py-4 text-sm text-navy font-medium border-b border-border-light hover:bg-surface transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
              {link.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block px-10 py-3 text-sm text-navy/60 border-b border-border-light hover:bg-surface hover:text-navy-light transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="px-6 py-4">
            <a href="tel:010-0000-0000" className="flex items-center gap-2 text-sm font-semibold text-navy-light">
              <Phone className="w-4 h-4" />
              010-0000-0000
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
