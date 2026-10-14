import puppeteer from 'puppeteer-core';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--enable-webgl', '--ignore-gpu-blocklist']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    console.log('BROWSER LOG [' + msg.type() + ']:', msg.text());
  });
  page.on('pageerror', err => {
    errors.push(err.message);
    console.error('BROWSER UNCAUGHT ERROR:', err.message);
  });

  console.log('Navigating to http://localhost:5173/#condensed-matter ...');
  await page.goto('http://localhost:5173/#condensed-matter', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Check initial state
  const state1 = await page.evaluate(() => {
    const cc = document.getElementById('crystal-canvas');
    const canvas3D = cc ? cc.querySelector('canvas') : null;
    const dipoleCanvas = document.getElementById('dipole-canvas');
    const roleEl = document.getElementById('telemetry-role');
    const systemEl = document.getElementById('param-system');
    const psEl = document.getElementById('param-ps');

    return {
      canvas3D: canvas3D ? { width: canvas3D.width, height: canvas3D.height } : null,
      dipoleCanvas: dipoleCanvas ? { width: dipoleCanvas.width, height: dipoleCanvas.height } : null,
      telemetry: {
        role: roleEl ? roleEl.textContent : null,
        system: systemEl ? systemEl.textContent : null,
        ps: psEl ? psEl.textContent : null
      }
    };
  });
  console.log('INITIAL STATE:', JSON.stringify(state1, null, 2));

  // Screenshot 1: Initial Paraelectric state
  const section = await page.$('#condensed-matter');
  if (section) {
    await section.screenshot({ path: 'crystal_paraelectric_verified.png' });
    console.log('Saved crystal_paraelectric_verified.png');
  }

  // Click Ferroelectric mode button
  console.log('Clicking Ferroelectric (Polarized) button...');
  await page.click('#btnModeFerroelectric');
  await new Promise(r => setTimeout(r, 1000));

  const state2 = await page.evaluate(() => {
    const systemEl = document.getElementById('param-system');
    const psEl = document.getElementById('param-ps');
    const tagEl = document.getElementById('schematic-tag');
    const ferroBtn = document.getElementById('btnModeFerroelectric');
    return {
      ferroBtnActive: ferroBtn ? ferroBtn.classList.contains('active') : false,
      system: systemEl ? systemEl.textContent : null,
      ps: psEl ? psEl.textContent : null,
      schematicTag: tagEl ? tagEl.textContent : null
    };
  });
  console.log('FERROELECTRIC STATE:', JSON.stringify(state2, null, 2));

  // Screenshot 2: Ferroelectric mode with dipole vector and updated schematic
  if (section) {
    await section.screenshot({ path: 'crystal_ferroelectric_verified.png' });
    console.log('Saved crystal_ferroelectric_verified.png');
  }

  // Test click Reset View and Pause Spin
  console.log('Testing Pause Spin button...');
  await page.click('#btnToggleRotate');
  const spinLabel1 = await page.$eval('#rotateBtnLabel', el => el.textContent);
  console.log('Rotate button label after click:', spinLabel1);

  console.log('Testing Reset View button...');
  await page.click('#btnResetView');
  await new Promise(r => setTimeout(r, 500));

  // Test Clicking Paraelectric mode back
  console.log('Clicking Paraelectric (Cubic) button...');
  await page.click('#btnModeParaelectric');
  await new Promise(r => setTimeout(r, 500));

  console.log('ERRORS ENCOUNTERED:', errors.length);
  await browser.close();
}
run().catch(console.error);
