# Real Estate Info Gathering

不動産投資物件情報サイト（健美家・楽待）の物件一覧ページを毎日自動でスクリーンショット取得し、GitHubリポジトリに保存＆LINE通知します。

GitHub Actions による完全自動化で、PC起動不要で毎日定時に最新の物件情報をキャプチャし、LINEに配信します。

## 対象サイト

### 健美家（Kenbiya）
```
https://www.kenbiya.com/pp2_3/cd2=1/koz=1/p2=3000/r1=8/rc2=20/
```

### 楽待（Rakumachi）
```
https://www.rakumachi.jp/syuuekibukken/area/prefecture/dimAll/?realtor_id=&area=&line=&st=&limit=20&keyword=&newly=1&price_from=&price_to=3000&gross_from=8&gross_to=&dim%5B%5D=1001&dim%5B%5D=1002&year_from=&year_to=25&structure%5B%5D=4&b_area_from=&b_area_to=&houses_ge=&houses_le=&min=&l_area_from=&l_area_to=
```

## 機能

- 毎日 JST 9:00 に自動実行（スケジュール変更可能）
- 複数サイト（健美家・楽待）のフルページスクリーンショットを PNG で保存
- GitHub Actions による完全自動化（PC起動不要）
- **LINE Messaging API 経由で自動通知**（スクリーンショット画像を送信）
- 403エラー対策済み（User-Agent、Referer、スクロール動作など）
- サイト別フォルダで整理された出力

## プロジェクト構成

```
.
├── .github/
│   └── workflows/
│       └── screenshot.yml        # GitHub Actions ワークフロー
├── docs/
│   ├── hanzawa_investment_policy.md   # 半沢マコト投資方針
│   └── saitama_investment_policy.md   # 埼玉大家の会投資方針
├── scripts/
│   ├── kenbiya-screenshot.js     # 健美家スクリーンショット取得スクリプト
│   ├── rakumachi-screenshot.js   # 楽待スクリーンショット取得スクリプト
│   └── send-to-line.js           # LINE 送信スクリプト
├── screenshots/
│   ├── kenbiya/                  # 健美家のスクリーンショット保存先
│   └── rakumachi/                # 楽待のスクリーンショット保存先
├── package.json                  # Node.js 依存関係
└── README.md                     # このファイル
```

## 技術スタック

- **Node.js** 18+
- **Playwright** - ヘッドレスブラウザ自動化
- **@line/bot-sdk** - LINE Messaging API SDK
- **GitHub Actions** - CI/CD 自動化

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
node scripts/kenbiya-screenshot.js

# 楽待のスクリーンショット取得
node scripts/rakumachi-screenshot.js

# LINE 送信テスト（環境変数が必要）
LINE_CHANNEL_ACCESS_TOKEN="your_token" LINE_USER_ID="your_user_id" node scripts/send-to-line.js
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

## 動作フロー

1. **スケジュール実行** - 毎日JST 9:00にGitHub Actionsが起動
2. **依存関係インストール** - Node.jsパッケージとPlaywright Chromiumをインストール
3. **スクリーンショット取得**
   - 健美家のページにアクセスしてフルページスクリーンショット取得
   - 楽待のページにアクセスしてフルページスクリーンショット取得
4. **リポジトリにコミット** - 取得した画像を `screenshots/` にコミット＆プッシュ
5. **LINE通知** - 最新のスクリーンショット画像をLINEに送信

## トラブルシューティング

### スクリーンショットが403エラーになる

- すでに対策済みですが、サイト側の仕様変更で再発する可能性があります
- User-Agent、Referer、待機時間などを調整してください

### LINE通知が届かない

1. GitHub Secrets が正しく設定されているか確認
2. `LINE_CHANNEL_ACCESS_TOKEN` が有効か確認（期限切れの可能性）
3. `LINE_USER_ID` が正しいか確認（個人の場合は`U`で始まる、グループは`C`で始まる）
4. LINE公式アカウントをブロックしていないか確認

### GitHub Actionsが実行されない

- リポジトリの Settings > Actions > General で権限が正しく設定されているか確認
- ワークフローファイルの cron 式が正しいか確認（UTC時間で指定）

## 注意事項

- **GitHub Actions の無料枠**：
  - パブリックリポジトリは無制限
  - プライベートリポジトリは月2,000分まで無料
- **リポジトリサイズ**: スクリーンショットが蓄積されるとサイズが大きくなります
  - 必要に応じて古いファイルを定期的に削除する仕組みを追加してください
  - 例：30日以前のファイルを自動削除するスクリプトなど
- **Secrets の管理**: LINE のトークンは定期的に再発行することを推奨

## ライセンス

MIT License - ご自由にご利用ください

## 貢献

Issue や Pull Request は歓迎です！
