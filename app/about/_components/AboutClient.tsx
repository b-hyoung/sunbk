import Link from "next/link";
import {
  Phone,
  Anchor,
  MapPin,
  Clock,
  Car,
  Ship as ShipIcon,
} from "lucide-react";
import { COMPANY } from "@/constants/company";
import NavButtons from "@/components/NavButtons";
import HeroVideo from "@/components/layout/BackgroundVideo";

const contactInfo = [
  ...COMPANY.contacts.map((c) => ({
    icon: Phone,
    label: c.role,
    value: `${c.name} ${c.phone}`,
    href: `tel:${c.phone}`,
  })),
  { icon: Clock, label: "운영시간", value: COMPANY.hours, href: null },
];

const directions = [
  { icon: Car, title: "자가용", steps: COMPANY.directions.car },
  { icon: ShipIcon, title: "대중교통", steps: COMPANY.directions.publicTransport },
];

export default function AboutClient() {
  return (
    <div className="bg-white">
      {/* 히어로 */}
      <section className="relative bg-gray-900 py-20 min-h-[320px] overflow-hidden">
        <HeroVideo />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-blue-400 text-sm font-semibold tracking-widest mb-3">
            회사소개
          </p>
          <h1 className="text-white font-bold mb-4 max-w-xl leading-tight">
            {COMPANY.name}
          </h1>
          <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-xl">
            선박 임대·판매 전문기업. 신뢰와 전문성으로 바다 위의 파트너가 되겠습니다.
          </p>
        </div>
      </section>

      {/* 회사 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          <div>
            <h2 className="text-gray-900 mb-4">회사 소개</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              {COMPANY.name}은 인천을 기반으로 선박 임대 및 판매 서비스를 제공하는 전문 기업입니다.
              다년간의 경험과 노하우를 바탕으로 고객의 목적에 맞는 최적의 선박을 제안해 드립니다.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Anchor className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">대표자</p>
                  <p className="text-gray-500">{COMPANY.representative}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">사무실 주소</p>
                  <p className="text-gray-500">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Anchor className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">정박지</p>
                  <p className="text-gray-500">{COMPANY.berth}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">운영시간</p>
                  <p className="text-gray-500">{COMPANY.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 작업현장 바로가기 */}
          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-gray-900 font-bold text-lg mb-3">작업현장 사진</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                수연선박의 정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              >
                작업현장 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 오시는길 — 지도 + 연락처 */}
      <section id="location" className="bg-gray-50 border-t border-gray-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-gray-900 mb-2">오시는길</h2>
          <p className="text-gray-500 text-sm mb-10">
            {COMPANY.addressShort}에 위치한 {COMPANY.name}을 방문해주세요.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* 지도 */}
            <div className="lg:col-span-2">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
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
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>{COMPANY.address} {COMPANY.name}</p>
              </div>
            </div>

            {/* 연락처 */}
            <div className="space-y-6 bg-white border border-gray-100 rounded-xl p-6 lg:p-7">
              <h3 className="text-gray-900 text-lg font-bold">연락처</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <info.icon className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
                        >
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
        </div>
      </section>

      {/* 찾아오시는 방법 */}
      <section className="py-16 lg:py-20">
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
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
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
