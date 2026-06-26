"use client";

import Link from "next/link";

interface Props {
  currentType?: string;
  currentCls?: string;
}

const items = [
  { label: "전체", value: "" },
  { label: "임대", value: "rent" },
  { label: "판매", value: "sale" },
];

export default function TradeTypeBar({ currentType, currentCls }: Props) {
  const base = "/vessels";

  function hrefFor(typeValue: string) {
    const params = new URLSearchParams();
    if (typeValue) params.set("type", typeValue);
    if (currentCls) params.set("cls", currentCls);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  return (
    <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1">
      {items.map((it) => {
        const isOn = (currentType ?? "") === it.value;
        return (
          <Link
            key={it.value || "all"}
            href={hrefFor(it.value)}
            aria-current={isOn ? "page" : undefined}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              isOn
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
