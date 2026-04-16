import { Hammer, Sailboat, Wrench, ClipboardCheck } from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "소형 선박 신조 건조",
    desc: "어선, 작업선 등 소형 선박 신규 제작. 인천 연안부두에서 유일하게 소형선 건조를 이어가고 있습니다.",
  },
  {
    icon: Sailboat,
    title: "목선 수리·복원",
    desc: "1985년 창업 이래 이어온 목선 수리 노하우. 목재 교체, 방부 처리, 전체 복원까지 대응합니다.",
  },
  {
    icon: Wrench,
    title: "철선 선체 수리",
    desc: "선체 강판 교체, 파손부 용접 보수, 부식부 절삭·재시공. 어선·작업선 중심의 소형 철선 수리.",
  },
  {
    icon: ClipboardCheck,
    title: "정기 점검·유지보수",
    desc: "장기 거래 선주 대상 연례 점검과 긴급 보수. 40년 축적된 현장 경험으로 필요한 작업만 정직하게.",
  },
];

export default function ServiceCards() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="text-gray-900 mb-2">서비스</h2>
      <p className="text-sm text-gray-400 mb-10">1985년부터 인천 연안부두에서, 소형 선박의 건조와 수리를 이어오고 있습니다</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
