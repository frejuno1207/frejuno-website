import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import { COMPANY, FORM_ENDPOINT } from "@/lib/company";
import { CONSULT_TOPICS } from "@/lib/content";
import type { Variant } from "@/lib/variant";

type Row = { label: string; value: string; tel?: boolean };

const ROWS: readonly Row[] = [
  { label: "会社名", value: COMPANY.name },
  { label: COMPANY.ceoTitle, value: COMPANY.ceo },
  { label: "設立", value: COMPANY.founded },
  { label: "本社", value: COMPANY.addressFull },
  { label: "TEL", value: COMPANY.tel, tel: true },
];

const FIELD =
  "mt-1 block w-full border border-line bg-paper px-2 py-1 text-s1 min-h-6 focus:border-ink";
const LABEL = "block text-s0 font-medium text-ink";

/** 06 会社情報＋CTA。未確定（資本金・建設業許可・従業員数）は行を作らない。 */
export default function CompanyContact({ variant = "default" }: { variant?: Variant }) {
  const drafting = variant === "drafting";
  const formReady = FORM_ENDPOINT.length > 0;

  return (
    <section aria-labelledby="company-title" className="py-7 md:py-9">
      <div className="shell">
        <SectionHead index="06" id="company-title" title="会社情報" />

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-7">
          <div>
            <dl className="border-b border-line">
              {ROWS.map((row, i) => (
                <Reveal
                  key={row.label}
                  delay={drafting ? i * 80 : i * 160}
                  distance={32}
                  duration={640}
                  className={[
                    "grid grid-cols-[104px_minmax(0,1fr)] gap-2 py-2 sm:grid-cols-[136px_minmax(0,1fr)]",
                    drafting ? "draft-row" : "border-t border-line",
                  ].join(" ")}
                >
                  <dt className="text-s0 text-steel">{row.label}</dt>
                  <dd className={row.tel ? "" : "text-s1"}>
                    {row.tel ? (
                      <a
                        href={COMPANY.telHref}
                        className="mono text-s1 underline-offset-4 hover:underline"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={480} distance={32} duration={640} className="mt-4">
              <Link href="/recruit/" className="cta cta--line">
                採用情報を見る
              </Link>
            </Reveal>
          </div>

          <div id="contact" className="scroll-mt-4">
            <Reveal distance={32} duration={640} className="relative border-t border-line pt-3">
              <span className="signal-tick absolute -top-px left-0 block h-px w-3" aria-hidden="true" />
              <h3 className="text-s3 md:text-s4">工事のご相談</h3>
              <p className="mt-2 text-s1 text-steel">
                工種・時期・場所が決まっていない段階でも構いません。お電話でも承ります。
              </p>
            </Reveal>

            <Reveal delay={160} distance={32} duration={640}>
              <form
                className="mt-4 flex flex-col gap-3"
                method="post"
                {...(formReady ? { action: FORM_ENDPOINT } : {})}
              >
                <div>
                  <label className={LABEL} htmlFor="topic">
                    相談内容<span className="text-steel">（必須）</span>
                  </label>
                  <select id="topic" name="相談内容" required className={FIELD} defaultValue="">
                    <option value="" disabled>
                      選択してください
                    </option>
                    {CONSULT_TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={LABEL} htmlFor="company">
                      会社名<span className="text-steel">（必須）</span>
                    </label>
                    <input
                      id="company"
                      name="会社名"
                      type="text"
                      required
                      autoComplete="organization"
                      className={FIELD}
                    />
                  </div>
                  <div>
                    <label className={LABEL} htmlFor="person">
                      担当者名<span className="text-steel">（必須）</span>
                    </label>
                    <input
                      id="person"
                      name="担当者名"
                      type="text"
                      required
                      autoComplete="name"
                      className={FIELD}
                    />
                  </div>
                  <div>
                    <label className={LABEL} htmlFor="tel">
                      電話
                    </label>
                    <input
                      id="tel"
                      name="電話"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={`${FIELD} mono`}
                    />
                  </div>
                  <div>
                    <label className={LABEL} htmlFor="email">
                      メール<span className="text-steel">（必須）</span>
                    </label>
                    <input
                      id="email"
                      name="メール"
                      type="email"
                      required
                      autoComplete="email"
                      className={FIELD}
                    />
                  </div>
                </div>

                <div>
                  <label className={LABEL} htmlFor="message">
                    内容<span className="text-steel">（必須）</span>
                  </label>
                  <textarea id="message" name="内容" required rows={5} className={FIELD} />
                </div>

                {/* honeypot（スパム対策・人には見せない） */}
                <p className="sr-only" aria-hidden="true">
                  <label htmlFor="_gotcha">この欄は入力しないでください</label>
                  <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <button type="submit" className="cta cta--fill" disabled={!formReady}>
                    送信する
                  </button>
                  <a href={COMPANY.telHref} className="mono text-s1 underline-offset-4 hover:underline">
                    {COMPANY.tel}
                  </a>
                </div>
                {formReady ? null : (
                  <p className="text-s0 text-steel">
                    このフォームは公開準備中です。お急ぎの場合はお電話でご連絡ください。
                  </p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
