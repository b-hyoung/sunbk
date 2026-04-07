import Link from "next/link";
import {
  Anchor, Phone, Mail, MapPin,
  CalendarDays, Tag, Camera,
  ExternalLink,
} from "lucide-react";
import { getNavLinks } from "@/constants/enums";

interface FooterProps {
  basePath?: string;
}

const navIcons: Record<string, React.ElementType> = {
  "선박 임대": CalendarDays,
  "선박 판매": Tag,
  "작업사진": Camera,
  "오시는길": MapPin,
};

export default function Footer({ basePath }: FooterProps) {
  const base = basePath ? `/${basePath}` : "/";
  const navLinks = getNavLinks(basePath);

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 브랜드 */}
          <div>
            <Link href={base} className="inline-flex items-center gap-2 font-bold text-white text-base mb-4">
              <Anchor className="w-4 h-4 text-blue-400" />
              수연선박
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              국내 최고 수준의 선박 임대·판매 전문 업체. 고객의 목적에 맞는 최적의 선박을 제안해드립니다.
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="flex items-center gap-1.5 text-white text-base font-bold mb-4">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              바로가기
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link) => {
                const Icon = navIcons[link.label];
                return (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
                      {Icon && <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="flex items-center gap-1.5 text-white text-base font-bold mb-4">
              <Phone className="w-4 h-4 text-blue-400" />
              연락처
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:010-0000-0000" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  010-0000-0000
                </a>
              </li>
              <li>
                <a href="mailto:info@sooyeonship.com" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  info@sooyeonship.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                부산광역시 영도구 해양로 000
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>© 2025 수연선박. All rights reserved.</p>
          <p>사업자등록번호: 000-00-00000 | 대표: 홍길동</p>
        </div>
      </div>
    </footer>
  );
}
