"use client";

import Link from "next/link";
import { Phone, Anchor, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/constants/company";

export default function Test2AboutClient() {
  return (
    <div className="bg-white">
      {/* 히어로 */}
      <section className="relative bg-navy py-28 overflow-hidden">
        <div className="absolute inset-0 bg-navy/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-white/75 text-xs font-bold tracking-[0.2em] uppercase mb-4">
            About Us
          </p>
          <h1 className="text-white font-bold text-4xl md:text-5xl mb-5 max-w-xl leading-tight">
            {COMPANY.name}
          </h1>
          <p className="text-white/50 text-lg max-w-lg leading-relaxed">
            선박 임대·판매 전문기업. 신뢰와 전문성으로 바다 위의 파트너가 되겠습니다.
          </p>
        </div>
      </section>

      {/* 회사 소개 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-navy-light text-xs font-bold tracking-[0.15em] uppercase mb-2">Company</p>
            <h2 className="text-navy text-2xl font-bold mb-4">회사 소개</h2>
            <p className="text-navy/60 leading-relaxed mb-6">
              {COMPANY.name}은 인천을 기반으로 선박 임대 및 판매 서비스를 제공하는 전문 기업입니다.
              다년간의 경험과 노하우를 바탕으로 고객의 목적에 맞는 최적의 선박을 제안해 드립니다.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Anchor className="w-4 h-4 text-navy-light mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-navy">대표자</p>
                  <p className="text-navy/60">{COMPANY.representative}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-navy-light mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-navy">주소</p>
                  <p className="text-navy/60">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-navy-light mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-navy">운영시간</p>
                  <p className="text-navy/60">{COMPANY.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 작업현장 바로가기 */}
          <div className="flex flex-col justify-center">
            <div className="bg-surface p-8">
              <h3 className="text-navy font-bold text-lg mb-3">작업현장 사진</h3>
              <p className="text-navy/60 text-sm mb-6 leading-relaxed">
                수연선박의 정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
              </p>
              <Link
                href="/test2/work"
                className="inline-flex items-center gap-2 bg-navy-light hover:bg-navy-hover text-white px-6 py-3 text-sm font-semibold transition-colors"
              >
                작업현장 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">궁금한 점이 있으신가요?</h2>
            <p className="text-white/50 text-sm">선박 전문 상담사가 친절하게 안내해드립니다.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-navy-light hover:bg-navy-hover text-white px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/test2/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              온라인 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
