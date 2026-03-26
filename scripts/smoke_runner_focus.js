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
    const introButtonText = await page.$eval('#runner-narrative-next', el => el.textContent || '');
    if (!introButtonText.includes('PRESS ENTER TO CONTINUE')) {
      fail('Narrative continue button text was not updated to PRESS ENTER TO CONTINUE.');
    }
    await page.keyboard.press('Space');
    await page.waitForTimeout(250);
    const narrativeDisplayAfterSpace = await page.$eval('#runner-narrative', el => getComputedStyle(el).display);
    if (narrativeDisplayAfterSpace !== 'block') {
      fail('Narrative modal should stay open when Space is pressed.');
    }
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
    const introTitle = await page.$eval('#runner-narrative-title', el => el.textContent || '');
    if (!introTitle.startsWith('History Checkpoint')) {
      fail('Narrative title did not update to History Checkpoint.');
    }
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

      const legendText = (document.getElementById('runner-legend')?.textContent || '').replace(/\s+/g, ' ');
      const hintText = (document.getElementById('tower-hint')?.textContent || '').replace(/\s+/g, ' ');

      if (!legendText.includes('Timothy Dooling (Contender)') || !legendText.includes('HTG Members (Ally Chain)') || !legendText.includes('Suit (Damage)')) {
        return { ok: false, reason: 'runner legend sprite photo labels missing' };
      }
      const tooltipTitles = Array.from(document.querySelectorAll('.legend-tooltip strong')).map(el => el.textContent || '');
      const expectedTooltipTitles = [
        'Contender',
        'HTG Members',
        'DISCO Investigator (Suit)',
        'Cabinet (SLOW)',
        'Bot (LOCK)',
        'Policy (Barrier Wall)'
      ];
      for (const title of expectedTooltipTitles) {
        if (!tooltipTitles.includes(title)) {
          return { ok: false, reason: `legend hover card missing ${title}` };
        }
      }
      const muteButtonText = (document.getElementById('audio-mute-toggle')?.textContent || '').replace(/\s+/g, ' ').trim();
      if (!muteButtonText.startsWith('MUTE:')) {
        return { ok: false, reason: 'mute button missing or mislabeled' };
      }
      const themeButtonText = (document.getElementById('theme-toggle')?.textContent || '').replace(/\s+/g, ' ').trim();
      if (!themeButtonText.includes('MODE')) {
        return { ok: false, reason: 'theme button missing or mislabeled' };
      }
      const htgCard = document.querySelector('[data-card-id="htg-members"]');
      if (!htgCard) {
        return { ok: false, reason: 'HTG members card missing' };
      }
      htgCard.click();
      const expandedState = htgCard.getAttribute('aria-expanded');
      const statusText = (document.getElementById('status-val')?.textContent || '').replace(/\s+/g, ' ').trim();
      const htgTooltipText = (htgCard.querySelector('.legend-tooltip')?.textContent || '').replace(/\s+/g, ' ');
      if (expandedState !== 'true') {
        return { ok: false, reason: 'HTG members card did not expand on click' };
      }
      if (!statusText.includes('PAUSED: INFO CARD')) {
        return { ok: false, reason: 'game did not pause when info card expanded' };
      }
      if (!htgTooltipText.includes('original pride flag') || !htgTooltipText.includes('Alex') || !htgTooltipText.includes('Evelyn')) {
        return { ok: false, reason: 'HTG members expanded content missing pride-flag roster context' };
      }
      const htgMiniCards = htgCard.querySelectorAll('.htg-mini-card');
      if (htgMiniCards.length !== 8) {
        return { ok: false, reason: `expected 8 HTG mini cards, found ${htgMiniCards.length}` };
      }
      htgCard.click();
      const hasKeyboardHint = hintText.includes('Left/A move left') && hintText.includes('Right/D move right') && hintText.includes('Up/Down lanes');
      const hasTouchHint = hintText.includes('Swipe up/down to change lanes') && hintText.includes('swipe left/right to shift position');
      if (!hasKeyboardHint && !hasTouchHint) {
        return { ok: false, reason: 'runner mode hint text mismatch' };
      }
      const hasSolidarityHint = hintText.includes('Space Solidarity (burst through the barrier)') || hintText.includes('tap to use Solidarity (burst through the barrier)');
      if (!hasSolidarityHint || !hintText.includes('Collect HTG allies; avoid suits/cabinets/bots/get through the barriers.')) {
        return { ok: false, reason: 'runner mode hint action text mismatch' };
      }

      return {
        ok: true,
        hasControlSemantics: true,
        hasHoverCards: true
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

    // 5) Gameplay liveness: control calls must not throw; canvas must update within 1 second.
    const liveness = await page.evaluate(async () => {
      const controls = window.runnerControls;
      if (!controls) return { ok: false, reason: 'runnerControls missing' };

      const methods = ['up', 'down', 'laneUp', 'laneDown', 'slow', 'dash', 'solidarity'];
      for (const m of methods) {
        try { controls[m](); } catch (e) {
          return { ok: false, reason: `runnerControls.${m}() threw: ${e.message}` };
        }
      }

      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return { ok: false, reason: 'canvas missing' };
      const ctx = canvas.getContext('2d');
      function hashFrame() {
        const d = ctx.getImageData(0, 0, Math.min(canvas.width, 200), Math.min(canvas.height, 100)).data;
        let h = 0;
        for (let i = 0; i < d.length; i += 16) h = (h * 31 + d[i] + d[i + 1] + d[i + 2]) | 0;
        return h;
      }
      const before = hashFrame();
      await new Promise(r => setTimeout(r, 1000));
      const after = hashFrame();
      if (before === after) return { ok: false, reason: 'canvas unchanged after 1s — game loop may not be running' };
      return { ok: true };
    });

    if (!liveness.ok) {
      fail(`Gameplay liveness check failed: ${liveness.reason}`);
    }

    // 6) Mobile viewport sanity checks for swipe/tap rollout.
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });

    await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await mobilePage.waitForTimeout(600);
    await mobilePage.waitForSelector('#runner-narrative', { state: 'visible', timeout: 10000 });
    await mobilePage.keyboard.press('Enter');
    await mobilePage.waitForSelector('#runner-narrative', { state: 'hidden', timeout: 10000 });
    await mobilePage.waitForTimeout(500);

    const mobileCheck = await mobilePage.evaluate(() => {
      const hintText = (document.getElementById('tower-hint')?.textContent || '').replace(/\s+/g, ' ');
      const restartDisplay = getComputedStyle(document.getElementById('restart-toggle')).display;
      const touchAction = getComputedStyle(document.getElementById('game-container')).touchAction;
      const touchHintOpacity = getComputedStyle(document.getElementById('runner-touch-hint')).opacity;
      const bodyClassName = document.body.className;

      return {
        hintText,
        restartDisplay,
        touchAction,
        touchHintOpacity,
        bodyClassName
      };
    });

    if (!mobileCheck.hintText.includes('Swipe up/down to change lanes') || !mobileCheck.hintText.includes('tap to use Solidarity')) {
      fail('Mobile hint text did not switch to swipe/tap instructions.');
    }
    if (mobileCheck.restartDisplay === 'none') {
      fail('Restart button should be visible in runner mode for mobile.');
    }
    if (mobileCheck.touchAction !== 'none') {
      fail(`Expected game container touch-action to be none, got ${mobileCheck.touchAction}.`);
    }
    if (!mobileCheck.bodyClassName.includes('touch-ui')) {
      fail('Expected touch-ui body class on mobile viewport.');
    }
    if (mobileCheck.touchHintOpacity === '0') {
      fail('Expected touch hint to be visible on initial mobile gameplay state.');
    }

    await mobilePage.locator('#gameCanvas').tap();
    await mobilePage.waitForTimeout(250);
    const touchHintDismissed = await mobilePage.evaluate(() => document.body.classList.contains('touch-hint-dismissed'));
    if (!touchHintDismissed) {
      fail('Expected first mobile tap to dismiss the touch hint.');
    }

    await mobilePage.locator('[data-card-id="htg-members"]').click({ force: true });
    await mobilePage.waitForTimeout(250);
    const mobileSheetCheck = await mobilePage.evaluate(() => {
      const sheet = document.getElementById('runner-legend-sheet');
      const statusText = (document.getElementById('status-val')?.textContent || '').replace(/\s+/g, ' ').trim();
      const sheetTitle = (document.getElementById('runner-legend-sheet-title')?.textContent || '').trim();
      const sheetBody = (document.getElementById('runner-legend-sheet-body')?.textContent || '').replace(/\s+/g, ' ');
      return {
        sheetOpen: Boolean(sheet && sheet.classList.contains('is-open')),
        bodyOpen: document.body.classList.contains('legend-sheet-open'),
        statusText,
        sheetTitle,
        sheetBody
      };
    });
    if (!mobileSheetCheck.sheetOpen || !mobileSheetCheck.bodyOpen) {
      fail('Expected mobile legend tap to open the bottom sheet.');
    }
    if (!mobileSheetCheck.statusText.includes('PAUSED: INFO CARD')) {
      fail('Expected game to pause when the mobile bottom sheet opens.');
    }
    if (mobileSheetCheck.sheetTitle !== 'HTG Members') {
      fail(`Expected mobile bottom-sheet title to be HTG Members, got ${mobileSheetCheck.sheetTitle}.`);
    }
    if (!mobileSheetCheck.sheetBody.includes('original pride flag') || !mobileSheetCheck.sheetBody.includes('Evelyn')) {
      fail('Expected mobile bottom sheet to include HTG explainer and roster content.');
    }

    console.log('PASS: focused runner smoke checks succeeded.');
    console.log('- Continue control click + Enter fallback: PASS');
    console.log('- Intro court-case context lead paragraph: PASS');
    console.log('- Control semantics + obstacle effect legend wiring: PASS');
    console.log(`- Pride/visual variation buckets detected: ${variation.activeBuckets}`);
    console.log('- Gameplay liveness (control API + game loop active): PASS');
    console.log('- Mobile hint/restart/touch-action sanity: PASS');
    console.log('- Mobile touch hint visibility and dismissal: PASS');
    console.log('- Mobile bottom-sheet info card pause/readability: PASS');
  } finally {
    await browser.close();
  }
})();
