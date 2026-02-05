# デプロイ手順

## 現状
✅ ウェブサイトMVP完成
✅ 実際のAt Home情報に基づく物件データ（1件）
✅ Google Maps API統合済み
✅ サンドカラーデザイン適用済み

---

## 📸 画像の準備（最優先）

### At Homeから画像を取得

#### 1. 会社写真
**URL:** https://www.athome.co.jp/ahcs/frejuno.html

**取得する画像：**
- 室内写真（2枚）
- 会社外観/内観

**保存先：** `website/images/`
- `company-interior-1.jpg`
- `company-interior-2.jpg`

**使用場所：** 会社概要ページ、ヒーロー画像候補

---

#### 2. 物件写真
**URL:** https://www.athome.co.jp/kodate/6989126396/

**取得する画像：**
- 間取図 → `property-takako-floorplan.jpg`
- 外観3枚 → `property-takako-exterior-1.jpg` ～ `-3.jpg`
- リビング2枚 → `property-takako-living-1.jpg`, `-2.jpg`
- キッチン → `property-takako-kitchen.jpg`
- その他（バス、トイレ、洗面、室内、収納）

**最低限必要：**
- 外観1枚（サムネイル用）
- 間取図
- リビング1枚

---

#### 3. ヒーロー画像
**オプション：**
- 会社外観
- 松山市の風景
- 物件の魅力的な外観

**ファイル名：** `hero-background.jpg`
**サイズ:** 1920x600px 以上

---

## 🚀 Xserverへのアップロード

### 方法1: FTP（推奨）
1. FTPクライアント（FileZilla等）でXserverに接続
2. `/public_html/` フォルダを開く
3. `website/*` の全ファイルをアップロード

### 方法2: ファイルマネージャー
1. Xserverコントロールパネルにログイン
2. ファイルマネージャーを開く
3. `/public_html/` に移動
4. `website/*` をアップロード（ZIPで圧縮してアップ→解凍も可）

---

## ✅ 公開後の確認項目

### 基本動作
- [ ] https://frejuno.com でアクセス可能
- [ ] 全ページが表示される
- [ ] リンクが正しく動作する

### Google Maps
- [ ] 会社概要ページで地図が表示される
- [ ] 正しい位置（井門町551-5）が表示される
- [ ] マーカーをクリックすると会社情報が表示される

### 物件一覧
- [ ] 物件カードが表示される
- [ ] 絞り込みが動作する
- [ ] 価格が正しく表示される（¥2,530万円）

### スマホ表示
- [ ] レスポンシブデザインが動作する
- [ ] タップ操作が快適
- [ ] 文字サイズが読みやすい

---

## 📝 公開後にすぐ追加すべきもの

### 優先度1（今週中）
1. **物件写真の追加**
   - At Homeから取得した画像を配置
   - `properties.js` の `image` パスを更新

2. **お問い合わせフォーム送信機能**
   - バックエンド実装（PHP等）
   - または外部フォームサービス連携

### 優先度2（2週間以内）
1. **物件詳細ページ**
   - `property-detail.html` 作成
   - Google Places API統合（周辺施設）
   - 間取図・ギャラリー表示

2. **物件データ追加**
   - At Homeの他の物件があれば追加
   - 最低3-5件は欲しい

---

## 🔧 技術情報

### ファイル構成
```
/public_html/
├── index.html
├── about.html
├── properties.html
├── contact.html
├── privacy.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   ├── maps.js
│   ├── properties.js
│   └── main.js
└── images/
    └── (写真をここに配置)
```

### APIキー
- Google Maps API Key: 既に設定済み
- リファラー制限: `frejuno.com/*`, `localhost:*/*`

### 連絡先
- サイト管理: Juno（AI）
- 技術サポート: clawd-fushiguro（サイト運用担当）

---

作成日：2026-02-05
更新者：Juno 🌙
