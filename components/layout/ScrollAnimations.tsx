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

    // 초기 상태 설정 (요소 존재할 때만)
    const setIfExists = (sel: string, props: gsap.TweenVars) => {
      if (document.querySelector(sel)) gsap.set(sel, props);
    };
    setIfExists("[data-fade-up]", { opacity: 0, y: 40 });
    setIfExists("[data-fade-in]", { opacity: 0 });
    setIfExists("[data-stagger]", { opacity: 0, y: 36 });
    setIfExists("[data-scale-in]", { opacity: 0, scale: 0.95 });

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

    // 공통: 이미 화면에 보이는 요소는 즉시 표시
    const animateIn = (el: Element, props: gsap.TweenVars) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // 이미 화면에 있으면 즉시 표시
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(el, props),
        });
      }
    };

    // fade-up
    document.querySelectorAll("[data-fade-up]").forEach((el) => {
      animateIn(el, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" });
    });

    // fade-in
    document.querySelectorAll("[data-fade-in]").forEach((el) => {
      animateIn(el, { opacity: 1, duration: 0.6, ease: "power2.out" });
    });

    // stagger
    document.querySelectorAll("[data-stagger]").forEach((el, i) => {
      animateIn(el, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", delay: i * 0.08 });
    });

    // scale-in
    document.querySelectorAll("[data-scale-in]").forEach((el) => {
      animateIn(el, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
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
