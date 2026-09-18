import type { Metadata } from "next";
import HeroD from "@/components/hero/HeroD";
import Capabilities from "@/components/sections/Capabilities";
import CompanyContact from "@/components/sections/CompanyContact";
import Qualifications from "@/components/sections/Qualifications";
import TwoWorks from "@/components/sections/TwoWorks";
import Updraft from "@/components/sections/Updraft";

export const metadata: Metadata = {
  title: "方向D｜TYPE ONLY",
  description: "株式会社バルソア トップページ デザイン方向D（文字のみ・基準線）の検討用ページ。",
  robots: { index: false, follow: false },
  alternates: { canonical: "/d/" },
};

/** 方向D: TYPE ONLY。A〜Cを評価するための基準線。 */
export default function PageD() {
  return (
    <>
      <HeroD />
      <TwoWorks />
      <Capabilities />
      <Qualifications />
      <Updraft />
      <CompanyContact />
    </>
  );
}
