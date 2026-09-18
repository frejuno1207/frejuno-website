/**
 * Google Fonts を「このサイトに出てくる文字だけ」に絞って取り込む。
 *
 * 日本語のWebフォントは約120の unicode-range に分割配信されるため、
 * 素直に読み込むと1ページで60〜100ファイル・1MB近くを取りに行く。
 * CSS2 API の text= で必要な字だけのサブセットを作らせ、自前で配信する。
 *
 * 生成物（どちらもコミットする。ビルド時にネットワークが無くても通る）
 *   public/_fonts/*.woff2
 *   lib/fonts.generated.ts  … @font-face のCSSとpreload対象
 *
 * 文字集合が変わらなければ何もしない。文言を直したら `npm run fonts` を実行する。
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";

const SOURCE_DIRS = ["app", "components", "lib"];
const FONT_DIR = "public/_fonts";
const GENERATED = "lib/fonts.generated.ts";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

/** 先読みするのは本文用と見出し用だけ。残りは通常読み込みに任せる */
const FACES = [
  { family: "Zen Kaku Gothic New", weight: 900, slug: "zen-900", preload: true },
  { family: "Zen Kaku Gothic New", weight: 700, slug: "zen-700", preload: false },
  { family: "Noto Sans JP", weight: 400, slug: "noto-400", preload: true },
  { family: "Noto Sans JP", weight: 500, slug: "noto-500", preload: false },
  { family: "Roboto Mono", weight: 400, slug: "mono-400", preload: false, latinOnly: true },
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if ([".ts", ".tsx", ".css"].includes(extname(full))) files.push(full);
  }
  return files;
}

const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i));
const found = new Set(ascii);

/** コメントは画面に出ない。サブセットを膨らませないよう落とす */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
}

for (const dir of SOURCE_DIRS) {
  for (const file of await walk(dir)) {
    for (const char of stripComments(await readFile(file, "utf8"))) {
      const point = char.codePointAt(0);
      if (point > 0x7e && point !== 0xfeff) found.add(char);
    }
  }
}

const text = [...found].sort().join("");
const latinText = ascii.join("");
const signature = createHash("sha256").update(text).digest("hex").slice(0, 16);

if (existsSync(GENERATED) && (await readFile(GENERATED, "utf8")).includes(`SIGNATURE = "${signature}"`)) {
  console.log(`[build-fonts] 文字集合に変化なし（${found.size}字 / ${signature}）。再取得しない`);
  process.exit(0);
}

await rm(FONT_DIR, { recursive: true, force: true });
await mkdir(FONT_DIR, { recursive: true });

const faceCss = [];
const preloads = [];

for (const face of FACES) {
  const query = new URLSearchParams({
    family: `${face.family}:wght@${face.weight}`,
    text: face.latinOnly ? latinText : text,
    display: "swap",
  });
  const response = await fetch(`https://fonts.googleapis.com/css2?${query}`, {
    headers: { "user-agent": UA },
  });
  if (!response.ok) throw new Error(`${face.family} ${face.weight}: ${response.status}`);
  const css = await response.text();

  const sources = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);
  const ranges = [...css.matchAll(/unicode-range:\s*([^;}]+)/g)].map((match) => match[1].trim());
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

console.log(`[build-fonts] ${found.size}字を ${faceCss.length}個の@font-faceに収めた（${signature}）`);
