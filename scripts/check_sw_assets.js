const fs = require('fs');
const path = require('path');

// Every file the service worker precaches must exist on disk, and every
// gameplay sprite on disk must be precached. A missing entry makes
// cache.addAll() reject and the install fails; an unlisted sprite is simply
// absent when the game is opened offline.

const root = process.cwd();

function main() {
  const failures = [];

  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const listed = [...sw.matchAll(/'\.\/([^']+)'/g)].map(m => m[1]).filter(p => p !== '');

  for (const rel of listed) {
    if (!fs.existsSync(path.join(root, rel))) {
      failures.push(`Listed in sw.js but missing on disk: ${rel}`);
    }
  }

  const spriteDir = 'assets/processed';
  for (const file of fs.readdirSync(path.join(root, spriteDir))) {
    const rel = `${spriteDir}/${file}`;
    if (!listed.includes(rel)) {
      failures.push(`On disk but not precached in sw.js: ${rel}`);
    }
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  for (const icon of manifest.icons || []) {
    if (!fs.existsSync(path.join(root, icon.src))) {
      failures.push(`manifest.json icon missing on disk: ${icon.src}`);
    }
  }

  if (!failures.length) {
    console.log(`PASS: service worker precache list matches disk (${listed.length} entries).`);
    process.exit(0);
  }

  console.error('Service worker asset check failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}

main();
