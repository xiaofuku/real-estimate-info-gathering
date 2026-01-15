const { Client } = require('@line/bot-sdk');
const fs = require('fs');
const path = require('path');

// 環境変数から設定を取得
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};

const userId = process.env.LINE_USER_ID || '';

// GitHub リポジトリ情報
const GITHUB_REPO = 'xiaofuku/real-estimate-info-gathering';
const GITHUB_BRANCH = 'main';

async function sendLatestScreenshots() {
  if (!config.channelAccessToken || !userId) {
    console.error('Error: LINE_CHANNEL_ACCESS_TOKEN and LINE_USER_ID must be set');
    process.exit(1);
  }

  const client = new Client(config);

  // screenshots ディレクトリ内の全サブディレクトリを確認
  const screenshotsDir = 'screenshots';
  const sites = ['kenbiya', 'rakumachi'];

  const messages = [];

  for (const site of sites) {
    const siteDir = path.join(screenshotsDir, site);

    if (!fs.existsSync(siteDir)) {
      console.log(`Directory not found: ${siteDir}`);
      continue;
    }

    // 最新のPNGファイルを取得
    const files = fs.readdirSync(siteDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file,
        path: path.join(siteDir, file),
        time: fs.statSync(path.join(siteDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.log(`No PNG files found in ${siteDir}`);
      continue;
    }

    const latestFile = files[0];
    console.log(`Latest screenshot for ${site}: ${latestFile.name}`);

    // GitHub の raw URL を生成
    const imageUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${latestFile.path.replace(/\\/g, '/')}`;

    // サイト名のテキストメッセージ
    messages.push({
      type: 'text',
      text: `📸 ${site === 'kenbiya' ? '健美家' : '楽待'} の最新スクリーンショット (${latestFile.name})`
    });

    // 画像メッセージ
    messages.push({
      type: 'image',
      originalContentUrl: imageUrl,
      previewImageUrl: imageUrl
    });
  }

  if (messages.length === 0) {
    console.log('No screenshots to send');
    return;
  }

  try {
    await client.pushMessage(userId, messages);
    console.log(`Successfully sent ${messages.length / 2} screenshot(s) to LINE`);
  } catch (error) {
    console.error('Error sending to LINE:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

sendLatestScreenshots();
