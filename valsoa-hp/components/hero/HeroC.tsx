import type { CSSProperties } from "react";
import HeroCopy from "@/components/hero/HeroCopy";
import { COMPANY } from "@/lib/company";
import { arrow, cross, line, pathLength, rect } from "@/lib/drafting";

type Stroke = { d: string; delay: number; dur: number; tone?: "line" | "steel" };

/* 架台とフランジを直線だけで抽象化した図。数値は書かない（未確定のため）。 */
const OUTLINE: Stroke[] = [
  { d: rect(96, 128, 464, 16), delay: 320, dur: 520 },
  { d: rect(96, 408, 464, 16), delay: 400, dur: 520 },
  {
    d: [line(140, 144, 140, 408), line(156, 144, 156, 408), line(500, 144, 500, 408), line(516, 144, 516, 408)].join(" "),
    delay: 480,
    dur: 480,
  },
  { d: [line(156, 276, 500, 276), line(156, 392, 500, 160)].join(" "), delay: 560, dur: 560 },
  { d: rect(600, 176, 96, 96), delay: 640, dur: 440 },
  {
    d: [cross(624, 200, 6), cross(672, 200, 6), cross(624, 248, 6), cross(672, 248, 6)].join(" "),
    delay: 720,
    dur: 400,
  },
];

const DIMENSIONS: Stroke[] = [
  {
    d: [line(96, 424, 96, 486), line(560, 424, 560, 486), line(96, 128, 40, 128), line(96, 424, 40, 424)].join(" "),
    delay: 1000,
    dur: 380,
    tone: "steel",
  },
  {
    d: [line(96, 470, 560, 470), arrow(96, 470, "left"), arrow(560, 470, "right")].join(" "),
    delay: 1080,
    dur: 420,
    tone: "steel",
  },
  {
    d: [line(56, 128, 56, 424), arrow(56, 128, "up"), arrow(56, 424, "down")].join(" "),
    delay: 1160,
    dur: 420,
    tone: "steel",
  },
];

const TITLE_BLOCK: Stroke = {
  d: [rect(472, 500, 272, 88), line(472, 528, 744, 528), line(472, 560, 744, 560)].join(" "),
  delay: 1560,
  dur: 440,
};

/** 寸法線の端点 */
const ENDPOINTS: [number, number][] = [
  [96, 470],
  [560, 470],
  [56, 128],
  [56, 424],
];

function strokeStyle(stroke: Stroke): CSSProperties {
  return {
    "--len": pathLength(stroke.d),
    "--d": stroke.delay,
    "--dur": `${stroke.dur}ms`,
  } as CSSProperties;
}

/** 方向C: DRAFTING LINES。2.4秒で引き終わり、以後は完全に静止する。 */
export default function HeroC() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div
          className="draft-grid fade-in"
          style={{ "--d": 0, "--dur": "400ms" } as CSSProperties}
        />
        <svg
          className="absolute right-0 top-0 hidden h-full w-[62%] md:block"
          viewBox="0 0 760 600"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          focusable="false"
        >
          {[...OUTLINE, ...DIMENSIONS, TITLE_BLOCK].map((stroke) => (
            <path
              key={stroke.d}
              className="draw-seg"
              style={strokeStyle(stroke)}
              d={stroke.d}
              stroke="var(--steel)"
              strokeOpacity={stroke.tone === "steel" ? 0.85 : 0.5}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {ENDPOINTS.map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect
                className="fade-in"
                style={{ "--d": 1650, "--dur": "300ms" } as CSSProperties}
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
                fill="var(--steel)"
              />
              <rect
                className="signal-dot"
                style={{ "--d": 1650 } as CSSProperties}
                x={x - 3}
                y={y - 3}
                width="6"
                height="6"
                fill="var(--signal)"
              />
            </g>
          ))}
          <g
            className="fade-in"
            style={{ "--d": 2000, "--dur": "400ms" } as CSSProperties}
            fill="var(--steel)"
            fontFamily="var(--font-mono)"
          >
            <text x="488" y="521" fontSize="20">
              {COMPANY.nameEn}
            </text>
            <text x="488" y="551" fontSize="14">
              2026-06
            </text>
            <text x="488" y="583" fontSize="14">
              SHEET 01
            </text>
          </g>
        </svg>
      </div>
      <div className="hero__inner shell">
        <HeroCopy />
        <div className="mt-6 inline-block border border-line md:hidden" aria-hidden="true">
          <p className="mono border-b border-line px-2 py-1 text-s1">{COMPANY.nameEn}</p>
          <p className="mono border-b border-line px-2 py-1 text-s0 text-steel">2026-06</p>
          <p className="mono px-2 py-1 text-s0 text-steel">SHEET 01</p>
        </div>
      </div>
    </section>
  );
}
