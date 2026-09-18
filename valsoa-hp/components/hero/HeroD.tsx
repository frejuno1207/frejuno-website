import HeroCopy from "@/components/hero/HeroCopy";

/** 方向D: TYPE ONLY。場を作らない。文字組と余白だけ。 */
export default function HeroD() {
  return (
    <section className="hero">
      <div className="hero__inner shell">
        <div className="relative pl-3">
          <div className="absolute left-0 top-0 flex h-full w-1 flex-col items-center" aria-hidden="true">
            <span className="block h-1 w-1 bg-signal" />
            <span className="rule-y block w-px flex-1 bg-line" />
          </div>
          <HeroCopy breakLines />
        </div>
      </div>
    </section>
  );
}
