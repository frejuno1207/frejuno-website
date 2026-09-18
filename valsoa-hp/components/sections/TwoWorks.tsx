import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { WORKS } from "@/lib/content";
import type { Variant } from "@/lib/variant";

/** 02 二つの仕事。左のカードが着地してから右が起動する。 */
export default function TwoWorks({ variant = "default" }: { variant?: Variant }) {
  const drafting = variant === "drafting";
  const ruleMs = drafting ? 480 : 0;

  return (
    <section aria-labelledby="works-title" className="py-7 md:py-9">
      <div className="shell">
        <SectionHead index="02" id="works-title" title="二つの仕事" />
        <div className="mt-5 grid md:grid-cols-2">
          {WORKS.map((work, i) => {
            const base = i * 800;
            return (
              <div
                key={work.title}
                data-reveal=""
                className={[
                  "reveal-trigger relative pt-3 pb-4 md:px-3 md:first:pl-0 md:last:pr-0",
                  drafting ? "" : "border-t border-line",
                  i === 1 ? "chain-md mt-4 md:mt-0 md:border-l md:border-l-line" : "",
                ].join(" ")}
                style={{ "--reveal-delay": `${base}ms` } as CSSProperties}
              >
                {drafting ? (
                  <span className="draft-rule" aria-hidden="true" />
                ) : (
                  <span
                    className="signal-tick absolute -top-px left-0 block h-px w-3"
                    aria-hidden="true"
                  />
                )}
                <Reveal delay={base + ruleMs} distance={32} duration={640}>
                  <h3 className="text-s3 md:text-s4">{work.title}</h3>
                  <p className="mono mt-1 text-s0 tracking-[0.08em] text-steel">{work.en}</p>
                  <p className="font-display mt-3 text-s2 font-bold md:text-s3">
                    「{work.lead}」
                  </p>
                </Reveal>
                <ul className="mt-3 border-t border-line">
                  {work.steps.map((step, s) => (
                    <Reveal
                      as="li"
                      key={step}
                      delay={base + ruleMs + 160 + s * 160}
                      distance={32}
                      duration={640}
                      className="flex gap-2 border-b border-line py-2"
                    >
                      <span className="mono text-s0 text-steel" aria-hidden="true">
                        {String(s + 1).padStart(2, "0")}
                      </span>
                      <span className="text-s1">{step}</span>
                    </Reveal>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
