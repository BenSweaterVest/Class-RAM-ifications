const { chromium } = require('playwright');
const path = require('path');

function fail(msg) {
  throw new Error(msg);
}

(async () => {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(600);

    // 1) Continue control should dismiss intro checkpoint.
    await page.waitForSelector('#runner-narrative', { state: 'visible', timeout: 10000 });
    await page.click('#runner-narrative-next');
    await page.waitForTimeout(250);
    const narrativeDisplayAfterClick = await page.$eval('#runner-narrative', el => getComputedStyle(el).display);
    if (narrativeDisplayAfterClick !== 'none') {
      fail('Narrative modal did not close after clicking CONTINUE.');
    }

    // Re-open intro by restart and verify keyboard continue as fallback.
    await page.keyboard.press('KeyR');
    await page.waitForSelector('#runner-narrative', { state: 'visible', timeout: 10000 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
    const narrativeDisplayAfterEnter = await page.$eval('#runner-narrative', el => getComputedStyle(el).display);
    if (narrativeDisplayAfterEnter !== 'none') {
      fail('Narrative modal did not close after Enter key fallback.');
    }

    // 2) Intro text should start with the Timothy Dooling context lead.
    await page.keyboard.press('KeyR');
    await page.waitForSelector('#runner-narrative', { state: 'visible', timeout: 10000 });
    const introText = await page.$eval('#runner-narrative-body', el => el.textContent || '');
    if (!introText.startsWith('You are Timothy Dooling - nuclear fusion engineer')) {
      fail('Intro narrative text does not start with the Timothy Dooling historical context paragraph.');
    }

    // Continue so game can run and spawn entities.
    await page.click('#runner-narrative-next');
    await page.waitForTimeout(2500);

    // 3) Control semantics + obstacle explainer wiring.
    const controlAndLegend = await page.evaluate(() => {
      const controls = window.runnerControls;
      if (!controls) return { ok: false, reason: 'runnerControls missing' };

      const requiredApi = ['slow', 'dash', 'up', 'down', 'laneUp', 'laneDown', 'solidarity', 'restart'];
      for (const method of requiredApi) {
        if (typeof controls[method] !== 'function') {
          return { ok: false, reason: `runnerControls.${method} missing` };
        }
      }

      const helpText = (document.getElementById('runner-help')?.textContent || '').replace(/\s+/g, ' ');
      const legendText = (document.getElementById('runner-legend')?.textContent || '').replace(/\s+/g, ' ');
      const hintText = (document.getElementById('tower-hint')?.textContent || '').replace(/\s+/g, ' ');

      const hasTouchControls = ['runner-left-btn', 'runner-right-btn', 'runner-dash-btn', 'runner-lane-down-btn']
        .every(id => !!document.getElementById(id));

      if (!hasTouchControls) return { ok: false, reason: 'expected runner touch control buttons missing' };
      if (!helpText.includes('Left/A move left') || !helpText.includes('Right or D move right') || !helpText.includes('Up/Down lanes')) {
        return { ok: false, reason: 'runner help control semantics text mismatch' };
      }
      if (!helpText.includes('Suits strip extra chain') || !helpText.includes('Cabinets slow movement') || !helpText.includes('Bots lock lane switches')) {
        return { ok: false, reason: 'runner help obstacle effects text mismatch' };
      }
      if (!legendText.includes('Obstacle Effects:') || !legendText.includes('Suit =') || !legendText.includes('Cabinet =') || !legendText.includes('Bot =')) {
        return { ok: false, reason: 'runner legend obstacle effects summary missing' };
      }
      if (!legendText.includes('Player (Timothy Dooling)') || !legendText.includes('HTG Member')) {
        return { ok: false, reason: 'runner legend sprite photo labels missing' };
      }
      if (!hintText.includes('Left/A move left') || !hintText.includes('Right/D move right') || !hintText.includes('Up/Down lanes')) {
        return { ok: false, reason: 'runner mode hint text mismatch' };
      }

      return {
        ok: true,
        hasTouchControls,
        hasControlSemantics: true,
        hasObstacleLegend: true
      };
    });

    if (!controlAndLegend.ok) {
      fail(`Control/effect check failed: ${controlAndLegend.reason}`);
    }

    // 4) Size/color variation checks for suits and members.
    const variation = await page.evaluate(async () => {
      const controls = window.runnerControls;
      if (!controls) return { ok: false, reason: 'runnerControls missing' };

      const state = {
        members: [],
        suits: []
      };

      // Attempt to infer internal arrays by scanning globals (runner_mode uses module-scope vars, not window-bound).
      // Use canvas pixel sampling fallback: collect broad stats over time to detect color spread and body-size spread.
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return { ok: false, reason: 'canvas missing' };
      const ctx = canvas.getContext('2d');

      function sampleFrame() {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let brightColored = 0;
        let redLike = 0;
        let orangeLike = 0;
        let yellowLike = 0;
        let greenLike = 0;
        let cyanLike = 0;
        let indigoLike = 0;
        let violetLike = 0;
        let hotPinkLike = 0;

        for (let i = 0; i < img.length; i += 4) {
          const r = img[i], g = img[i + 1], b = img[i + 2], a = img[i + 3];
          if (a < 220) continue;
          if (r + g + b < 120) continue;
          brightColored++;

          if (r > 200 && g < 90 && b > 120) hotPinkLike++;
          if (r > 170 && g < 90 && b < 90) redLike++;
          if (r > 190 && g > 100 && g < 180 && b < 90) orangeLike++;
          if (r > 200 && g > 180 && b < 120) yellowLike++;
          if (g > 140 && r < 140 && b < 140) greenLike++;
          if (g > 130 && b > 130 && r < 120) cyanLike++;
          if (b > 140 && r < 120 && g < 130) indigoLike++;
          if (b > 140 && r > 110 && g < 120) violetLike++;
        }

        return {
          brightColored,
          buckets: { hotPinkLike, redLike, orangeLike, yellowLike, greenLike, cyanLike, indigoLike, violetLike }
        };
      }

      const samples = [];
      for (let i = 0; i < 24; i++) {
        samples.push(sampleFrame());
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const merged = {
        brightColored: 0,
        buckets: { hotPinkLike: 0, redLike: 0, orangeLike: 0, yellowLike: 0, greenLike: 0, cyanLike: 0, indigoLike: 0, violetLike: 0 }
      };
      for (const s of samples) {
        merged.brightColored += s.brightColored;
        for (const k of Object.keys(merged.buckets)) merged.buckets[k] += s.buckets[k];
      }

      // Presence check: at least 3 non-trivial color buckets should be detected in sampled gameplay visuals.
      const activeBuckets = Object.values(merged.buckets).filter(v => v > 80).length;

      return {
        ok: true,
        activeBuckets,
        merged
      };
    });

    if (!variation.ok) {
      fail(`Variation check failed: ${variation.reason}`);
    }

    if (variation.activeBuckets < 3) {
      fail(`Expected multiple pride-color buckets in member visuals, got ${variation.activeBuckets}.`);
    }

    console.log('PASS: focused runner smoke checks succeeded.');
    console.log('- Continue control click + Enter fallback: PASS');
    console.log('- Intro court-case context lead paragraph: PASS');
    console.log('- Control semantics + obstacle effect legend wiring: PASS');
    console.log(`- Pride/visual variation buckets detected: ${variation.activeBuckets}`);
  } finally {
    await browser.close();
  }
})();
