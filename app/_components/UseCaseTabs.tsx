import Link from "next/link";
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
  const order = USE_CASE_ORDER.filter((u) =>
    groups.some((g) => g.useCase === u),
  );

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        {/* 용도별 세로 섹션 */}
        <div className="space-y-14 lg:space-y-20">
          {order.map((uc) => {
            const g = groups.find((gg) => gg.useCase === uc);
            if (!g) return null;
            const info = USE_CASES[uc];
            return (
              <div key={uc} data-stagger>
                {/* 섹션 타이틀 라인 */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl lg:text-4xl leading-none">
                      {info.icon}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-none">
                      {info.label}
                      <span className="ml-2 text-sm font-medium text-gray-400">
                        {g.total}척
                      </span>
                    </h3>
                  </div>
                  <Link
                    href={`/vessels?use=${uc}`}
                    className="group flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                  >
                    더보기
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {/* 정의문 */}
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed mb-2">
                  {info.definition}
                </p>

                {/* Context 카피 (실적사) */}
                <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 mb-6 lg:mb-7">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{info.context}</span>
                </div>

                {/* 카드 그리드 */}
                {g.vessels.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {g.vessels.map((v) => (
                      <UseCaseVesselCard key={v.id} vessel={v} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-300 border border-dashed border-gray-200 rounded-xl">
                    <Ship className="w-10 h-10 mb-3" />
                    <p className="text-sm text-gray-400">
                      이 작업에 사용 가능한 선박을 추가 중입니다.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
