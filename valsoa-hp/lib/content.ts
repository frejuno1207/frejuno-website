export const HERO = {
  h1: "岡山の鉄工事を、まとめて相談できる。",
  sub: "製缶・鍛冶、据付・配管。四つの仕事を、ひとつの窓口で。",
  signature: "VALSOA — 岡山市／創業2026年",
} as const;

export type WorkCard = {
  title: string;
  en: string;
  lead: string;
  steps: readonly string[];
};

export const WORKS: readonly WorkCard[] = [
  {
    title: "製缶・鍛冶工事",
    en: "FABRICATION & STEEL WORK",
    lead: "つくって、取り付ける。",
    steps: [
      "切断・曲げ加工",
      "溶接・組立",
      "タンク・架台・ホッパーの製作",
      "鉄骨・歩廊・手摺の現場取付・補修",
    ],
  },
  {
    title: "据付・配管工事",
    en: "PLANT INSTALLATION",
    lead: "据えて、つなぐ。",
    steps: [
      "機器の搬入据付・芯出し",
      "移設・撤去",
      "プラント配管の製作・取付",
      "定期修理工事",
    ],
  },
] as const;

export const CAPABILITIES = [
  "切断",
  "抜き加工",
  "曲げ加工",
  "溶接",
  "組立",
  "現場溶接",
  "鉄骨取付",
  "歩廊・手摺",
  "タンク製作",
  "架台製作",
  "搬入据付",
  "芯出し",
  "移設",
  "撤去",
  "配管製作",
  "配管取付",
  "定期修理",
] as const;

export const VALUES = [
  { en: "Value for All", ja: "一つひとつの仕事に、同じ熱量で向き合う。" },
  { en: "Soar Together", ja: "現場の仲間と、共に高く飛ぶ。" },
  { en: "Open Air", ja: "風通しのよい、開かれた仕事場をつくる。" },
] as const;

export const MISSION = {
  heading: "すべての価値に、上昇気流を。",
  closing: "私たちは、飛ぶ側ではなく、飛ばす側でありたい。",
} as const;

export const CONSULT_TOPICS = [
  "製缶・鍛冶工事のご相談",
  "据付・配管工事のご相談",
  "協力会社としてのお取引",
  "採用について",
  "その他",
] as const;
