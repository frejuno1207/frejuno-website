"use client";

import { useEffect } from "react";

/**
 * 連鎖登場のランタイム。
 * - IntersectionObserver は一度だけ発火して unobserve する
 * - 要素アニメで rAF ループを持たない
 * - reduced-motion / IO 非対応 / JS 停止時は、CSS 側の既定（可視）のまま何もしない
 */
export default function RevealRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-reveal-ready", "1");

    if (!root.classList.contains("js-reveal")) return;

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
