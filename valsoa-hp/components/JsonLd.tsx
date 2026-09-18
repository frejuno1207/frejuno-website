import { COMPANY, SITE_URL } from "@/lib/company";

/** 構造化データは確定事実のみ。未確定の項目は出力しない。 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: COMPANY.name,
    alternateName: COMPANY.nameEn,
    url: `${SITE_URL}/`,
    telephone: COMPANY.telE164,
    foundingDate: COMPANY.foundedISO,
    founder: { "@type": "Person", name: COMPANY.ceo },
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: COMPANY.addressRegion,
      addressLocality: COMPANY.addressLocality,
      streetAddress: COMPANY.addressStreet,
    },
    areaServed: { "@type": "AdministrativeArea", name: COMPANY.addressRegion },
    knowsAbout: ["製缶工事", "鍛冶工事", "重量物据付工事", "配管工事"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
