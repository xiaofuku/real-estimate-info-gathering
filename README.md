# Real Estate Info Gathering

不動産投資物件情報サイト（健美家・楽待）の物件一覧ページを毎日自動でスクリーンショット取得し、GitHubリポジトリに保存＆LINE通知します。

## 対象サイト

### 健美家（Kenbiya）
```
https://www.kenbiya.com/pp2_3/cd2=1/koz=1/p2=3000/r1=8/rc2=20/
```

### 楽待（Rakumachi）
```
https://www.rakumachi.jp/syuuekibukken/area/prefecture/dimAll/...
```

## 機能

- 毎日 JST 9:00 に自動実行
- 複数サイトのフルページスクリーンショットを PNG で保存
- GitHub Actions による完全自動化（PC起動不要）
- **LINE Messaging API 経由で自動通知**（スクリーンショット画像を送信）

## セットアップ

### 1. リポジトリを作成

GitHubで新しいリポジトリを作成します（Public または Private）。

### 2. ファイルをアップロード

このディレクトリの全ファイルをリポジトリにプッシュします：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. GitHub Actions を有効化

リポジトリの Settings > Actions > General で：
- Actions permissions: "Allow all actions and reusable workflows" を選択
- Workflow permissions: "Read and write permissions" を選択

### 4. LINE 通知の設定（オプション）

LINE にスクリーンショットを自動送信したい場合：

#### 4-1. LINE Messaging API チャンネルの作成

1. [LINE Developers Console](https://developers.line.biz/console/) にアクセス
2. プロバイダーを作成（または既存のものを選択）
3. Messaging API チャンネルを作成
4. チャンネル設定から **Channel Access Token** を発行
5. LINE 公式アカウントを友だち追加
6. 以下の方法で **User ID** を取得：
   - Messaging API 設定の Webhook URL を一時的に設定
   - または、[LINE Official Account Manager](https://manager.line.biz/) から User ID を確認

#### 4-2. GitHub Secrets の設定

リポジトリの Settings > Secrets and variables > Actions で以下を追加：

| Secret 名 | 値 |
|----------|-----|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE チャンネルのアクセストークン |
| `LINE_USER_ID` | 送信先の User ID（個人）または Group ID |

**重要**: リポジトリが Public の場合でも、Secrets は暗号化され安全に保存されます。

### 5. 動作確認

リポジトリの Actions タブから "Daily Real Estate Screenshots" を選択し、
"Run workflow" ボタンで手動実行してテストできます。

成功すると：
- `screenshots/kenbiya/` と `screenshots/rakumachi/` にスクリーンショットが保存
- LINE に画像が送信される（Secrets 設定済みの場合）

## スケジュール変更

`.github/workflows/screenshot.yml` の cron 式を編集：

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # UTC 0:00 = JST 9:00
```

例：
- `'0 12 * * *'` → JST 21:00
- `'0 23 * * *'` → JST 8:00
- `'0 */6 * * *'` → 6時間ごと

## ローカルでのテスト

```bash
npm install
npx playwright install chromium

# 健美家のスクリーンショット取得
node kenbiya-screenshot.js

# 楽待のスクリーンショット取得
node rakumachi-screenshot.js

# LINE 送信テスト（環境変数が必要）
LINE_CHANNEL_ACCESS_TOKEN="your_token" LINE_USER_ID="your_user_id" node send-to-line.js
```

## 出力

```
screenshots/
├── kenbiya/
│   ├── 2024-12-24_09-00-00.png
│   ├── 2024-12-25_09-00-00.png
│   └── ...
└── rakumachi/
    ├── 2024-12-24_09-00-05.png
    ├── 2024-12-25_09-00-05.png
    └── ...
```

## 注意事項

- GitHub Actions の無料枠：パブリックリポジトリは無制限、プライベートは月2,000分
- スクリーンショットが蓄積されるとリポジトリサイズが大きくなります
- 必要に応じて古いファイルを定期的に削除する仕組みを追加してください
