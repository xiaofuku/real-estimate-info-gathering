const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.rakumachi.jp/syuuekibukken/area/prefecture/dimAll/?realtor_id=&area=&line=&st=&limit=20&keyword=&newly=1&price_from=&price_to=3000&gross_from=8&gross_to=&dim%5B%5D=1001&dim%5B%5D=1002&year_from=&year_to=25&structure%5B%5D=4&b_area_from=&b_area_to=&houses_ge=&houses_le=&min=&l_area_from=&l_area_to=';
const SCREENSHOT_DIR = 'screenshots/rakumachi';

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
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
  });

  const page = await context.newPage();

  try {
    console.log(`Navigating to: ${TARGET_URL}`);

    // Refererを設定してより自然なアクセスに見せる
    await page.setExtraHTTPHeaders({
      'Referer': 'https://www.rakumachi.jp/',
    });

    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // ページが完全に読み込まれるまで待機（人間らしい待機時間）
    await page.waitForTimeout(5000);

    // スクロールして全コンテンツをロード
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

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

  } catch (error) {
    console.error('Error taking screenshot:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

takeScreenshot();
