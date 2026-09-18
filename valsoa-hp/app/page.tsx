import HeroA from "@/components/hero/HeroA";
import JsonLd from "@/components/JsonLd";
import Capabilities from "@/components/sections/Capabilities";
import CompanyContact from "@/components/sections/CompanyContact";
import Qualifications from "@/components/sections/Qualifications";
import TwoWorks from "@/components/sections/TwoWorks";
import Updraft from "@/components/sections/Updraft";

/** 方向A: UPDRAFT FIELD */
export default function Page() {
  return (
    <>
      <JsonLd />
      <HeroA />
      <TwoWorks />
      <Capabilities />
      <Qualifications />
      <Updraft />
      <CompanyContact />
    </>
  );
}
