"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, Anchor } from "lucide-react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getNavLinks } from "@/constants/enums";

gsap.registerPlugin(ScrollTrigger);

interface HeaderProps {
  basePath?: string;
}

export default function Header({ basePath }: HeaderProps) {
  const base = basePath ? `/${basePath}` : "";
  const navLinks = getNavLinks(basePath);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === base;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (!isHome) {
      // 홈 아닌 페이지: 항상 흰색
      gsap.set(header, {
        backgroundColor: "rgba(255,255,255,1)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrolled(true);
      return;
    }

    // 홈: 투명으로 시작
    gsap.set(header, { backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)", boxShadow: "none" });
    setScrolled(false);

    const trigger = ScrollTrigger.create({
      start: "top+=80 top",
      onEnter: () => {
        setScrolled(true);
        gsap.to(header, {
          backgroundColor: "rgba(255,255,255,1)",
          backdropFilter: "blur(12px)",
          duration: 0.35,
          ease: "power2.out",
          boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
        });
      },
      onLeaveBack: () => {
        setScrolled(false);
        gsap.to(header, {
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          duration: 0.35,
          ease: "power2.out",
          boxShadow: "none",
        });
      },
    });

    return () => trigger.kill();
  }, [isHome]);

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link
            href={base || "/"}
            className={`flex items-center gap-2 font-bold text-lg tracking-tight transition-colors duration-300 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            <Anchor className={`w-5 h-5 transition-colors duration-300 ${scrolled ? "text-blue-600" : "text-blue-400"}`} />
            수연선박
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  scrolled
                    ? "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 전화 CTA */}
          <a
            href="tel:010-0000-0000"
            className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${
              scrolled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white/15 hover:bg-white/25 text-white border border-white/30"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            010-0000-0000
          </a>

          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              scrolled ? "text-gray-500 hover:bg-gray-50" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className={`md:hidden border-t ${scrolled ? "bg-white border-gray-100" : "bg-black/60 border-white/10 backdrop-blur-md"}`}>
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
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
            ))}
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
