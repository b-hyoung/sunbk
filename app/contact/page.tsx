import { Phone, Mail, MapPin, Clock, Car, Ship as ShipIcon } from "lucide-react";
import { COMPANY } from "@/constants/company";
import NavButtons from "@/components/NavButtons";
import HeroVideo from "@/components/layout/BackgroundVideo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `오시는길 - ${COMPANY.name}`,
  description: `${COMPANY.address} ${COMPANY.name} 오시는길 안내`,
};

const contactInfo = [
  { icon: Phone, label: "전화", value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
  { icon: Phone, label: "FAX", value: COMPANY.fax, href: null },
  { icon: Mail, label: "이메일", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { icon: Clock, label: "운영시간", value: COMPANY.hours, href: null },
];

const directions = [
  { icon: Car, title: "자가용", steps: COMPANY.directions.car },
  { icon: ShipIcon, title: "대중교통", steps: COMPANY.directions.publicTransport },
];

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-28 overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest mb-4">
            오시는길
          </p>
          <h1 className="text-white font-bold mb-5 max-w-xl leading-tight">
            오시는길
          </h1>
          <p className="text-white/60 text-lg max-w-lg leading-relaxed">
            {COMPANY.addressShort}에 위치한 {COMPANY.name}을 방문해주세요.
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
                src={COMPANY.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${COMPANY.name} 위치`}
              />
            </div>
            <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p>{COMPANY.address} {COMPANY.name}</p>
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

            <a
              href={`tel:${COMPANY.phone}`}
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
                {d.title === "자가용" && <NavButtons variant="blue" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
