import Link from "next/link";
import {
  Anchor,
  MapPin,
  Ship,
  Wrench,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { getNavLinks } from "@/constants/enums";
import { COMPANY } from "@/constants/company";

const navIcons: Record<string, React.ElementType> = {
  "선박 임대·판매": Ship,
  "작업현장": Wrench,
  "회사소개": MapPin,
  "협력사": Briefcase,
};

export default function Footer() {
  const navLinks = getNavLinks();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 브랜드 */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-bold text-white text-base mb-4"
            >
              <Anchor className="w-4 h-4 text-blue-400" />
              {COMPANY.name}
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              인천 연안부두 선박 임대·판매 전문. 해상측량·해상공사 현장에
              맞는 통선·작업선을 제안해드립니다.
            </p>
          </div>

          {/* 바로가기 */}
          <div>
            <h3 className="flex items-center gap-1.5 text-white text-base font-bold mb-4">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              바로가기
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const Icon = navIcons[link.label];
                const hasChildren = !!link.children?.length;

                if (hasChildren) {
                  return (
                    <li key={link.label}>
                      <span className="flex items-center gap-1.5 text-sm py-1 text-gray-300 font-medium">
                        {Icon && (
                          <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        )}
                        {link.label}
                      </span>
                      <ul className="ml-5 mt-1 space-y-1">
                        {link.children!
                          .filter((c) => c.href !== "#")
                          .map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="text-xs text-gray-500 hover:text-white transition-colors"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm py-1 hover:text-white transition-colors"
                    >
                      {Icon && (
                        <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
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
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm items-baseline">
              <dt className="text-gray-500">상호명</dt>
              <dd>{COMPANY.name}</dd>
              <dt className="text-gray-500">대표자</dt>
              <dd>{COMPANY.representative}</dd>
              <dt className="text-gray-500">사무실</dt>
              <dd>{COMPANY.address}</dd>
              <dt className="text-gray-500">정박지</dt>
              <dd>{COMPANY.berth}</dd>
              <dt className="text-gray-500">전화</dt>
              <dd>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {COMPANY.phone}
                </a>
              </dd>
            </dl>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-700">
          <p>
            © {COMPANY.copyrightYear} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
