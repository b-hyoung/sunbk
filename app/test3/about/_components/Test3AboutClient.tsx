"use client";

import Link from "next/link";
import { Phone, Anchor, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/constants/company";

export default function Test3AboutClient() {
  return (
    <div className="bg-white">
      {/* 히어로 */}
      <div className="bg-navy-dark py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <nav aria-label="브레드크럼" className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/test3" className="hover:text-white/70 transition-colors">메인</Link>
            <span>〉</span>
            <span className="text-white/70">회사소개</span>
          </nav>
          <div className="border-l-4 border-ocean pl-5">
            <p className="text-ocean text-[10px] font-bold tracking-widest uppercase mb-2">ABOUT US</p>
            <h1 className="text-white text-2xl font-bold mb-2">{COMPANY.name}</h1>
            <p className="text-white/50 text-sm">
              선박 임대·판매 전문기업. 신뢰와 전문성으로 바다 위의 파트너가 되겠습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 회사 소개 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-ocean">회사 소개</h2>
              <hr className="border-t-2 border-ocean w-10" />
            </div>
            <p className="text-gray-500 leading-relaxed mb-6 text-sm">
              {COMPANY.name}은 인천을 기반으로 선박 임대 및 판매 서비스를 제공하는 전문 기업입니다.
              다년간의 경험과 노하우를 바탕으로 고객의 목적에 맞는 최적의 선박을 제안해 드립니다.
            </p>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Anchor className="w-4 h-4 text-ocean mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">대표자</p>
                  <p className="text-gray-500">{COMPANY.representative}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ocean mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">주소</p>
                  <p className="text-gray-500">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-ocean mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">운영시간</p>
                  <p className="text-gray-500">{COMPANY.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 작업현장 바로가기 */}
          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 border border-gray-200 p-8">
              <h3 className="text-ocean font-bold text-base mb-3">작업현장 사진</h3>
              <hr className="border-t-2 border-ocean w-10 mb-4" />
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                수연선박의 정비, 항해, 상가 작업 등 현장의 기록을 사진으로 확인하세요.
              </p>
              <Link
                href="/test3/work"
                className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-hover text-white px-6 py-3 text-sm font-semibold transition-colors"
              >
                작업현장 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-dark py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-white text-xl font-bold mb-1">궁금한 점이 있으신가요?</h2>
            <p className="text-white/50 text-sm">선박 전문 상담사가 친절하게 안내해드립니다.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href={`tel:${COMPANY.phone}`}
              className="inline-flex items-center gap-2 bg-ocean hover:bg-ocean-hover text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              {COMPANY.phone}
            </a>
            <Link
              href="/test3/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              온라인 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
