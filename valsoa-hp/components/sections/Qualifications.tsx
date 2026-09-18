import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";

/** 04 保有資格（ダイジェスト）。中身は未確定なので、見出し・リード・一覧への導線だけを置く。 */
export default function Qualifications() {
  return (
    <section aria-labelledby="qualifications-title" className="py-7 md:py-9">
      <div className="shell">
        <SectionHead
          index="04"
          id="qualifications-title"
          title="保有資格"
          lead="現場に入る前に確認いただく資格を掲載します。"
        />
        <Reveal delay={320} distance={32} duration={640} className="mt-4">
          <Link href="/qualifications/" className="cta cta--line">
            保有資格の一覧を見る
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
