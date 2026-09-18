import { COMPANY } from "@/lib/company";
import { HERO } from "@/lib/content";

type Props = {
  tone?: "paper" | "steel";
  /** 方向D: 3行で組む */
  breakLines?: boolean;
};

/** H1・サブ・署名行・CTA。初期状態から可視（opacity:0を起点にしない）。 */
export default function HeroCopy({ tone = "paper", breakLines = false }: Props) {
  const steel = tone === "steel";
  return (
    <div className="hero__copy">
      <h1 className="hero__h1">
        {breakLines ? (
          <>
            岡山の鉄工事を、
            <br />
            まとめて
            <br />
            相談できる。
          </>
        ) : (
          HERO.h1
        )}
      </h1>
      <p className={`mt-3 text-s2 ${steel ? "text-paper" : "text-ink"}`}>{HERO.sub}</p>
      <p
        className={`mono mt-3 text-s0 tracking-[0.08em] ${steel ? "text-paper opacity-80" : "text-steel"}`}
      >
        {HERO.signature}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={COMPANY.telHref} className="cta cta--fill">
          <span>電話で相談する</span>
          <span className="mono">{COMPANY.tel}</span>
        </a>
        <a href="#contact" className="cta cta--line">
          工事のご相談
        </a>
      </div>
    </div>
  );
}
