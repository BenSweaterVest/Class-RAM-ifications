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

  expectContains(indexHtml, 'id="runner-narrative"', 'narrative modal', failures);
  expectContains(indexHtml, 'id="runner-legend"', 'runner legend container', failures);
  expectContains(indexHtml, 'id="audio-mute-toggle"', 'audio mute toggle', failures);
  expectContains(indexHtml, 'id="theme-toggle"', 'theme toggle', failures);

  expectContains(loader, "const mode = rawMode === 'legacy' ? 'legacy' : 'runner';", 'runner-default mode routing', failures);
  expectContains(loader, 'bindRunnerKeyboardFallback()', 'loader keyboard fallback', failures);

  expectContains(runner, 'function attemptSolidarityActivation', 'solidarity attempt handler', failures);
  expectContains(runner, 'function getSolidarityState', 'solidarity state calculator', failures);
  expectContains(runner, 'const NARRATIVE_COPY = {', 'narrative copy map', failures);
  expectContains(runner, 'function showNextNarrative()', 'narrative step renderer', failures);
  expectContains(runner, "window.runnerControls = {", 'global runner controls API', failures);

  if (!failures.length) {
    console.log('PASS: runner contract checks succeeded.');
    process.exit(0);
  }

  console.error('Runner contract check failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

main();
