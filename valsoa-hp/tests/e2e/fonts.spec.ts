import { expect, test } from "@playwright/test";

/**
 * フォントは「その書体が実際に描く文字だけ」のサブセットを自前配信している
 * （scripts/build-fonts.mjs）。取りこぼすと、その文字だけ端末のフォントで出る。
 *
 * 判定には document.fonts.load(spec, char) を使う。
 * 返るFontFaceが0件なら、その字を持つ@font-faceが無い＝端末のフォントに落ちる。
 * （document.fonts.check は端末のフォントで描ける場合もtrueを返すので使えない）
 */
const PAGES = ["/", "/b/", "/c/", "/d/", "/qualifications/", "/recruit/", "/directions/"];
const WEB_FAMILIES = ["Zen Kaku Gothic New", "Noto Sans JP", "Roboto Mono"];

type Missing = { char: string; stack: string; weight: string; sample: string };

const AUDIT = `(async (families) => {
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = (node.textContent || "").replace(/\\s/g, "");
    if (!text) continue;
    const element = node.parentElement;
    if (!element) continue;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const stack = style.fontFamily
      .split(",")
      .map((name) => name.trim().replace(/^["']|["']$/g, ""))
      .filter((name) => families.includes(name));
    if (stack.length === 0) continue;
    nodes.push({ text, stack, weight: style.fontWeight, size: style.fontSize });
  }

  const cache = new Map();
  const covered = async (family, weight, size, char) => {
    const key = family + weight + size + char;
    if (!cache.has(key)) {
      let faces = [];
      try {
        faces = await document.fonts.load(\`\${weight} \${size} "\${family}"\`, char);
      } catch (error) {
        void error;
      }
      cache.set(key, faces.length > 0);
    }
    return cache.get(key);
  };

  const missing = [];
  for (const node of nodes) {
    for (const char of new Set(node.text)) {
      let ok = false;
      for (const family of node.stack) {
        if (await covered(family, node.weight, node.size, char)) {
          ok = true;
          break;
        }
      }
      if (!ok) {
        missing.push({
          char,
          stack: node.stack.join("/"),
          weight: node.weight,
          sample: node.text.slice(0, 16),
        });
      }
    }
  }
  return missing;
})`;

test.describe("サブセットの取りこぼし", () => {
  for (const path of PAGES) {
    test(`${path} は全文字がWebフォントで出る`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const missing = await page.evaluate<Missing[], string[]>(
        `${AUDIT}(${JSON.stringify(WEB_FAMILIES)})`,
        WEB_FAMILIES,
      );
      expect(missing, `${path} で端末のフォントに落ちる文字`).toEqual([]);
    });
  }
});
