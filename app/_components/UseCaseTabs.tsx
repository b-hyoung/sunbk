"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Briefcase, Ship } from "lucide-react";
import type { Vessel, UseCase } from "@/lib/supabase";
import { USE_CASES, USE_CASE_ORDER } from "@/lib/vessel-types";
import UseCaseVesselCard from "./UseCaseVesselCard";

interface Group {
  useCase: UseCase;
  vessels: Vessel[];
  total: number;
}

interface Props {
  groups: Group[];
}

export default function UseCaseTabs({ groups }: Props) {
  const order = USE_CASE_ORDER.filter((u) => groups.some((g) => g.useCase === u));
  const [active, setActive] = useState<UseCase>(order[0] ?? "survey");
  const current = groups.find((g) => g.useCase === active);
  const info = USE_CASES[active];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        {/* 섹션 헤더 */}
        <div className="flex items-end justify-between mb-7 lg:mb-8">
          <div>
            <p
              data-fade-up
              className="text-blue-600 text-xs font-semibold tracking-widest uppercase mb-2"
            >
              우리가 잘하는 일
            </p>
            <h2
              data-fade-up
              className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight"
            >
              용도별 추천 선박
            </h2>
          </div>
          <Link
            href="/vessels"
            data-fade-in
            className="group hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
          >
            전체 선박 보기
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 탭 바 */}
        <div
          data-fade-up
          className="inline-flex bg-gray-100 p-1 rounded-xl gap-1 mb-5"
        >
          {order.map((uc) => {
            const g = groups.find((gg) => gg.useCase === uc);
            const isOn = uc === active;
            const u = USE_CASES[uc];
            return (
              <button
                key={uc}
                type="button"
                onClick={() => setActive(uc)}
                aria-pressed={isOn}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isOn
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span>{u.icon}</span>
                <span>{u.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isOn
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {g?.total ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Context 스트립 */}
        <div
          data-fade-in
          className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6 text-sm text-gray-600"
        >
          <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
          <span>{info.context}</span>
        </div>

        {/* 카드 그리드 / 빈 상태 */}
        {current && current.vessels.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {current.vessels.map((v) => (
              <div key={v.id} data-stagger>
                <UseCaseVesselCard vessel={v} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <Ship className="w-10 h-10 mb-3" />
            <p className="text-sm text-gray-400">
              이 용도의 선박을 추가 중입니다.
            </p>
          </div>
        )}

        {/* 하단 보조 링크 */}
        {current && current.total > current.vessels.length && (
          <div className="mt-7 text-center">
            <Link
              href={`/vessels?use=${active}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {info.label} 선박 모두 보기 ({current.total}척)
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
