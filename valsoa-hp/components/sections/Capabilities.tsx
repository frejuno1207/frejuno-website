import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { CAPABILITIES } from "@/lib/content";
import type { Variant } from "@/lib/variant";

/** 03 できること。1つ40msずつ、左上から右下へ。全体1秒以内。 */
export default function Capabilities({ variant = "default" }: { variant?: Variant }) {
  const drafting = variant === "drafting";
  return (
    <section aria-labelledby="capabilities-title" className="py-7 md:py-9">
      <div className="shell">
        <SectionHead
          index="03"
          id="capabilities-title"
          title="できること"
          lead="発注の可否をご判断いただくための、対応できる作業の一覧です。"
        />
        <ul className="mt-4 flex flex-wrap gap-1">
          {CAPABILITIES.map((item, i) =>
            drafting ? (
              <li
                key={item}
                data-reveal=""
                className="reveal-trigger tag tag--draft relative"
                style={{ "--reveal-delay": `${i * 40}ms` } as CSSProperties}
              >
                <span className="draft-frame" aria-hidden="true" />
                <span className="relative">{item}</span>
              </li>
            ) : (
              <Reveal
                as="li"
                key={item}
                delay={i * 40}
                distance={32}
                duration={640}
                className="tag"
              >
                {item}
              </Reveal>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
