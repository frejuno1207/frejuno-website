import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "保有資格",
  description:
    "株式会社バルソア（岡山市）の保有資格のご案内。元請各社の入場基準に応じて、必要な資格の確認に対応します。",
  alternates: { canonical: "/qualifications/" },
};

export default function QualificationsPage() {
  return (
    <section className="py-7 md:py-9">
      <div className="shell">
        <div className="relative border-t border-line pt-3">
          <span className="signal-tick absolute -top-px left-0 block h-px w-3" aria-hidden="true" />
          <p className="mono text-s0 text-steel" aria-hidden="true">
            04
          </p>
          <h1 className="mt-2 text-s4 md:text-s5">保有資格</h1>
        </div>
        <p className="mt-3 max-w-84 text-s1 text-steel">
          現場に入る前に確認いただく資格を掲載します。
        </p>
        <p className="mt-3 max-w-84 text-s1">
          確認が必要な資格がございましたら、お電話またはご相談フォームからお問い合わせください。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href={COMPANY.telHref} className="cta cta--fill">
            <span>電話で相談する</span>
            <span className="mono">{COMPANY.tel}</span>
          </a>
          <Link href="/#contact" className="cta cta--line">
            工事のご相談
          </Link>
        </div>
      </div>
    </section>
  );
}
