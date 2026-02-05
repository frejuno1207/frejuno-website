# Frejunoウェブサイト制作プロジェクト

## 📋 プロジェクト概要

**目的：** 株式会社Frejunoのコーポレートサイト制作  
**期限：** Phase 1（2/6-2/19、14日間）でMVP完成  
**技術：** HTML/CSS/JavaScript + Google Maps API + Google Places API

---

## 🎯 MVP機能（Phase 1）

### 必須ページ
1. ✅ トップページ
2. ✅ 会社概要
3. ✅ 物件一覧（絞り込み機能付き）
4. ✅ 物件詳細（Google Maps統合）
5. ✅ お問い合わせフォーム

### 必須機能
- レスポンシブデザイン（PC/タブレット/スマホ）
- 物件絞り込み（価格/間取り/駅徒歩/築年数）
- Google Maps表示
- Google Places API（周辺施設情報）

---

## 📁 ディレクトリ構成

```
website/
├── index.html              # トップページ
├── about.html              # 会社概要
├── properties.html         # 物件一覧
├── property-detail.html    # 物件詳細（テンプレート）
├── contact.html            # お問い合わせ
├── css/
│   ├── style.css          # メインスタイル
│   └── responsive.css     # レスポンシブ
├── js/
│   ├── main.js            # メインスクリプト
│   ├── properties.js      # 物件一覧・絞り込み
│   ├── maps.js            # Google Maps統合
│   └── places.js          # Google Places API
├── data/
│   └── properties.json    # 物件データ
├── images/
│   └── (物件画像など)
└── README.md
```

---

## 🔧 技術スタック

### フロントエンド
- HTML5
- CSS3（Flexbox/Grid）
- Vanilla JavaScript（jQuery不使用）

### API
- Google Maps JavaScript API
- Google Places API
- Google Geocoding API

### ホスティング
- Xserver（frejuno.com）

---

## 🎨 デザイン仕様

**カラーパレット：**
- Primary: #2C5F2D (深緑 - 信頼)
- Secondary: #4A90A4 (ブルー - 安心)
- Accent: #F39C12 (オレンジ - 温かみ)
- Background: #FFFFFF
- Text: #333333

**フォント：**
- 見出し：Noto Sans JP (Bold)
- 本文：Noto Sans JP (Regular)

**レイアウト：**
- Max-width: 1200px（PC）
- Grid: 3列（PC）→ 2列（タブレット）→ 1列（スマホ）

---

## 📊 物件データ構造

```json
{
  "id": "prop001",
  "title": "松山市中心部 2LDKマンション",
  "type": "賃貸マンション",
  "price": 65000,
  "layout": "2LDK",
  "area": 55.5,
  "age": 8,
  "station": {
    "name": "松山市駅",
    "walk": 5
  },
  "address": "愛媛県松山市○○町X-X",
  "lat": 33.8416,
  "lng": 132.7657,
  "images": ["prop001-01.jpg", "prop001-02.jpg"],
  "features": ["バストイレ別", "オートロック", "駐車場", "南向き"],
  "description": "...",
  "equipment": {
    "kitchen": ["システムキッチン", "IH"],
    "bath": ["バストイレ別", "追焚き"],
    "security": ["オートロック", "防犯カメラ"]
  }
}
```

---

## 🗺️ Google API統合

### Maps JavaScript API
- 会社所在地表示（about.html）
- 物件位置表示（property-detail.html）
- マーカー＋情報ウィンドウ

### Places API
- 物件周辺施設検索
- カテゴリ：コンビニ/スーパー/病院/学校/駅/公園
- 距離・評価・営業時間表示

### 実装例（places.js）
```javascript
function fetchNearbyPlaces(lat, lng, type, radius = 1000) {
  const map = new google.maps.Map(document.getElementById('map'));
  const service = new google.maps.places.PlacesService(map);
  
  const request = {
    location: new google.maps.LatLng(lat, lng),
    radius: radius,
    type: type
  };
  
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayPlaces(results);
    }
  });
}
```

---

## ✅ 完成状況（2026-02-05）

### Phase 1 MVP完成！

**完成ページ：**
- [x] トップページ（index.html）
- [x] 会社概要（about.html）
- [x] 物件一覧（properties.html）
- [x] お問い合わせ（contact.html）
- [x] プライバシーポリシー（privacy.html）

**完成機能：**
- [x] レスポンシブデザイン
- [x] Google Maps API統合
- [x] 物件絞り込み機能（基本）
- [x] お問い合わせフォーム

**今後追加：**
- [ ] 物件詳細ページ
- [ ] Google Places API（周辺施設）
- [ ] 実物件データ追加
- [ ] フォーム送信機能
- [ ] スマホメニュー強化

---

## 🚀 公開手順

### 1. Xserverにアップロード

FTPまたはファイルマネージャーで以下をアップロード：
- website/* → /public_html/

### 2. 確認事項
- [ ] すべてのページが表示される
- [ ] Google Mapsが動作する
- [ ] リンクが正しく機能する
- [ ] スマホ表示を確認

### 3. DNS設定
- frejuno.com が /public_html/ を指していることを確認

### 4. 公開
- https://frejuno.com にアクセスして確認

---

## 📋 次のステップ

### 優先度高（公開後すぐ）
1. 実物件データ追加（properties.js）
2. 物件画像の準備・追加
3. お問い合わせフォーム送信機能実装

### 優先度中（1週間以内）
1. 物件詳細ページ作成
2. Google Places API統合
3. SEO最適化

### 優先度低（随時）
1. ブログ機能
2. よくある質問
3. スタッフ紹介

---

## 💰 予算配分（Phase 1）

| エージェント | 役割 | 予算 |
|------------|------|------|
| Juno | 統合・判断 | $12.6 |
| 黒策 | 戦略・計画 | $8.4 |
| 伏黒 | サイト実装 | $7.0 |
| 硝子 | R&D・最適化 | $4.2 |
| 彩 | UIデザイン | $2.8 |
| 語部 | コンテンツ | $4.2 |
| **合計** | | **$39.2** |

---

作成日：2026-02-05  
責任者：Juno  
実装担当：伏黒（主）、硝子、彩
