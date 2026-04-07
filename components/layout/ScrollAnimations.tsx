"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    // 모션 감소 설정 사용자는 애니메이션 스킵
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set("[data-fade-up],[data-fade-in],[data-stagger],[data-scale-in],[data-hero]", { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // 초기 상태 설정
    gsap.set("[data-fade-up]", { opacity: 0, y: 40 });
    gsap.set("[data-fade-in]", { opacity: 0 });
    gsap.set("[data-stagger]", { opacity: 0, y: 36 });
    gsap.set("[data-scale-in]", { opacity: 0, scale: 0.95 });

    // 히어로 텍스트 — 페이지 로드 시 순차 등장
    const heroItems = document.querySelectorAll("[data-hero]");
    gsap.fromTo(
      heroItems,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.2,
      }
    );

    // fade-up: 섹션 제목, 단일 텍스트 블록
    document.querySelectorAll("[data-fade-up]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          });
        },
      });
    });

    // fade-in: 단순 등장
    document.querySelectorAll("[data-fade-in]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => {
          gsap.to(el, { opacity: 1, duration: 0.6, ease: "power2.out" });
        },
      });
    });

    // stagger: 카드·그리드 자식들
    document.querySelectorAll("[data-stagger]").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            delay: i * 0.08,
          });
        },
      });
    });

    // scale-in: CTA 박스
    document.querySelectorAll("[data-scale-in]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
          });
        },
      });
    });

    // 통계 숫자 카운트업
    document.querySelectorAll("[data-count]").forEach((el) => {
      const raw = (el as HTMLElement).dataset.count ?? "0";
      const suffix = raw.replace(/[0-9]/g, "");
      const target = parseInt(raw);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        onEnter: () => {
          gsap.fromTo(
            { val: 0 },
            { val: target },
            {
              duration: 1.4,
              ease: "power2.out",
              onUpdate: function () {
                (el as HTMLElement).textContent =
                  Math.round(this.targets()[0].val) + suffix;
              },
            }
          );
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
