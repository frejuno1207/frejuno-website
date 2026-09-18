import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { MISSION, VALUES } from "@/lib/content";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "株式会社バルソア（岡山市）の採用のご案内。製缶・鍛冶、据付・配管の現場で働く仲間を探しています。",
  alternates: { canonical: "/recruit/" },
};

export default function RecruitPage() {
  return (
    <section className="py-7 md:py-9">
      <div className="shell">
        <div className="relative border-t border-line pt-3">
          <span className="signal-tick absolute -top-px left-0 block h-px w-3" aria-hidden="true" />
          <h1 className="mt-2 text-s4 md:text-s5">採用情報</h1>
        </div>
        <p className="mt-3 max-w-84 text-s1 text-steel">
          製缶・鍛冶、据付・配管の現場で働く仲間を探しています。
        </p>

        <dl className="mt-6 max-w-96">
          {VALUES.map((value) => (
            <div key={value.en} className="border-t border-line py-3">
              <dt className="font-display text-s2 font-bold tracking-[0.02em]">{value.en}</dt>
              <dd className="mt-1 text-s1">{value.ja}</dd>
            </div>
          ))}
        </dl>

        <p className="font-display mt-6 max-w-80 text-s3 font-black leading-[1.5]">
          {MISSION.closing}
        </p>

        <p className="mt-6 max-w-84 text-s1">
          ご応募・お問い合わせは、お電話またはご相談フォーム（相談内容「採用について」）からお願いします。
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={COMPANY.telHref} className="cta cta--fill">
            <span>電話で相談する</span>
            <span className="mono">{COMPANY.tel}</span>
          </a>
          <Link href="/#contact" className="cta cta--line">
            相談フォームへ
          </Link>
        </div>
      </div>
    </section>
  );
}
