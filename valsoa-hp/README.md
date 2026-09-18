# 株式会社バルソア コーポレートサイト

岡山市の鉄工事会社（製缶・鍛冶／据付・配管）のコーポレートサイト。
読み手は **元請の工事・調達担当** と **求職者**。一般消費者向けではない。

- 施工写真・人物写真が無いため、**画像を1枚も使わない**（ダミー画像・アイコンフォント・絵文字も使わない）
- 自社工場は無いので「工場」「設備」を語らない
- 実績数値・保有資格・資本金・建設業許可は未確定。**未確定の行は作らない**（「確認中」とも書かない）

## トップページのデザイン4方向

構成・文言・セクション順は4方向とも共通。違うのは「ヒーローの場の作り方」と「登場の演出」だけ。

| 方向 | URL | 場の作り方 |
| --- | --- | --- |
| A UPDRAFT FIELD | `/` | WebGLの気流シェーダ。社名の由来（上昇気流）を背景そのものにする |
| B STEEL SHEEN | `/b/` | WebGLの鋼面シェーダ。ヒーローだけ暗い鋼、反射が20秒周期で1回通る |
| C DRAFTING LINES | `/c/` | SVG＋CSSの作図。2.4秒で引き終わり、以後は完全に静止する |
| D TYPE ONLY | `/d/` | 場を作らない。文字組と余白だけ。A〜Cを評価するための基準線 |

比較用の索引は `/directions/`。`/b/ /c/ /d/ /directions/` は `noindex` にしてあるので、
採用した方向を `app/page.tsx` に移し、残りのディレクトリを削除すれば公開形になる。

## コマンド

```bash
npm install
npm run dev            # 開発
npm run check          # eslint + tsc（コミット前に必ず）
npm run build          # 静的書き出し → out/
npm run fonts          # 文言を変えたらこれ（build後にサブセットを作り直す）
npm run test:e2e       # Playwright（安全条件の実測）
npm run lh             # Lighthouse モバイル（公開ゲートの実測）
```

`test:e2e` と `lh` は `out/` を配信して測る。先に `npm run build` を通すこと。
この環境のChromiumを使う場合は `PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium` を渡す。

## 技術

- Next.js App Router / TypeScript / `output: "export"`（静的書き出し）
- Tailwind CSS v4。**ランタイムの外部ライブラリは無し**（WebGLは生で実装）
- フォントは Google Fonts のみ（Zen Kaku Gothic New 700/900・Noto Sans JP 400/500・Roboto Mono 400）

### フォントの扱い（`npm run fonts`）

日本語のGoogle Fontsは約120の `unicode-range` に分割配信されるため、素直に読むと
1ページで60〜100ファイル・約960KBを取りに行く。さらにLCPは「見出しの書体が
落ちてくる時刻」で決まるので、見出し用の書体に本文の全文字を入れるとその分だけ遅れる。

そこで書き出し済みのHTMLを読んで書体ごとに文字を振り分け、CSS2 APIの `text=` で
**その書体が実際に描く文字だけ**のサブセットを作り、自前で配信している。

| 書体 | 入れる文字 | 実測 |
| --- | --- | --- |
| Zen Kaku Gothic New 900 | h1〜h4 / `.font-display` / `.cta` の中の文字（199字） | 20KB |
| Zen Kaku Gothic New 700 | 同上 | 20KB |
| Noto Sans JP 400 | ページに出る全文字（377字） | 58KB |
| Roboto Mono 400 | ASCIIのみ | 7KB |

- 合計 4ファイル・105KB（素直に読み込んだ場合は66ファイル・959KB）
- 生成物: `public/_fonts/*.woff2` と `lib/fonts.generated.ts`（どちらもコミット済み。
  ビルド時にネットワークは要らない）
- `@font-face` は `<head>` に直接書き出すのでフォント用のCSSリクエストは0。
  レンダーブロッキングCSSは自前の5KBだけ
- **文言を変えたら `npm run fonts && npm run build` を実行する**。
  実行しないと新しい文字が端末のフォントで出る
- 取りこぼしは `tests/e2e/fonts.spec.ts` が検出する（全テキストノードについて、
  実際に当たる書体がその文字を持っているかを見る）
- 入力欄（input/select/textarea）は利用者が何を打つか分からないので、最初から端末のフォントで組む
- Noto Sans JP 500 は使っていない（使い所がフォームのラベルだけで、
  1書体60KBを足す価値が無かった）。使う場合は `scripts/build-fonts.mjs` の `FACES` に戻す

## 設計トークン（`app/globals.css`）

| 変数 | 値 | 用途 |
| --- | --- | --- |
| `--paper` | `#F2F3F5` | 地・余白 |
| `--ink` | `#0E1418` | 文字・CTAの塗り |
| `--steel` | `#5C6A76` | 補助文字 |
| `--line` | `#D3D8DD` | 1px罫線 |
| `--signal` | `#B08536` | 差し色（接点のみ。面・グローには使わない） |

- 角丸ゼロ・影ゼロ・罫は1px固定。余白は8pxの倍数のみ（Tailwindの `--spacing` を8pxにして強制）
- 型スケールは7段のみ: 14/16/20/25/31/39/49px（`text-s0` 〜 `text-s6`）
- 見出し Zen Kaku Gothic New 900 / 本文 Noto Sans JP 400 / 数値 Roboto Mono + tabular-nums
- Tailwindの既定パレット・既定サイズ・角丸・影は `initial` で消してある（この5色・7段の外に出られない）

## モーションの規則

1. 上昇のみ。落下・バウンドはしない（`cubic-bezier(.16,1,.3,1)`）
2. 連鎖。同時に発火しない（160〜220msずつ。タグ列だけ40ms）
3. `--signal` は接点だけ。着地の瞬間に一瞬明るくなって落ち着く
4. ファーストビューより下は 32〜56px・640〜800ms
5. 背景の動きは呼吸より遅い（12秒周期・輝度差は地色±5%以内、30fpsで足りる）

実装上の安全弁:

- H1・サブ・CTA・電話番号は**初期状態から可視**。`opacity:0` を起点にしない
- 動かすのは `transform` と `opacity` だけ（例外はCの `stroke-dashoffset`。どちらもレイアウトを動かさない）
- IntersectionObserverは一度だけ発火して `unobserve`
- `prefers-reduced-motion: reduce` で全停止・全可視
- JSが無効／落ちても全要素が見える（登場前の不可視はJS有効時のみCSSで適用し、3秒で自動解除）
- 背景シェーダは画面外・非表示タブで停止、WebGL非対応時はCSSグラデーションに落ちる

## 公開前にやること

`ONBOARDING.md` のチェックリストに従う。特に次の2つは**未設定のまま公開しない**。

- `NEXT_PUBLIC_SITE_URL`（canonical・OGP・sitemap・JSON-LD に入る。現在は仮ドメイン）
- `NEXT_PUBLIC_FORM_ENDPOINT`（未設定の間、送信ボタンは無効で表示される）
