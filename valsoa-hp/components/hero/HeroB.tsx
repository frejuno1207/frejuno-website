"use client";

import { useEffect, useRef, useState } from "react";
import HeroCopy from "@/components/hero/HeroCopy";
import { mountField } from "@/lib/field";
import { STEEL_FRAGMENT } from "@/lib/shaders";

/** 方向B: STEEL SHEEN。暗い鋼面はヒーローだけ。02以降は--paper地に戻す。 */
export default function HeroB() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountField(canvas, STEEL_FRAGMENT, () => setFailed(true));
  }, []);

  return (
    <section className="hero" data-surface="steel">
      <div className="hero__bg" aria-hidden="true">
        <div className="field-fallback" />
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: failed ? "none" : "block" }}
        />
      </div>
      <div className="hero__inner shell">
        <HeroCopy tone="steel" />
      </div>
    </section>
  );
}
