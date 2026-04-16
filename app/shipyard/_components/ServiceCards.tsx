import { Hammer, Sailboat, Wrench } from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "소형 선박 건조",
    desc: "인천에서 유일하게 소형 선박의 신조 건조를 이어가고 있습니다.",
  },
  {
    icon: Sailboat,
    title: "목선 수리",
    desc: "창업 초기부터 이어온 목선 수리. 오랜 경험을 바탕으로 한 현장 중심의 작업.",
  },
  {
    icon: Wrench,
    title: "철선 수리",
    desc: "목선에서 철선으로 전환된 시대에 맞춰, 소형 철선 수리까지 대응합니다.",
  },
];

export default function ServiceCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h2 className="text-gray-900 mb-2">주요 작업</h2>
      <p className="text-sm text-gray-400 mb-10">41년간 현장에서 쌓아온 기술</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
