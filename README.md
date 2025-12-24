# Kenbiya Daily Screenshot

健美家の物件一覧ページを毎日自動でスクリーンショット取得し、GitHubリポジトリに保存します。

## 対象URL

```
https://www.kenbiya.com/pp2_3/cd2=1/koz=1/p2=3000/r1=8/rc2=20/
```

## 機能

- 毎日 JST 9:00 に自動実行
- フルページスクリーンショットを PNG で保存
- メタデータ（URL、タイムスタンプ、ページタイトル）を JSON で保存
- GitHub Actions による完全自動化（PC起動不要）

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

### 4. 動作確認

リポジトリの Actions タブから "Daily Kenbiya Screenshot" を選択し、
"Run workflow" ボタンで手動実行してテストできます。

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
npm run screenshot
```

## 出力

```
screenshots/
├── 2024-12-24_09-00-00.png   # スクリーンショット
├── 2024-12-24_09-00-00.json  # メタデータ
├── 2024-12-25_09-00-00.png
├── 2024-12-25_09-00-00.json
└── ...
```

## 注意事項

- GitHub Actions の無料枠：パブリックリポジトリは無制限、プライベートは月2,000分
- スクリーンショットが蓄積されるとリポジトリサイズが大きくなります
- 必要に応じて古いファイルを定期的に削除する仕組みを追加してください
