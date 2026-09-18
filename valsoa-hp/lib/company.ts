/**
 * 確定している事実のみを置く。
 * 未確定（資本金・建設業許可・従業員数・実績数値・保有資格）は行ごと持たない。
 */
export const COMPANY = {
  name: "株式会社バルソア",
  nameEn: "VALSOA",
  ceoTitle: "代表取締役",
  ceo: "岸本康平",
  founded: "2026年6月",
  foundedISO: "2026-06",
  addressFull: "岡山県岡山市北区西辛川312-17",
  addressRegion: "岡山県",
  addressLocality: "岡山市北区",
  addressStreet: "西辛川312-17",
  tel: "086-238-1634",
  telHref: "tel:086-238-1634",
  telE164: "+81-86-238-1634",
} as const;

/** 本番ドメインは未確定。公開前に NEXT_PUBLIC_SITE_URL で確定値を渡す。 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://valsoa.co.jp").replace(
  /\/$/,
  "",
);

/** 相談フォームの送信先（Formspree）。公開前に NEXT_PUBLIC_FORM_ENDPOINT で差し替える。 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
