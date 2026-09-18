import type { Metadata } from "next";
import HeroB from "@/components/hero/HeroB";
import Capabilities from "@/components/sections/Capabilities";
import CompanyContact from "@/components/sections/CompanyContact";
import Qualifications from "@/components/sections/Qualifications";
import TwoWorks from "@/components/sections/TwoWorks";
import Updraft from "@/components/sections/Updraft";

export const metadata: Metadata = {
  title: "方向B｜STEEL SHEEN",
  description: "株式会社バルソア トップページ デザイン方向B（鋼面シェーダ）の検討用ページ。",
  robots: { index: false, follow: false },
  alternates: { canonical: "/b/" },
};

/** 方向B: STEEL SHEEN。暗い面はヒーローだけ。 */
export default function PageB() {
  return (
    <>
      <HeroB />
      <div className="seam" aria-hidden="true">
        <span className="seam__signal" />
      </div>
      <TwoWorks />
      <Capabilities />
      <Qualifications />
      <Updraft />
      <CompanyContact />
    </>
  );
}
