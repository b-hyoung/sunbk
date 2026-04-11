import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/constants/company";
import NavButtons from "@/components/NavButtons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `오시는길 - ${COMPANY.name}`,
  description: `${COMPANY.address} ${COMPANY.name} 오시는길 안내`,
};

const contactCards = [
  { icon: Phone, label: "전화", value: COMPANY.phone, href: `tel:${COMPANY.phone}`, emoji: "📞" },
  { icon: Phone, label: "FAX", value: COMPANY.fax, href: null, emoji: "📠" },
  { icon: Mail, label: "이메일", value: COMPANY.email, href: `mailto:${COMPANY.email}`, emoji: "📧" },
  { icon: Clock, label: "운영시간", value: COMPANY.hours, href: null, emoji: "🕘" },
];

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── 풀폭 지도 (히어로 대체) ── */}
      <section className="relative">
        <div className="w-full h-[350px] md:h-[450px]">
          <iframe
            src={COMPANY.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${COMPANY.name} 위치`}
          />
        </div>
        {/* 주소 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent pt-16 pb-5">
          <div className="max-w-5xl mx-auto px-6 flex items-center gap-2 text-white text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            {COMPANY.address} {COMPANY.name}
          </div>
        </div>
      </section>

      {/* ── 네비 바로가기 ── */}
      <section className="bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <NavButtons variant="navy" />
        </div>
      </section>

      {/* ── 연락처 가로 카드 ── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-navy font-bold text-xl mb-6">연락처</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contactCards.map((c) => (
            <div key={c.label} className="border border-border-light p-4">
              <span className="text-lg mb-2 block">{c.emoji}</span>
              <p className="text-xs text-navy/40 mb-1">{c.label}</p>
              {c.href ? (
                <a href={c.href} className="text-sm font-medium text-navy hover:text-navy-light transition-colors break-all">
                  {c.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-navy">{c.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 교통편 (자가용 / 대중교통 나란히) ── */}
      <section className="bg-surface py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-navy font-bold text-xl mb-6">찾아오시는 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 자가용 */}
            <div className="bg-white border border-border-light p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                🚗 자가용
              </h3>
              <ol className="space-y-2.5">
                {COMPANY.directions.car.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-navy/60">
                    <span className="shrink-0 w-5 h-5 bg-navy-light/10 text-navy-light text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* 대중교통 */}
            <div className="bg-white border border-border-light p-6">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                🚌 대중교통
              </h3>
              <ol className="space-y-2.5">
                {COMPANY.directions.publicTransport.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-navy/60">
                    <span className="shrink-0 w-5 h-5 bg-navy-light/10 text-navy-light text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── 전화 CTA ── */}
      <section className="bg-navy py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-white/50 text-sm mb-4">방문 전 전화 예약을 권장드립니다</p>
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 bg-navy-light hover:bg-navy-hover text-white px-10 py-4 text-base font-semibold transition-colors"
          >
            <Phone className="w-5 h-5" />
            {COMPANY.phone}
          </a>
        </div>
      </section>
    </div>
  );
}
