"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  // 경로 + 쿼리스트링이 바뀔 때마다 재초기화 (소프트 내비게이션 포함).
  // cls 필터처럼 같은 경로에서 쿼리만 바뀌는 경우도 감지해야 하므로 둘 다 사용.
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    // 이 컴포넌트가 만든 트리거만 추적해서 정리 (Header 등 다른 트리거는 건드리지 않음)
    const created: ScrollTrigger[] = [];
    let raf1 = 0;
    let raf2 = 0;

    // 레이아웃 안정 후 실행 (requestAnimationFrame 2번 = 확실한 paint 후)
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
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
          // 이미 화면에 보임 — 잔존 inline opacity(이전 내비게이션에서 숨긴 값)를 확실히 해제.
          // 재사용된 DOM 노드가 opacity:0을 물고 오는 경우를 리셋한다.
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }

        // 화면 밖 → 숨기고 스크롤 시 등장
        gsap.set(el, { opacity: 0, y: 16 });

        created.push(
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
          }),
        );
      });

      // 통계 숫자 카운트업 (숫자가 아닌 값은 스킵)
      document.querySelectorAll("[data-count]").forEach((el) => {
        const raw = (el as HTMLElement).dataset.count ?? "0";
        const suffix = raw.replace(/[0-9]/g, "");
        const target = parseInt(raw);
        if (isNaN(target)) return;
        created.push(
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
          }),
        );
      });

      ScrollTrigger.refresh();
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      created.forEach((t) => t.kill());
    };
  }, [routeKey]);

  return null;
}
