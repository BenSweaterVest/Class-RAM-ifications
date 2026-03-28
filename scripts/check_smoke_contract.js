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

function main() {
  const failures = [];

  const indexHtml = read('index.html');
  const loader = read('mode-loader.js');
  const runner = read('runner_mode.js');

  // Core UI elements present in index.html
  expectContains(indexHtml, 'id="gameCanvas"', 'game canvas', failures);
  expectContains(indexHtml, 'id="runner-narrative"', 'narrative modal', failures);
  expectContains(indexHtml, 'id="runner-legend"', 'runner legend container', failures);
  expectContains(indexHtml, 'id="audio-mute-toggle"', 'runner mute button', failures);
  expectContains(indexHtml, 'id="theme-toggle"', 'runner theme button', failures);
  expectContains(indexHtml, 'id="restart-toggle"', 'restart toggle', failures);
  expectContains(indexHtml, 'id="difficulty-select"', 'difficulty selector', failures);

  // Loader is runner-only
  expectContains(loader, "loadScript('runner_mode.js')", 'runner loader path', failures);
  expectContains(loader, 'bindRunnerKeyboardFallback()', 'loader keyboard fallback', failures);

  // Runner controls and recovery checks
  expectContains(runner, "if (key === 'ArrowUp')", 'runner ArrowUp handler', failures);
  expectContains(runner, "if (key === 'ArrowDown')", 'runner ArrowDown handler', failures);
  expectContains(runner, "if (key === 'd' || key === 'D')", 'runner dash key handler', failures);
  expectContains(runner, "if (key === 'r' || key === 'R')", 'runner restart key handler', failures);
  expectContains(runner, 'function attemptSolidarityActivation', 'runner solidarity attempt handler', failures);
  expectContains(runner, 'window.runnerControls = {', 'runner global control API', failures);

  // Difficulty system
  expectContains(runner, 'const ROUND_PROFILES', 'per-round difficulty profiles', failures);
  expectContains(runner, 'const DIFFICULTY_MODES', 'difficulty mode scalars', failures);
  expectContains(runner, 'function getRoundProfile', 'round profile resolver', failures);

  // Win screen
  expectContains(indexHtml, 'id="runner-win-screen"', 'win screen overlay', failures);
  expectContains(runner, 'function showWinScreen', 'win screen function', failures);

  if (!failures.length) {
    console.log('PASS: smoke contract checks succeeded.');
    process.exit(0);
  }

  console.error('Smoke contract check failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

main();
