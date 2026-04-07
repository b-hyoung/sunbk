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

    // 모든 애니메이션 대상 수집
    const allTargets = document.querySelectorAll("[data-fade-up],[data-fade-in],[data-stagger],[data-scale-in]");

    allTargets.forEach((el, i) => {
      // 이미 뷰포트 안이면 건너뜀 (보이는 상태 유지)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) return;

      // 뷰포트 밖만 숨기고 트리거
      el.setAttribute("style", "opacity:0;transform:translateY(16px)");

      ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            delay: el.hasAttribute("data-stagger") ? (i % 6) * 0.03 : 0,
            clearProps: "all",
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
        start: "top 95%",
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 }, { val: target }, {
            duration: 1.2, ease: "power2.out",
            onUpdate: function () {
              (el as HTMLElement).textContent = Math.round(this.targets()[0].val) + suffix;
            },
          });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
