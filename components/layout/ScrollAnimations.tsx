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

    // 스크롤 애니메이션: 화면 밖 요소만 숨기고 애니메이션
    const setupAnim = (selector: string, from: gsap.TweenVars, to: gsap.TweenVars, stagger = false) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 100;

        if (isVisible) {
          // 이미 화면에 보이는 요소 — 건드리지 않음 (기본 visible)
          return;
        }

        // 화면 밖 요소만 숨기고 스크롤 시 등장
        gsap.set(el, from);
        ScrollTrigger.create({
          trigger: el,
          start: "top 95%",
          once: true,
          onEnter: () => gsap.to(el, { ...to, delay: stagger ? i * 0.03 : 0 }),
        });
      });
    };

    setupAnim("[data-fade-up]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    setupAnim("[data-fade-in]", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    setupAnim("[data-stagger]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, true);
    setupAnim("[data-scale-in]", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });

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

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return null;
}
