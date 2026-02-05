# 🚀 デプロイ手順書

**最終更新:** 2026-02-05  
**修正内容:** 地図機能の改善（会社地図クリック可能化、物件詳細地図表示修正）

---

## 📦 修正済みファイル

以下のファイルが修正されています：
- `js/maps.js` - 会社地図のクリック機能追加
- `js/property-detail.js` - 物件詳細ページの地図表示修正

**Gitコミット:** `dbcd3fb`

---

## 🎯 デプロイ方法（3つのオプション）

### オプション1: Xserver FTP（既存の方法）

#### 必要なもの
- FTPクライアント（FileZilla、Cyberduck、WinSCP等）
- Xserver FTP接続情報

#### 手順
1. FTPクライアントで接続
   - ホスト: `frejuno.com` または Xserverから提供されたFTPホスト
   - ユーザー名: （Xserverアカウント情報から確認）
   - パスワード: （Xserverアカウント情報から確認）

2. `/public_html/` ディレクトリに移動

3. 以下のファイルをアップロード（上書き）:
   ```
   js/maps.js
   js/property-detail.js
   ```

4. ブラウザで確認:
   - https://frejuno.com/about.html（会社地図）
   - https://frejuno.com/property-detail.html?id=1（物件地図）

---

### オプション2: Netlify（推奨・最速）

#### メリット
- ✅ Git連携で自動デプロイ
- ✅ HTTPS自動対応
- ✅ グローバルCDN
- ✅ 無料枠で十分
- ✅ ロールバック機能

#### 手順

**ステップ1: Netlify CLIをインストール**
```bash
npm install -g netlify-cli
```

**ステップ2: Netlifyにログイン**
```bash
netlify login
```

**ステップ3: サイトを初期化（初回のみ）**
```bash
cd ~/clawd/website
netlify init
```

**ステップ4: デプロイ**
```bash
# プレビューデプロイ（確認用）
netlify deploy

# 本番デプロイ
netlify deploy --prod
```

**ステップ5: カスタムドメイン設定（オプション）**
- Netlifyダッシュボードで `frejuno.com` を設定
- DNSレコードを更新

---

### オプション3: GitHub Pages

#### 手順

**ステップ1: GitHubリポジトリを作成**
```bash
# GitHubで新しいリポジトリを作成（例: frejuno-website）
```

**ステップ2: リモートリポジトリを追加**
```bash
cd ~/clawd
git remote add origin https://github.com/[username]/frejuno-website.git
```

**ステップ3: プッシュ**
```bash
git branch -M main
git push -u origin main
```

**ステップ4: GitHub Pagesを有効化**
1. リポジトリの Settings > Pages
2. Source: `main` ブランチ
3. Folder: `/website` または `/`（websiteフォルダをルートに移動）
4. Save

**ステップ5: カスタムドメイン設定**
- Custom domain: `frejuno.com`
- DNSレコード:
  ```
  A    @    185.199.108.153
  A    @    185.199.109.153
  A    @    185.199.110.153
  A    @    185.199.111.153
  CNAME www  [username].github.io
  ```

---

## 🔍 デプロイ後の確認チェックリスト

### 会社概要ページ（`/about.html`）
- [ ] ページが正常に表示される
- [ ] 地図が表示される
- [ ] 地図の位置が正しい（愛媛県松山市井門町551-5）
- [ ] 地図をクリックするとGoogleマップが新しいタブで開く
- [ ] カーソルを地図に合わせるとポインターになる
- [ ] マーカーをクリックすると会社情報が表示される

### 物件詳細ページ（`/property-detail.html?id=1`）
- [ ] ページが正常に表示される
- [ ] 物件情報が正しく表示される
- [ ] 地図が表示される（鷹子町）
- [ ] 地図の位置が正しい（座標: 33.8199, 132.8134）
- [ ] マーカーをクリックすると物件情報が表示される
- [ ] 住所と駅情報が表示される

### スマホ確認
- [ ] レスポンシブデザインが動作する
- [ ] 地図がタップ可能
- [ ] Googleマップアプリが開く（iOS/Android）

---

## 🆘 トラブルシューティング

### 地図が表示されない
**原因:**
- Google Maps APIキーの制限
- JavaScriptエラー

**解決方法:**
1. ブラウザのコンソールを開く（F12）
2. エラーメッセージを確認
3. API制限の確認:
   - Google Cloud Console > APIs & Services > Credentials
   - APIキーの制限を確認（リファラー、IPアドレス）

### クリックしてもGoogleマップが開かない
**原因:**
- ポップアップブロック
- JavaScriptエラー

**解決方法:**
1. ブラウザのポップアップブロックを解除
2. コンソールでエラーを確認

### 座標がずれている
**原因:**
- 座標データが間違っている

**解決方法:**
1. `js/config.js` の会社座標を確認: `lat: 33.7969, lng: 132.7772`
2. `js/properties.js` の物件座標を確認: `lat: 33.8199, lng: 132.8134`
3. GoogleマップでDMS座標を確認して修正

---

## 📞 サポート情報

### 技術サポート
- **担当:** 無名 🛠（実装エージェント）
- **バックアップ:** 硝子 🔬（R&Dエージェント）

### 最終承認
- **担当:** Juno 🌙（統合エージェント）

### 緊急連絡
- clawdbot経由で各エージェントに連絡可能

---

## 📊 デプロイ履歴

### 2026-02-05
- **コミット:** `dbcd3fb`
- **変更:** 地図機能の改善
  - 会社地図クリック可能化
  - 物件詳細地図表示修正
- **担当:** 無名 🛠
- **状態:** ✅ コミット完了、デプロイ待機中

---

**次のアクション:** デプロイ方法を選択して実行してください。
