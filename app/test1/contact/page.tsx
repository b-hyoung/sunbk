import { Phone, Mail, MapPin, Clock, Car, Ship as ShipIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오시는길 - 수연선박",
  description: "부산광역시 영도구 해양로 수연선박 오시는길 안내",
};

const contactInfo = [
  { icon: Phone, label: "전화", value: "010-0000-0000", href: "tel:010-0000-0000" },
  { icon: Phone, label: "FAX", value: "051-000-0000", href: null },
  { icon: Mail, label: "이메일", value: "info@sooyeonship.com", href: "mailto:info@sooyeonship.com" },
  { icon: Clock, label: "운영시간", value: "평일 09:00 ~ 18:00 (주말·공휴일 휴무)", href: null },
];

const directions = [
  {
    icon: Car,
    title: "자가용",
    steps: [
      "부산항대교 방면 → 영도대교 방향 진입",
      "영도대교 건너 해양로 직진 약 1.5km",
      "수연선박 간판 확인 후 좌회전",
      "전용 주차장 이용 가능 (무료)",
    ],
  },
  {
    icon: ShipIcon,
    title: "대중교통",
    steps: [
      "지하철 1호선 남포역 6번 출구 → 영도대교 방향 도보 5분",
      "버스 6, 9, 82, 85번 → 해양로입구 정류장 하차",
      "정류장에서 도보 약 3분",
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Location
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            오시는길
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            부산 영도구에 위치한 수연선박을 방문해주세요.
          </p>
        </div>
      </section>

      {/* 지도 + 연락처 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3262.811!2d129.0376!3d35.0786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z67aA7IKw6rSR7Jet7IucIOyYgeuPhOq1rCDtlbTslpHroZw!5e0!3m2!1sko!2skr!4v1700000000000"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="수연선박 위치"
              />
            </div>
            <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>부산광역시 영도구 해양로 000 수연선박</p>
            </div>
          </div>

          {/* 연락처 */}
          <div className="space-y-6">
            <h2 className="text-gray-900 text-lg font-bold">연락처</h2>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <info.icon className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 전화 CTA */}
            <a
              href="tel:010-0000-0000"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              전화 문의하기
            </a>
          </div>
        </div>
      </section>

      {/* 찾아오시는 방법 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 mb-10">찾아오시는 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directions.map((d) => (
              <div key={d.title} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <d.icon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{d.title}</h3>
                </div>
                <ol className="space-y-2.5">
                  {d.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
