"use client";

import { useEffect, useRef, useState } from "react";
import HeroCopy from "@/components/hero/HeroCopy";
import { mountField } from "@/lib/field";
import { UPDRAFT_FRAGMENT } from "@/lib/shaders";

/** 方向A: UPDRAFT FIELD。背景は主役にならない。文字を持ち上げるためだけにある。 */
export default function HeroA() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mountField(canvas, UPDRAFT_FRAGMENT, () => setFailed(true));
  }, []);

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="field-fallback" />
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ display: failed ? "none" : "block" }}
        />
        <div className="hero__veil" />
        <div className="hero__hem" />
      </div>
      <div className="hero__inner shell">
        <HeroCopy />
      </div>
    </section>
  );
}
