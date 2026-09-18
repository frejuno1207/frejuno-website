/**
 * out/ を静的配信した状態で Lighthouse（モバイル）を実行し、
 * 公開ゲートの数値をまとめて出す。
 *   node scripts/lh.mjs [/path ...]
 */
import { writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = process.env.LH_BASE ?? "http://127.0.0.1:4321";
const paths = process.argv.slice(2);
const targets = paths.length > 0 ? paths : ["/", "/b/", "/c/", "/d/"];

const server = spawn(process.execPath, ["tests/static-server.mjs"], { stdio: "ignore" });
await new Promise((resolve) => setTimeout(resolve, 800));

const chrome = await chromeLauncher.launch({
  chromePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

const rows = [];
const failures = {};
await mkdir("test-results", { recursive: true });
const RUNS = Number(process.env.LH_RUNS ?? 3);

async function runOnce(path) {
  const result = await lighthouse(
    `${BASE}${path}`,
    { port: chrome.port, output: "json", logLevel: "error" },
    undefined,
  );
  return result.lhr;
}

// 1回目は必ず遅い（プロファイル生成・圧縮キャッシュ）ので捨てる
await runOnce(targets[0]);

for (const path of targets) {
  const runs = [];
  for (let i = 0; i < RUNS; i += 1) runs.push(await runOnce(path));
  runs.sort((a, b) => (a.categories.performance.score ?? 0) - (b.categories.performance.score ?? 0));
  const lhr = runs[Math.floor(runs.length / 2)]; // 中央値
  const lcpAudit = lhr.audits["largest-contentful-paint-element"];
  const lcpNode =
    lcpAudit?.details?.items?.[0]?.items?.[0]?.node?.snippet ??
    lcpAudit?.details?.items?.[0]?.node?.snippet ??
    "-";
  const scriptBytes = (lhr.audits["network-rtt"] ? lhr.audits["resource-summary"] : null)?.details?.items?.find(
    (item) => item.resourceType === "script",
  );

  rows.push({
    path,
    performance: Math.round((lhr.categories.performance.score ?? 0) * 100),
    accessibility: Math.round((lhr.categories.accessibility.score ?? 0) * 100),
    bestPractices: Math.round((lhr.categories["best-practices"].score ?? 0) * 100),
    seo: Math.round((lhr.categories.seo.score ?? 0) * 100),
    lcpMs: Math.round(lhr.audits["largest-contentful-paint"].numericValue),
    fcpMs: Math.round(lhr.audits["first-contentful-paint"].numericValue),
    tbtMs: Math.round(lhr.audits["total-blocking-time"].numericValue),
    cls: Number(lhr.audits["cumulative-layout-shift"].numericValue.toFixed(4)),
    speedIndexMs: Math.round(lhr.audits["speed-index"].numericValue),
    lcpElement: String(lcpNode).replace(/\s+/g, " ").slice(0, 80),
    scriptKB: scriptBytes ? Math.round(scriptBytes.transferSize / 102.4) / 10 : null,
    scriptRequests: scriptBytes ? scriptBytes.requestCount : null,
  });

  failures[path] = Object.values(lhr.audits)
    .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== "informative")
    .map((audit) => `${audit.id}: ${audit.title}`);
  process.stdout.write(`${path} done (${RUNS}回の中央値)\n`);
}

await chrome.kill();
server.kill();
await writeFile(
  "test-results/lighthouse.json",
  `${JSON.stringify({ rows, failures }, null, 2)}\n`,
  "utf8",
);
console.table(rows);
for (const [path, list] of Object.entries(failures)) {
  console.log(`\n${path} 未達の監査:`);
  for (const item of list) console.log(`  - ${item}`);
}
