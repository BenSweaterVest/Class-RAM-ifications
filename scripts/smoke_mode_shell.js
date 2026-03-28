const { chromium } = require('playwright');

function fail(msg) {
  throw new Error(msg);
}

(async () => {
  const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
  const browser = await chromium.launch({ headless: true });

  try {
    const runnerPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await runnerPage.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await runnerPage.waitForTimeout(700);

    const runnerState = await runnerPage.evaluate(() => {
      const runnerNarrative = document.getElementById('runner-narrative');
      return {
        bodyMode: document.body.dataset.mode,
        restartDisplay: getComputedStyle(document.getElementById('restart-toggle')).display,
        compactExists: Boolean(document.getElementById('compact-ui-toggle')),
        compactText: (document.getElementById('compact-ui-toggle')?.textContent || '').trim(),
        themeText: (document.getElementById('theme-toggle')?.textContent || '').trim(),
        muteText: (document.getElementById('audio-mute-toggle')?.textContent || '').trim(),
        narrativeVisible: runnerNarrative ? getComputedStyle(runnerNarrative).display !== 'none' : false,
        legendExists: Boolean(document.getElementById('runner-legend')),
        runnerControlsReady: Boolean(window.runnerControls && typeof window.runnerControls.restart === 'function')
      };
    });

    if (runnerState.bodyMode !== 'runner') {
      fail(`Expected runner mode body dataset, got ${runnerState.bodyMode}.`);
    }
    if (runnerState.restartDisplay === 'none') {
      fail('Expected restart button visible in runner mode.');
    }
    if (!runnerState.compactExists || !runnerState.compactText.includes('COMPACT UI')) {
      fail('Expected compact UI toggle to exist in runner mode.');
    }
    if (!runnerState.themeText.includes('MODE')) {
      fail('Expected theme toggle text to include MODE in runner mode.');
    }
    if (!runnerState.muteText.startsWith('MUTE:')) {
      fail('Expected mute toggle text to start with MUTE: in runner mode.');
    }
    if (!runnerState.narrativeVisible) {
      fail('Expected intro narrative to be visible on runner startup.');
    }
    if (!runnerState.legendExists || !runnerState.runnerControlsReady) {
      fail('Expected runner legend and runnerControls to initialize in runner mode.');
    }

    console.log('PASS: mode shell smoke checks succeeded.');
    console.log('- Runner shell state: PASS');
  } finally {
    await browser.close();
  }
})();
