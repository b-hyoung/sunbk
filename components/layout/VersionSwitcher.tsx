"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const versions = [
  { key: "test1", label: "Test 1", href: "/test1" },
  { key: "test2", label: "Test 2", href: "/test2" },
  { key: "test3", label: "Test 3", href: "/test3" },
];

export default function VersionSwitcher() {
  const pathname = usePathname();

  // 현재 어느 버전인지 감지
  const current = versions.find((v) => pathname.startsWith(v.href))?.key ?? "";

  // 현재 경로에서 버전 prefix만 교체
  const getSwitchedPath = (targetHref: string, targetKey: string) => {
    // /test1/vessels?type=sale → /test2/vessels?type=sale
    const currentPrefix = current ? `/${current}` : "";
    if (currentPrefix && pathname.startsWith(currentPrefix)) {
      const rest = pathname.slice(currentPrefix.length); // /vessels?type=sale
      return `${targetHref}${rest}`;
    }
    return targetHref;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gray-950 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-8">
        <span className="text-gray-600">버전 선택</span>
        <div className="flex items-center gap-1">
          {versions.map((v) => (
            <Link
              key={v.key}
              href={getSwitchedPath(v.href, v.key)}
              className={`px-3 py-1 rounded-sm transition-colors ${
                current === v.key
                  ? "bg-white/10 text-white font-medium"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
