import { mkdir, writeFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const DIRECTIONS = [
  { id: "A", name: "UPDRAFT FIELD", path: "/" },
  { id: "B", name: "STEEL SHEEN", path: "/b/" },
  { id: "C", name: "DRAFTING LINES", path: "/c/" },
  { id: "D", name: "TYPE ONLY", path: "/d/" },
] as const;

const WIDTHS = [375, 390, 768, 1440] as const;

const SECTION_TITLES = ["二つの仕事", "できること", "保有資格", "すべての価値に、上昇気流を。", "会社情報"];

type Report = Record<string, unknown>;
const report: Report = {};

test.afterAll(async () => {
  await mkdir("test-results", { recursive: true });
  await writeFile("test-results/measurements.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
});

/** 画面外要素も含めて着地させてから測る */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 1200));
  });
}

/** 実効opacity（祖先の積）とtransformを集める */
const AUDIT = `(() => {
  const identity = (t) => t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)";
  const effective = (el) => {
    let value = 1;
    let node = el;
    while (node && node instanceof Element) {
      value *= Number(getComputedStyle(node).opacity);
      node = node.parentElement;
    }
    return value;
  };
  const faded = [];
  const moved = [];
  for (const el of Array.from(document.body.querySelectorAll("*"))) {
    const hasOwnText = Array.from(el.childNodes).some(
      (n) => n.nodeType === 3 && (n.textContent || "").trim().length > 0,
    );
    const isControl = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(el.tagName);
    if (!hasOwnText && !isControl) continue;
    if (el.closest("[hidden]") || el.closest(".sr-only")) continue;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    // display:none の祖先を持つ要素（別ブレークポイント用の代替表示）は対象外
    if (el.getClientRects().length === 0) continue;
    const value = effective(el);
    if (value < 0.75) faded.push({ tag: el.tagName, text: (el.textContent || "").trim().slice(0, 24), opacity: Number(value.toFixed(3)) });
    if (!identity(style.transform)) moved.push({ tag: el.tagName, transform: style.transform });
  }
  const reveals = Array.from(document.querySelectorAll("[data-reveal]")).filter((el) => {
    const style = getComputedStyle(el);
    return Number(style.opacity) < 1 || !identity(style.transform);
  }).length;
  return { faded, moved, reveals };
})()`;

test.describe("横スクロール量", () => {
  for (const direction of DIRECTIONS) {
    test(`方向${direction.id} の横スクロール`, async ({ page }) => {
      const measured: Record<string, number> = {};
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(direction.path, { waitUntil: "load" });
        await settle(page);
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return Math.max(
            doc.scrollWidth - doc.clientWidth,
            document.body.scrollWidth - doc.clientWidth,
          );
        });
        measured[`${width}px`] = overflow;
        expect(overflow, `${direction.id} @${width}px`).toBe(0);
      }
      report[`overflow_${direction.id}`] = measured;
    });
  }
});

test.describe("初期状態の可視性", () => {
  for (const direction of DIRECTIONS) {
    test(`方向${direction.id} のH1・サブ・CTA・電話番号`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 800 });
      await page.goto(direction.path, { waitUntil: "commit" });
      // H1がDOMに現れた瞬間（load前・ハイドレーション前）の値を測る
      await page.waitForSelector("h1", { state: "attached" });
      const initial = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        if (!h1) return null;
        let value = 1;
        let node: Element | null = h1;
        while (node) {
          value *= Number(getComputedStyle(node).opacity);
          node = node.parentElement;
        }
        return {
          opacity: Number(getComputedStyle(h1).opacity),
          effective: Number(value.toFixed(3)),
          transform: getComputedStyle(h1).transform,
        };
      });
      expect(initial?.opacity).toBe(1);
      expect(initial?.effective).toBe(1);

      await page.waitForLoadState("load");
      const hero = {
        h1: await page.locator("h1").first().isVisible(),
        sub: await page.getByText("製缶・鍛冶、据付・配管。").first().isVisible(),
        tel: await page.locator('a[href^="tel:"]').first().isVisible(),
        cta: await page.getByRole("link", { name: "工事のご相談" }).first().isVisible(),
      };
      expect(Object.values(hero).every(Boolean)).toBe(true);
      report[`initial_${direction.id}`] = { ...initial, ...hero };
    });
  }
});

test.describe("prefers-reduced-motion: reduce", () => {
  for (const direction of DIRECTIONS) {
    test(`方向${direction.id} は全停止・全可視`, async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 800 } });
      const page = await context.newPage();
      await page.goto(direction.path, { waitUntil: "load" });
      await settle(page);
      const audit = (await page.evaluate(AUDIT)) as { faded: unknown[]; moved: unknown[]; reveals: number };
      report[`reduced_${direction.id}`] = {
        faded: audit.faded.length,
        moved: audit.moved.length,
        pendingReveals: audit.reveals,
        detail: audit.faded,
      };
      expect(audit.faded).toEqual([]);
      expect(audit.reveals).toBe(0);
      await context.close();
    });
  }
});

test.describe("JavaScript無効", () => {
  for (const direction of DIRECTIONS) {
    test(`方向${direction.id} は全セクションが見える`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
      const page = await context.newPage();
      await page.goto(direction.path, { waitUntil: "load" });
      // 方向CのCSS作図は2.4秒で完了する。その後に測る
      await page.waitForTimeout(2800);
      const visible: Record<string, boolean> = { "01 ヒーロー": await page.locator("h1").first().isVisible() };
      for (const title of SECTION_TITLES) {
        visible[title] = await page.getByRole("heading", { name: title }).first().isVisible();
      }
      const audit = (await page.evaluate(AUDIT)) as { faded: unknown[]; reveals: number };
      report[`nojs_${direction.id}`] = { sections: visible, faded: audit.faded.length, pendingReveals: audit.reveals };
      expect(Object.values(visible).every(Boolean)).toBe(true);
      expect(audit.faded).toEqual([]);
      expect(audit.reveals).toBe(0);
      await context.close();
    });
  }
});
