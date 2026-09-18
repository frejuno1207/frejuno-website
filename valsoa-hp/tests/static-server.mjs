import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

const ROOT = new URL("../out/", import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolve(pathname) {
  const clean = normalize(decodeURIComponent(pathname.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/")
    ? [join(ROOT, clean, "index.html")]
    : [join(ROOT, clean), join(ROOT, `${clean}.html`), join(ROOT, clean, "index.html")];

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* 次の候補へ */
    }
  }
  return null;
}

/** 本番（Cloudflare Pages等）と同じ条件で測るため、テキストは圧縮して返す */
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".svg", ".txt", ".xml"]);
const cache = new Map();

function encode(file, raw, accept, version) {
  if (!COMPRESSIBLE.has(extname(file))) return { body: raw, encoding: null };
  const key = `${file}:${version}:${accept.includes("br") ? "br" : accept.includes("gzip") ? "gzip" : "raw"}`;
  if (cache.has(key)) return cache.get(key);
  let result = { body: raw, encoding: null };
  if (accept.includes("br")) {
    result = {
      body: brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }),
      encoding: "br",
    };
  } else if (accept.includes("gzip")) {
    result = { body: gzipSync(raw, { level: 6 }), encoding: "gzip" };
  }
  cache.set(key, result);
  return result;
}

createServer(async (request, response) => {
  const file = await resolve(request.url ?? "/");
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("404");
    return;
  }
  const raw = await readFile(file);
  const version = (await stat(file)).mtimeMs; // 再ビルド後に古い圧縮結果を返さない
  const { body, encoding } = encode(file, raw, String(request.headers["accept-encoding"] ?? ""), version);
  const immutable = file.includes("/_next/static/");
  response.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": immutable ? "public, max-age=31536000, immutable" : "no-store",
    ...(encoding ? { "content-encoding": encoding, vary: "Accept-Encoding" } : {}),
  });
  response.end(body);
}).listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`static server on http://127.0.0.1:${PORT}\n`);
});
