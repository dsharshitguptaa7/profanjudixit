import puppeteer from 'puppeteer-core';

async function testScreenshots() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewport({ width, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: `hero_full_${width}.png` });
    console.log(`Saved hero_full_${width}.png`);
  }
  await browser.close();
}
testScreenshots().catch(console.error);
