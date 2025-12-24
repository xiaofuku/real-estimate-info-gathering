const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.kenbiya.com/pp2_3/cd2=1/koz=1/p2=3000/r1=8/rc2=20/';
const SCREENSHOT_DIR = 'screenshots';

async function takeScreenshot() {
  // スクリーンショット保存ディレクトリを作成
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  });

  const page = await context.newPage();

  try {
    console.log(`Navigating to: ${TARGET_URL}`);
    
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // ページが完全に読み込まれるまで少し待機
    await page.waitForTimeout(3000);

    // JSTで日時を生成
    const now = new Date();
    const jstDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    const dateStr = jstDate.toISOString().split('T')[0];
    const timeStr = jstDate.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    const filename = `${dateStr}_${timeStr}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);

    // フルページスクリーンショット
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    console.log(`Screenshot saved: ${filepath}`);

    // メタデータも保存（オプション）
    const metadata = {
      url: TARGET_URL,
      timestamp: now.toISOString(),
      timestampJST: jstDate.toISOString(),
      filename: filename,
      title: await page.title(),
    };

    const metadataPath = path.join(SCREENSHOT_DIR, `${dateStr}_${timeStr}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Metadata saved: ${metadataPath}`);

  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
