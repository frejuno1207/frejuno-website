/**
 * Google Fonts を「その書体が実際に描く文字だけ」に絞って取り込む。
 *
 * 日本語のWebフォントは約120の unicode-range に分割配信されるため、
 * 素直に読み込むと1ページで60〜100ファイル・1MB近くを取りに行く。
 * さらにLCPは「見出しの書体が落ちてくる時刻」で決まるので、
 * 見出し用の書体に本文の全文字を入れると、その分だけLCPが遅れる。
 *
 * そこで書き出し済みのHTMLを読み、
 *   見出し用（Zen Kaku Gothic New）… h1〜h4 / .font-display / .cta の中の文字
 *   本文用（Noto Sans JP）        … ページに出る全文字
 *   等幅（Roboto Mono）            … ASCIIのみ
 * に振り分け、CSS2 API の text= で必要な字だけのサブセットを作らせる。
 *
 * 生成物（どちらもコミットする。ビルド時にネットワークが無くても通る）
 *   public/_fonts/*.woff2
 *   lib/fonts.generated.ts  … @font-face のCSSとpreload対象
 *
 * 使い方: npm run fonts（先に next build が走る）→ npm run build
 * 取りこぼしは tests/e2e/fonts.spec.ts が検出する。
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";

const OUT_DIR = "out";
const FONT_DIR = "public/_fonts";
const GENERATED = "lib/fonts.generated.ts";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/** 先読みするのは見出し用と本文用だけ。残りは通常読み込みに任せる */
const FACES = [
  { family: "Zen Kaku Gothic New", weight: 900, slug: "zen-900", set: "display", preload: true },
  { family: "Zen Kaku Gothic New", weight: 700, slug: "zen-700", set: "display", preload: false },
  { family: "Noto Sans JP", weight: 400, slug: "noto-400", set: "body", preload: true },
  { family: "Roboto Mono", weight: 400, slug: "mono-400", set: "ascii", preload: false },
];

/** 見出し用の書体が当たる要素 */
const DISPLAY_TAGS = new Set(["h1", "h2", "h3", "h4"]);
const DISPLAY_CLASSES = ["font-display", "cta"];
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param",
  "source", "track", "wbr", "path", "rect", "line", "circle", "ellipse", "polygon",
  "polyline", "use", "stop", "image",
]);

function decode(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) =>
      String.fromCodePoint(code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code)),
    )
    .replace(/&#x27;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&");
}

function isDisplayTag(tag, attributes) {
  if (DISPLAY_TAGS.has(tag)) return true;
  const className = attributes.match(/\sclass="([^"]*)"/)?.[1] ?? "";
  return DISPLAY_CLASSES.some((name) => className.split(/\s+/).includes(name));
}

/** 書き出し済みHTMLから「全文字」と「見出し用の文字」を集める */
function collect(html, body, display) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;
  const stack = [];
  let depth = 0;
  let cursor = 0;
  let match;

  const take = (raw) => {
    if (!raw.trim()) return;
    for (const char of decode(raw)) {
      body.add(char);
      if (depth > 0) display.add(char);
    }
  };

  while ((match = tagPattern.exec(clean)) !== null) {
    take(clean.slice(cursor, match.index));
    cursor = tagPattern.lastIndex;

    const [, closing, rawTag, attributes, selfClosing] = match;
    const tag = rawTag.toLowerCase();
    if (VOID_TAGS.has(tag) || selfClosing) continue;

    if (closing) {
      while (stack.length > 0) {
        const entry = stack.pop();
        if (entry.display) depth -= 1;
        if (entry.tag === tag) break;
      }
    } else {
      const display_ = isDisplayTag(tag, attributes);
      stack.push({ tag, display: display_ });
      if (display_) depth += 1;
    }
  }
  take(clean.slice(cursor));
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

if (!existsSync(OUT_DIR)) {
  console.error(`[build-fonts] ${OUT_DIR}/ が無い。先に next build を通すこと`);
  process.exit(1);
}

const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i));
const body = new Set(ascii);
const display = new Set(ascii);

for (const file of (await walk(OUT_DIR)).filter((f) => extname(f) === ".html")) {
  collect(await readFile(file, "utf8"), body, display);
}

const sets = {
  body: [...body].sort().join(""),
  display: [...display].sort().join(""),
  ascii: ascii.join(""),
};
const signature = createHash("sha256")
  .update(`${JSON.stringify(FACES)}\n${sets.body}\n${sets.display}`)
  .digest("hex")
  .slice(0, 16);

if (existsSync(GENERATED) && (await readFile(GENERATED, "utf8")).includes(`SIGNATURE = "${signature}"`)) {
  console.log(`[build-fonts] 変化なし（本文${body.size}字 / 見出し${display.size}字）。再取得しない`);
  process.exit(0);
}

await rm(FONT_DIR, { recursive: true, force: true });
await mkdir(FONT_DIR, { recursive: true });

const faceCss = [];
const preloads = [];

for (const face of FACES) {
  const query = new URLSearchParams({
    family: `${face.family}:wght@${face.weight}`,
    text: sets[face.set],
    display: "swap",
  });
  const response = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
    headers: { "user-agent": UA },
  });
  if (!response.ok) throw new Error(`${face.family} ${face.weight}: ${response.status}`);
  const css = await response.text();

  const sources = [...css.matchAll(/url\(([^)]+)\)/g)].map((item) => item[1]);
  const ranges = [...css.matchAll(/unicode-range:\s*([^;}]+)/g)].map((item) => item[1].trim());
  if (sources.length === 0) throw new Error(`${face.family} ${face.weight}: woff2が返らなかった`);

  for (const [index, source] of sources.entries()) {
    const name = sources.length > 1 ? `${face.slug}-${index + 1}` : face.slug;
    const file = `${name}.woff2`;
    const binary = await fetch(source, { headers: { "user-agent": UA } });
    if (!binary.ok) throw new Error(`${file}: ${binary.status}`);
    const bytes = Buffer.from(await binary.arrayBuffer());
    await writeFile(join(FONT_DIR, file), bytes);

    faceCss.push(
      `@font-face{font-family:"${face.family}";font-style:normal;font-weight:${face.weight};` +
        `font-display:swap;src:url(/_fonts/${file}) format("woff2");` +
        (ranges[index] ? `unicode-range:${ranges[index]};` : "") +
        `}`,
    );
    if (face.preload && index === 0) preloads.push(`/_fonts/${file}`);
    console.log(`[build-fonts] ${file} ${Math.round(bytes.length / 1024)}KB`);
  }
}

await writeFile(
  GENERATED,
  `/* 自動生成: npm run fonts で更新する。手で触らない。 */\n` +
    `export const SIGNATURE = "${signature}";\n` +
    `export const FONT_FACE_CSS = ${JSON.stringify(faceCss.join(""))};\n` +
    `export const FONT_PRELOADS = ${JSON.stringify(preloads)} as const;\n`,
  "utf8",
);

console.log(
  `[build-fonts] 本文${body.size}字 / 見出し${display.size}字 を ${faceCss.length}個の@font-faceに収めた（${signature}）`,
);
