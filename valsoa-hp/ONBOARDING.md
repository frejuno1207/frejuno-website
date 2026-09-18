# 公開までのチェックリスト（コード外の設定）

コードに含められない設定をここで潰す。すべて**顧客名義**で取得する。

## 1. 公開前に必ず差し替える

| 項目 | 変数 | 現在の値 | 状態 |
| --- | --- | --- | --- |
| 本番ドメイン | `NEXT_PUBLIC_SITE_URL` | `https://valsoa.co.jp`（仮） | 未確定・要確認 |
| 相談フォーム送信先 | `NEXT_PUBLIC_FORM_ENDPOINT` | 未設定 | 未設定の間、送信ボタンは無効で表示される |

`.env.production.local`（またはホスティング側の環境変数）に置く。

```
NEXT_PUBLIC_SITE_URL=https://example.co.jp
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

`NEXT_PUBLIC_SITE_URL` は canonical・OGP・sitemap.xml・robots.txt・JSON-LD の `url` に入る。
仮ドメインのまま公開しない。

## 2. サイトに載せていない情報（確定したら追加する）

未確定のため**行ごと出していない**。確定した順に追加する。

- 建設業許可番号
- 資本金
- 従業員数
- 保有資格の一覧（`/qualifications` の中身）
- 施工実績・実績数値
- 採用の募集職種・待遇（`/recruit` の中身）

## 3. 外部サービス

- [ ] Formspree: フォーム作成 → 通知先メール設定 → 実通テスト（送信→通知→自動返信）
- [ ] Cloudflare Turnstile: サイトキー発行 → フォームに組み込み（honeypot `_gotcha` は実装済み）
- [ ] GA4 / Search Console: 顧客名義で作成、sitemap.xml を送信
- [ ] Google ビジネスプロフィール: NAP（名称・住所・電話）をサイトと一致させる
- [ ] UptimeRobot: 死活監視
- [ ] Bitwarden: 認証情報の受け渡し（メール平文で送らない）

## 4. ホスティング

Cloudflare Pages（無料・商用可）を想定。

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `out`
- Node バージョン: 22
- 圧縮（brotli/gzip）が有効であること。公開ゲートの数値は圧縮ありを前提にしている
