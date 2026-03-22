const { spawnSync } = require('child_process');

const checks = [
  {
    label: 'Syntax: game.js',
    cmd: 'node',
    args: ['--check', 'game.js']
  },
  {
    label: 'Syntax: runner_mode.js',
    cmd: 'node',
    args: ['--check', 'runner_mode.js']
  },
  {
    label: 'Syntax: mode-loader.js',
    cmd: 'node',
    args: ['--check', 'mode-loader.js']
  },
  {
    label: 'Syntax: audio.js',
    cmd: 'node',
    args: ['--check', 'audio.js']
  },
  {
    label: 'Check: asset sync',
    cmd: 'node',
    args: ['scripts/check_asset_sync.js']
  },
  {
    label: 'Check: runner contract',
    cmd: 'node',
    args: ['scripts/check_runner_contract.js']
  },
  {
    label: 'Check: smoke contract',
    cmd: 'node',
    args: ['scripts/check_smoke_contract.js']
  }
];

function runStep(step) {
  console.log(`\n=== ${step.label} ===`);
  const result = spawnSync(step.cmd, step.args, {
    stdio: 'inherit',
    shell: false
  });
  return result.status === 0;
}

function main() {
  console.log('Running Class RAM-ifications verification bundle...');

  for (const step of checks) {
    const ok = runStep(step);
    if (!ok) {
      console.error(`\nFAIL: ${step.label}`);
      process.exit(1);
    }
  }

  console.log('\nPASS: all verification checks succeeded.');
}

main();
