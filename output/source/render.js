const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const mode = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto('file://' + path.resolve('index.html'));
  await page.evaluate(async () => { for (const w of [400,600,700,800,900]) await document.fonts.load(`${w} 40px Cairo`, 'مرحبا'); });
  if (mode === 'stills') {
    for (const t of process.argv.slice(3).map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: `${process.env.SD||"stills"}/s_${t}.jpg`, type: 'jpeg', quality: 80 });
    }
  } else if (mode === 'cues') {
    console.log(JSON.stringify(await page.evaluate(() => CUES)));
  } else {
    const [a, b, out] = [Number(process.argv[3]), Number(process.argv[4]), process.argv[5]];
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      await page.evaluate(t => render(t), f / 30);
      const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 300 === 0) console.log(out, f);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
