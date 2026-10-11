const { chromium } = require('playwright');

// Drives one complete run through all four barriers on story difficulty and
// checks the win path end to end: barrier clears, the five narrative cards,
// the win overlay, and the persisted ally total. Needs the static server
// (npm run serve) and takes about two minutes of real time.
//
// The page is opened with ?debug so window.runnerDebug is available. The
// autopilot only steers lanes toward pickups and presses Solidarity when the
// game itself reports it ready. Obstacle immunity keeps random spawns from
// deciding the outcome; the barrier wall is never exempt.

function fail(msg) {
  throw new Error(msg);
}

(async () => {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  try {
    await page.goto(`${baseUrl}/?debug`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#runner-narrative', { state: 'visible', timeout: 10000 });
    await page.waitForFunction(() => Boolean(window.runnerDebug && window.runnerControls), null, { timeout: 10000 });

    const totalBefore = await page.evaluate(() => Number(localStorage.getItem('classRamTotalAllies') || '0'));

    // Story difficulty has the widest Solidarity margins. Restart applies it.
    await page.selectOption('#difficulty-select', 'story');
    await page.click('#restart-toggle');
    await page.waitForTimeout(300);

    const result = await page.evaluate(async () => {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      const controls = window.runnerControls;
      const dbg = window.runnerDebug;
      dbg.setInvulnerable(true);

      const MEMBER_SPEED_PX_PER_S = 120; // 2 px per 60 Hz frame
      const LANE_CHANGE_S = 0.2;
      const started = performance.now();
      let cardsSeen = 0;
      let last = dbg.snapshot();

      while (performance.now() - started < 200000) {
        const s = dbg.snapshot();
        last = s;
        if (!s.gameActive) break;

        if (s.narrativePaused) {
          cardsSeen += 1;
          document.getElementById('runner-narrative-next').click();
          await sleep(150);
          continue;
        }

        if (s.solidarity.ready) {
          controls.solidarity();
          await sleep(60);
          continue;
        }

        // Head for the nearest pickup ahead whose lane can be reached before it arrives.
        const ahead = s.members.filter(m => m.x > s.playerX - 6).sort((a, b) => a.x - b.x);
        const target = ahead.find(m => (m.x - s.playerX) / MEMBER_SPEED_PX_PER_S >= Math.abs(m.lane - s.targetLane) * LANE_CHANGE_S);
        if (target && target.lane !== s.targetLane) {
          if (target.lane < s.targetLane) controls.up();
          else controls.down();
        }
        await sleep(40);
      }

      const winScreen = document.getElementById('runner-win-screen');
      return {
        cardsSeen,
        final: last,
        elapsedS: Math.round((performance.now() - started) / 1000),
        winVisible: winScreen ? getComputedStyle(winScreen).display !== 'none' : false,
        statsText: (document.getElementById('runner-win-stats')?.textContent || '').replace(/\s+/g, ' ').trim(),
        status: (document.getElementById('status-val')?.textContent || '').trim()
      };
    });

    const f = result.final;
    if (!f.gameWon) {
      fail(`Run did not end in a win: reason=${f.runEndReason || 'none'}, precedents=${f.precedentEstablished}, chain=${f.chainCount}/${f.threshold}, elapsed=${result.elapsedS}s.`);
    }
    if (f.precedentEstablished !== 4) {
      fail(`Expected 4 precedents at the win, got ${f.precedentEstablished}.`);
    }
    if (result.cardsSeen !== 5) {
      fail(`Expected 5 narrative cards (intro + 3 clears + victory), saw ${result.cardsSeen}.`);
    }
    if (!result.winVisible) {
      fail('Win screen overlay is not visible after the victory card.');
    }
    if (result.status !== 'EXECUTIVE ORDER 12968') {
      fail(`Expected status EXECUTIVE ORDER 12968, got "${result.status}".`);
    }
    for (const label of ['1984 (Level 1)', '1987 (Level 2)', '1990 (Level 3)', '1995 (Level 4)', 'This run:', 'All-time on this machine:']) {
      if (!result.statsText.includes(label)) fail(`Win stats missing "${label}": ${result.statsText}`);
    }

    const totalAfter = await page.evaluate(() => Number(localStorage.getItem('classRamTotalAllies') || '0'));
    if (totalAfter <= totalBefore) {
      fail(`All-time ally total did not increase (${totalBefore} -> ${totalAfter}).`);
    }

    console.log('PASS: full run smoke succeeded.');
    console.log(`- 4 barriers cleared on story difficulty in ${result.elapsedS}s`);
    console.log(`- 5 narrative cards, win overlay, EO 12968 status, all-time total ${totalBefore} -> ${totalAfter}`);
  } finally {
    await browser.close();
  }
})();
