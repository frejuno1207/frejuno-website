import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "デザイン方向の比較",
  description: "株式会社バルソア トップページ デザイン4方向の比較用インデックス（社内確認用）。",
  robots: { index: false, follow: false },
  alternates: { canonical: "/directions/" },
};

const DIRECTIONS = [
  { href: "/", label: "方向A", en: "UPDRAFT FIELD", note: "気流シェーダ。社名の由来を場そのものにする。" },
  { href: "/b/", label: "方向B", en: "STEEL SHEEN", note: "鋼面シェーダ。業種が一目で伝わる。" },
  { href: "/c/", label: "方向C", en: "DRAFTING LINES", note: "作図アニメーション。職人性を精度で見せる。" },
  { href: "/d/", label: "方向D", en: "TYPE ONLY", note: "文字組と余白だけ。評価の基準線。" },
];

export default function DirectionsPage() {
  return (
    <section className="py-7">
      <div className="shell">
        <h1 className="text-s4 md:text-s5">デザイン方向の比較</h1>
        <p className="mt-2 max-w-84 text-s1 text-steel">
          トップページの構成・文言は4方向で共通です。異なるのはヒーローの場の作り方と、登場の演出だけです。
        </p>
        <ul className="mt-5 border-t border-line">
          {DIRECTIONS.map((item) => (
            <li key={item.href} className="border-b border-line py-3">
              <Link href={item.href} className="block">
                <span className="mono text-s0 text-steel">{item.en}</span>
                <span className="font-display mt-1 block text-s3 font-black underline-offset-4 hover:underline">
                  {item.label}
                </span>
                <span className="mt-1 block text-s1 text-steel">{item.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
