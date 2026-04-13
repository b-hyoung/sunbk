"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // 레이아웃 안정 후 실행 (requestAnimationFrame 2번 = 확실한 paint 후)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        init();
      });
    });

    function init() {
      // 히어로 텍스트
      const heroItems = document.querySelectorAll("[data-hero]");
      if (heroItems.length) {
        gsap.fromTo(heroItems, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.2,
        });
      }

      // 스크롤 애니메이션 대상
      const allTargets = document.querySelectorAll("[data-fade-up],[data-fade-in],[data-stagger],[data-scale-in]");
      const vh = window.innerHeight;

      allTargets.forEach((el, i) => {
        const top = el.getBoundingClientRect().top;

        if (top < vh) {
          // 이미 화면에 보임 — 건드리지 않음
          return;
        }

        // 화면 밖 → 숨기고 스크롤 시 등장
        gsap.set(el, { opacity: 0, y: 16 });

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
            });
          },
        });
      });

      // 통계 숫자 카운트업 (숫자가 아닌 값은 스킵)
      document.querySelectorAll("[data-count]").forEach((el) => {
        const raw = (el as HTMLElement).dataset.count ?? "0";
        const suffix = raw.replace(/[0-9]/g, "");
        const target = parseInt(raw);
        if (isNaN(target)) return;
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

      ScrollTrigger.refresh();
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
