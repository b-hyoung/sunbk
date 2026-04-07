import Link from "next/link";
import {
  Anchor, MapPin,
  CalendarDays, Tag, Camera,
  ExternalLink,
} from "lucide-react";
import { getNavLinks } from "@/constants/enums";
import { COMPANY } from "@/constants/company";

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
              {COMPANY.name}
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

          {/* 사업자정보 */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">사업자정보</h3>
            <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
              <span className="text-gray-500">이메일</span>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a>
              <span className="text-gray-500">상호명</span>
              <span>{COMPANY.name}</span>
              <span className="text-gray-500">사업자번호</span>
              <span>{COMPANY.businessNumber}</span>
              <span className="text-gray-500">대표자</span>
              <span>{COMPANY.representative}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-700">
          <p>© {COMPANY.copyrightYear} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
