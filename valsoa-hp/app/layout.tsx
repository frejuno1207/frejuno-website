import type { Metadata, Viewport } from "next";
import RevealRuntime from "@/components/RevealRuntime";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { COMPANY, SITE_URL } from "@/lib/company";
import { FONT_FACE_CSS, FONT_PRELOADS } from "@/lib/fonts.generated";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name}｜岡山の製缶・鍛冶・据付・配管工事`,
    template: `%s｜${COMPANY.name}`,
  },
  description:
    "株式会社バルソアは岡山市の鉄工事会社です。製缶・鍛冶、重量物据付、プラント配管の四工種を、ひとつの窓口でお引き受けします。",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: COMPANY.name,
    url: `${SITE_URL}/`,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f3f5",
};

/**
 * 描画前に走る。IntersectionObserver が使えて reduced-motion でない時だけ
 * 登場前の状態（不可視）を許可する。ハイドレーションが3秒以内に来なければ解除し、
 * JS エラー時も全要素が見える状態へ戻す。
 */
const REVEAL_BOOT = `(function(){var d=document.documentElement;try{if('IntersectionObserver' in window&&window.matchMedia&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.className+=' js-reveal';setTimeout(function(){if(d.getAttribute('data-reveal-ready')!=='1'){d.className=d.className.replace(' js-reveal','');}},3000);}}catch(e){d.className=d.className.replace(' js-reveal','');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {FONT_PRELOADS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="" />
        ))}
        <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:m-1 focus:border focus:border-ink focus:bg-paper focus:p-1 focus:text-s1">
          本文へスキップ
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealRuntime />
      </body>
    </html>
  );
}
