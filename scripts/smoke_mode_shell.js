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
        towerSelectDisplay: getComputedStyle(document.getElementById('tower-select')).display,
        restartDisplay: getComputedStyle(document.getElementById('restart-toggle')).display,
        precedentLabel: (document.getElementById('precedent-label')?.textContent || '').trim(),
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
    if (runnerState.towerSelectDisplay !== 'none') {
      fail(`Expected tower select hidden in runner mode, got ${runnerState.towerSelectDisplay}.`);
    }
    if (runnerState.restartDisplay === 'none') {
      fail('Expected restart button visible in runner mode.');
    }
    if (runnerState.precedentLabel !== '') {
      fail(`Expected empty precedent label in runner mode, got "${runnerState.precedentLabel}".`);
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

    const legacyPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await legacyPage.goto(`${baseUrl}?mode=legacy`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await legacyPage.waitForTimeout(700);

    const legacyState = await legacyPage.evaluate(() => {
      return {
        bodyMode: document.body.dataset.mode,
        towerSelectDisplay: getComputedStyle(document.getElementById('tower-select')).display,
        restartDisplay: getComputedStyle(document.getElementById('restart-toggle')).display,
        precedentLabel: (document.getElementById('precedent-label')?.textContent || '').trim(),
        narrativeDisplay: getComputedStyle(document.getElementById('runner-narrative')).display,
        hintText: (document.getElementById('tower-hint')?.textContent || '').replace(/\s+/g, ' ').trim(),
        runnerControlsReady: Boolean(window.runnerControls),
        compactExists: Boolean(document.getElementById('compact-ui-toggle')),
        compactText: (document.getElementById('compact-ui-toggle')?.textContent || '').trim()
      };
    });

    if (legacyState.bodyMode !== 'legacy') {
      fail(`Expected legacy mode body dataset, got ${legacyState.bodyMode}.`);
    }
    if (legacyState.towerSelectDisplay === 'none') {
      fail('Expected tower select visible in legacy mode.');
    }
    if (legacyState.restartDisplay !== 'none') {
      fail(`Expected restart button hidden in legacy mode, got ${legacyState.restartDisplay}.`);
    }
    if (legacyState.precedentLabel !== 'PRECEDENT:') {
      fail(`Expected PRECEDENT: label in legacy mode, got "${legacyState.precedentLabel}".`);
    }
    if (legacyState.narrativeDisplay !== 'none') {
      fail(`Expected runner narrative hidden in legacy mode, got ${legacyState.narrativeDisplay}.`);
    }
    if (!legacyState.hintText.includes('Boolean Bits') || !legacyState.hintText.includes('Slows')) {
      fail('Expected legacy hint text to remain tower-defense oriented.');
    }
    if (legacyState.runnerControlsReady) {
      fail('Did not expect runnerControls API in legacy mode.');
    }
    if (!legacyState.compactExists || !legacyState.compactText.includes('COMPACT UI')) {
      fail('Expected compact UI toggle to exist in legacy mode.');
    }

    console.log('PASS: mode shell smoke checks succeeded.');
    console.log('- Runner default shell state: PASS');
    console.log('- Legacy shell routing/state: PASS');
  } finally {
    await browser.close();
  }
})();
