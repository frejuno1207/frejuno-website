import Link from "next/link";
import { COMPANY } from "@/lib/company";

export default function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="shell flex min-h-8 items-center justify-between gap-2 py-1">
        <div className="flex items-baseline gap-2">
          <Link href="/" className="font-display text-s2 font-black tracking-[0.02em] text-ink">
            {COMPANY.nameEn}
            <span className="sr-only">（{COMPANY.name}）トップページ</span>
          </Link>
          <p className="hidden text-s0 text-steel sm:block">{COMPANY.name}</p>
        </div>
        <a href={COMPANY.telHref} className="mono text-s1 text-ink underline-offset-4 hover:underline">
          {COMPANY.tel}
        </a>
      </div>
    </header>
  );
}
