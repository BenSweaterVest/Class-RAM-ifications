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
  const legacy = read('game.js');

  // Startup and mode shell checks.
  expectContains(indexHtml, 'id="gameCanvas"', 'game canvas', failures);
  expectContains(indexHtml, 'id="mode-banner"', 'mode banner', failures);
  expectContains(indexHtml, 'id="tower-select"', 'legacy tower controls container', failures);
  expectContains(indexHtml, 'id="runner-controls"', 'runner controls container', failures);
  expectContains(indexHtml, 'id="runner-help"', 'runner help panel', failures);

  // Mode-router checks.
  expectContains(loader, "const mode = rawMode === 'legacy' ? 'legacy' : 'runner';", 'runner-default mode selection', failures);
  expectContains(loader, "loadScript('runner_mode.js')", 'runner loader path', failures);
  expectContains(loader, "loadScript('game.js')", 'legacy loader path', failures);

  // Runner controls and recovery checks.
  expectContains(runner, "if (key === 'ArrowUp')", 'runner ArrowUp handler', failures);
  expectContains(runner, "if (key === 'ArrowDown')", 'runner ArrowDown handler', failures);
  expectContains(runner, "if (key === 'd' || key === 'D')", 'runner dash key handler', failures);
  expectContains(runner, "if (key === 'r' || key === 'R')", 'runner restart key handler', failures);
  expectContains(runner, 'function attemptSolidarityActivation', 'runner solidarity attempt handler', failures);
  expectContains(runner, 'window.runnerControls = {', 'runner global control API', failures);

  // Legacy controls and fallback checks.
  expectContains(legacy, "if (e.key === '1')", 'legacy key 1 select', failures);
  expectContains(legacy, "if (e.key === '2')", 'legacy key 2 select', failures);
  expectContains(legacy, "if (e.key === '3')", 'legacy key 3 select', failures);
  expectContains(legacy, "if (e.key === '4')", 'legacy key 4 select', failures);
  expectContains(legacy, "else if (e.key === 'm' || e.key === 'M')", 'legacy mute key handler', failures);
  expectContains(legacy, "else if (e.key === 'r' || e.key === 'R')", 'legacy restart key handler', failures);

  if (!failures.length) {
    console.log('PASS: smoke contract checks succeeded.');
    process.exit(0);
  }

  console.error('Smoke contract check failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

main();
