"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Anchor, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getNavLinks } from "@/constants/enums";

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const navLinks = getNavLinks();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(true); // 기본값 true → 흰색 배경으로 시작
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  const isHome = pathname === "/";

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (!isHome) {
      // 홈 아닌 페이지: 항상 흰색 배경
      gsap.set(header, {
        backgroundColor: "rgba(255,255,255,1)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrolled(true);
      return;
    }

    // 홈: 투명으로 시작
    gsap.set(header, { backgroundColor: "rgba(0,0,0,0)", boxShadow: "none" });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrolled(false);

    const trigger = ScrollTrigger.create({
      start: "top+=80 top",
      onEnter: () => {
        setScrolled(true);
        gsap.to(header, {
          backgroundColor: "rgba(255,255,255,1)",
          duration: 0.35,
          ease: "power2.out",
          boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
        });
      },
      onLeaveBack: () => {
        setScrolled(false);
        gsap.to(header, {
          backgroundColor: "rgba(0,0,0,0)",
          duration: 0.35,
          ease: "power2.out",
          boxShadow: "none",
        });
      },
    });

    return () => trigger.kill();
  }, [isHome]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (menuOpen && !scrolled) {
      gsap.to(header, { backgroundColor: "rgba(15,23,42,0.98)", duration: 0.2 });
    } else if (!scrolled) {
      gsap.to(header, { backgroundColor: "rgba(0,0,0,0)", duration: 0.2 });
    }
  }, [menuOpen, scrolled]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: isHome ? undefined : "rgba(255,255,255,1)", boxShadow: isHome ? undefined : "0 1px 0 rgba(0,0,0,0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link
            href="/"
            className={`flex items-center gap-2 font-bold text-xl tracking-tight transition-colors duration-300 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            <Anchor className={`w-5 h-5 transition-colors duration-300 ${scrolled ? "text-blue-600" : "text-blue-400"}`} />
            수연선박
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                currentUrl === link.href ||
                currentUrl.startsWith(link.href + "&") ||
                link.children?.some((c) => currentUrl === c.href || currentUrl.startsWith(c.href));

              // 드롭다운 메뉴
              if (link.children) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`px-3.5 py-2 rounded-lg text-base transition-colors duration-300 flex items-center gap-1 ${
                        isActive
                          ? scrolled
                            ? "text-blue-600 font-semibold"
                            : "text-white font-semibold"
                          : scrolled
                            ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full right-0 pt-1 w-48">
                        <div className="bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-base transition-colors duration-300 ${
                    isActive
                      ? scrolled
                        ? "text-blue-600 font-semibold"
                        : "text-white font-semibold"
                      : scrolled
                        ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 전화 CTA */}
          <a
            href="tel:010-0000-0000"
            className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-300 ${
              scrolled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/30"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            010-0000-0000
          </a>

          <button
            className={`md:hidden p-2.5 w-11 h-11 flex items-center justify-center rounded-lg transition-colors duration-300 ${
              scrolled ? "text-gray-500 hover:bg-gray-50" : "text-white hover:bg-white/10"
            }`}
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
        <div className={`md:hidden border-t ${scrolled ? "bg-white border-gray-100" : "bg-slate-900/95 border-white/10"}`}>
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div key={link.label}>
                    <div className={`px-5 py-3 text-sm font-medium ${scrolled ? "text-gray-900" : "text-white"}`}>
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block pl-10 pr-5 py-2.5 text-sm transition-colors ${
                          scrolled ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50" : "text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        ↳ {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-3 text-sm transition-colors ${
                    scrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className={`px-5 py-3 border-t mt-1 ${scrolled ? "border-gray-100" : "border-white/10"}`}>
              <a href="tel:010-0000-0000" className={`flex items-center gap-2 text-sm font-semibold ${scrolled ? "text-blue-600" : "text-blue-300"}`}>
                <Phone className="w-4 h-4" />
                010-0000-0000
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
