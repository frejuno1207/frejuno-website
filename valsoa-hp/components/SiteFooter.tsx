import Link from "next/link";
import { COMPANY } from "@/lib/company";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="shell flex flex-col gap-3 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-s2 font-black text-ink">{COMPANY.name}</p>
          <p className="mt-1 text-s0 text-steel">{COMPANY.addressFull}</p>
          <p className="mono mt-1 text-s0 text-steel">TEL {COMPANY.tel}</p>
        </div>
        <nav aria-label="フッター">
          <ul className="flex flex-wrap gap-3 text-s0">
            <li>
              <Link href="/qualifications/" className="text-ink underline-offset-4 hover:underline">
                保有資格
              </Link>
            </li>
            <li>
              <Link href="/recruit/" className="text-ink underline-offset-4 hover:underline">
                採用情報
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="text-ink underline-offset-4 hover:underline">
                工事のご相談
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="shell mono pb-4 text-s0 text-steel">© {COMPANY.nameEn}</p>
    </footer>
  );
}
