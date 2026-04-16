import { Hammer, Wrench, PaintBucket, Cog } from "lucide-react";

const services = [
  {
    icon: Hammer,
    title: "신조 건조",
    desc: "신규 선박 설계·제작. 어선, 작업선, 레저선 등 용도별 맞춤 건조.",
  },
  {
    icon: Wrench,
    title: "선체·FRP 수리",
    desc: "파손부 복원, FRP 보강, 강판 교체. 침수·충돌 손상 전문.",
  },
  {
    icon: PaintBucket,
    title: "도장·방오 작업",
    desc: "선체 도장, 방오도료 시공, 부식 방지. 정기 도장 주기 관리.",
  },
  {
    icon: Cog,
    title: "기관·설비 정비",
    desc: "엔진, 조타, 전기설비 점검·수리. 긴급 출동 대응 가능.",
  },
];

export default function ServiceCards() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="text-gray-900 mb-2">서비스</h2>
      <p className="text-sm text-gray-400 mb-10">건조부터 수리까지, 한 곳에서 해결합니다</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="border border-gray-100 rounded-2xl p-6 hover:border-gray-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
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
