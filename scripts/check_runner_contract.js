const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function expectContains(content, needle, label, failures) {
  if (!content.includes(needle)) {
    failures.push(`Missing ${label}: ${needle}`);
  }
}

function expectNotContains(content, needle, label, failures) {
  if (content.includes(needle)) {
    failures.push(`Unexpected ${label}: ${needle}`);
  }
}

function main() {
  const failures = [];

  const indexHtml = read('index.html');
  const loader = read('mode-loader.js');
  const runner = read('runner_mode.js');
  const serviceWorker = read('sw.js');

  // Core UI elements
  expectContains(indexHtml, 'id="runner-narrative"', 'narrative modal', failures);
  expectContains(indexHtml, 'id="runner-legend"', 'runner legend container', failures);
  expectContains(indexHtml, 'id="audio-mute-toggle"', 'audio mute toggle', failures);
  expectContains(indexHtml, 'id="theme-toggle"', 'theme toggle', failures);
  expectContains(indexHtml, 'id="restart-toggle"', 'restart toggle', failures);
  expectContains(indexHtml, 'id="difficulty-select"', 'difficulty selector dropdown', failures);

  // Mobile UI elements
  expectContains(indexHtml, 'id="runner-legend-sheet"', 'mobile legend bottom sheet', failures);
  expectContains(indexHtml, 'id="runner-touch-hint"', 'touch hint overlay', failures);

  // Loader: loads the game and must not register its own game key handler.
  // runner_mode.js owns keyboard input; a second handler double-fires Space.
  expectContains(loader, "loadScript('runner_mode.js')", 'runner loader path', failures);
  expectNotContains(loader, "addEventListener('keydown'", 'duplicate loader keydown handler', failures);
  expectNotContains(loader, 'Date.now()', 'cache-busting query on the game script', failures);

  // Pause system and run timer
  expectContains(runner, 'function setGamePaused', 'pause state setter', failures);
  expectContains(runner, 'function syncPauseClock', 'shared pause clock', failures);
  expectContains(runner, 'pause: () => setGamePaused(true)', 'runnerControls.pause', failures);
  expectContains(indexHtml, 'id="time-val"', 'run timer readout', failures);
  expectContains(indexHtml, 'controls.pause()', 'info modal pause hook', failures);

  // Service worker must tolerate query strings on cached URLs
  expectContains(serviceWorker, 'ignoreSearch: true', 'query-insensitive cache match', failures);

  // Runner core functions
  expectContains(runner, 'function attemptSolidarityActivation', 'solidarity attempt handler', failures);
  expectContains(runner, 'function getSolidarityState', 'solidarity state calculator', failures);
  expectContains(runner, 'const NARRATIVE_COPY = {', 'narrative copy map', failures);
  expectContains(runner, 'function showNextNarrative()', 'narrative step renderer', failures);
  expectContains(runner, "window.runnerControls = {", 'global runner controls API', failures);
  // Difficulty system
  expectContains(runner, 'const ROUND_PROFILES', 'per-round difficulty profiles', failures);
  expectContains(runner, 'const DIFFICULTY_MODES', 'difficulty mode scalars', failures);
  expectContains(runner, 'function getRoundProfile', 'round profile resolver', failures);

  // Mobile gesture and bottom sheet functions
  expectContains(runner, 'function handleTouchGestureStart', 'touch gesture start handler', failures);
  expectContains(runner, 'function isMobileLegendSheetMode', 'mobile sheet mode detector', failures);
  expectContains(runner, 'let legendPaused', 'legend pause state', failures);

  if (!failures.length) {
    console.log('PASS: runner contract checks succeeded.');
    process.exit(0);
  }

  console.error('Runner contract check failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

main();
