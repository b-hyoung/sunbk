import { Phone, Mail, MapPin, Clock, Car, Ship as ShipIcon } from "lucide-react";
import { COMPANY } from "@/constants/company";
import NavButtons from "@/components/NavButtons";
import Link from "next/link";
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

export default function Test3ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 다크 헤더 */}
      <div className="bg-[#0a1628] py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/test3" className="hover:text-white/70 transition-colors">메인</Link>
            <span>〉</span>
            <span className="text-white/70">오시는길</span>
          </nav>
          <div className="border-l-4 border-[#036EB8] pl-5">
            <p className="text-[#036EB8] text-[10px] font-bold tracking-widest uppercase mb-2">LOCATION</p>
            <h1 className="text-white text-2xl font-bold mb-2">오시는길</h1>
            <p className="text-white/50 text-sm">
              {COMPANY.addressShort}에 위치한 {COMPANY.name}을 방문해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 지도 + 연락처 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#036EB8]">지도</h2>
              <hr className="border-t-2 border-[#036EB8] w-10 mt-2" />
            </div>
            <div className="overflow-hidden border border-gray-200">
              <iframe
                src={COMPANY.mapEmbedUrl}
                width="100%"
                height="420"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${COMPANY.name} 위치`}
              />
            </div>
            <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-[#036EB8] shrink-0 mt-0.5" />
              <p>{COMPANY.address}</p>
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#036EB8]">연락처</h2>
              <hr className="border-t-2 border-[#036EB8] w-10 mt-2" />
            </div>
            <div className="border border-gray-200 p-6 space-y-5 mb-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3">
                  <info.icon className="w-4 h-4 text-[#036EB8] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm font-semibold text-gray-800 hover:text-[#036EB8] transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`tel:${COMPANY.phone}`}
              className="flex items-center justify-center gap-2 w-full bg-[#036EB8] hover:bg-[#0257a0] text-white py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              전화 문의하기
            </a>
          </div>
        </div>
      </section>

      {/* 찾아오시는 방법 */}
      <section className="bg-gray-50 border-t border-gray-200 py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#036EB8]">찾아오시는 방법</h2>
            <hr className="border-t-2 border-[#036EB8] w-10 mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directions.map((d) => (
              <div key={d.title} className="bg-white border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <d.icon className="w-4 h-4 text-[#036EB8]" />
                  <h3 className="font-bold text-gray-900 text-sm">{d.title}</h3>
                </div>
                <ol className="space-y-3">
                  {d.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <span className="shrink-0 w-5 h-5 bg-[#036EB8] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                {d.title === "자가용" && <NavButtons variant="navy" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
