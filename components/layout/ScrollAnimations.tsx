"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // 히어로 텍스트 — 페이지 로드 시 순차 등장
    const heroItems = document.querySelectorAll("[data-hero]");
    if (heroItems.length) {
      gsap.fromTo(heroItems, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.2,
      });
    }

    // 스크롤 애니메이션 등록
    const createAnim = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        const delay = selector === "[data-stagger]" ? i * 0.08 : 0;
        gsap.set(el, from);
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => gsap.to(el, { ...to, delay }),
        });
      });
    };

    createAnim("[data-fade-up]", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    createAnim("[data-fade-in]", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    createAnim("[data-stagger]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    createAnim("[data-scale-in]", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" });

    // 통계 숫자 카운트업
    document.querySelectorAll("[data-count]").forEach((el) => {
      const raw = (el as HTMLElement).dataset.count ?? "0";
      const suffix = raw.replace(/[0-9]/g, "");
      const target = parseInt(raw);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 }, { val: target }, {
            duration: 1.4, ease: "power2.out",
            onUpdate: function () {
              (el as HTMLElement).textContent = Math.round(this.targets()[0].val) + suffix;
            },
          });
        },
      });
    });

    // ScrollTrigger refresh — 레이아웃 변경 후 위치 재계산
    ScrollTrigger.refresh();

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
