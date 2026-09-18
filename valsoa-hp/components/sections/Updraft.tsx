import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { MISSION, VALUES } from "@/lib/content";

/** 05 上昇気流。ここにCTAは置かない（意図的）。 */
export default function Updraft({ still = false }: { still?: boolean }) {
  return (
    <section aria-labelledby="mission-title" className="py-8 md:py-11">
      <div className="shell">
        <SectionHead
          index="05"
          id="mission-title"
          title={MISSION.heading}
          size="large"
          still={still}
        />

        <dl className="mt-6 max-w-96">
          {VALUES.map((value, i) => (
            <Reveal
              key={value.en}
              still={still}
              delay={220 + i * 220}
              distance={32}
              duration={640}
              className="border-t border-line py-3"
            >
              <dt className="font-display text-s2 font-bold tracking-[0.02em]">{value.en}</dt>
              <dd className="mt-1 text-s1">{value.ja}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal still={still} delay={880} distance={32} duration={800} className="mt-6 max-w-80">
          <p className="font-display text-s3 font-black leading-[1.5] md:text-s4">
            {MISSION.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
