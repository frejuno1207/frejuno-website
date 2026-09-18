import type { Metadata } from "next";
import HeroC from "@/components/hero/HeroC";
import Capabilities from "@/components/sections/Capabilities";
import CompanyContact from "@/components/sections/CompanyContact";
import Qualifications from "@/components/sections/Qualifications";
import TwoWorks from "@/components/sections/TwoWorks";
import Updraft from "@/components/sections/Updraft";

export const metadata: Metadata = {
  title: "方向C｜DRAFTING LINES",
  description: "株式会社バルソア トップページ デザイン方向C（作図アニメーション）の検討用ページ。",
  robots: { index: false, follow: false },
  alternates: { canonical: "/c/" },
};

/** 方向C: DRAFTING LINES。05は動かさない。 */
export default function PageC() {
  return (
    <>
      <HeroC />
      <TwoWorks variant="drafting" />
      <Capabilities variant="drafting" />
      <Qualifications />
      <Updraft still />
      <CompanyContact variant="drafting" />
    </>
  );
}
