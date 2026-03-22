const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();
const runtimeDir = path.join(root, 'assets', 'processed');
const sourceDir = path.join(root, 'class_ram_ifications assets');

function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function listPngs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(name => name.toLowerCase().endsWith('.png'))
    .sort();
}

function main() {
  const runtimeFiles = listPngs(runtimeDir);
  const sourceFiles = listPngs(sourceDir);

  if (!runtimeFiles.length || !sourceFiles.length) {
    console.error('Asset sync check failed: one or both PNG folders are missing/empty.');
    process.exit(1);
  }

  const runtimeSet = new Set(runtimeFiles);
  const sourceSet = new Set(sourceFiles);

  const missingInRuntime = sourceFiles.filter(f => !runtimeSet.has(f));
  const missingInSource = runtimeFiles.filter(f => !sourceSet.has(f));

  const mismatchedHash = [];
  for (const name of runtimeFiles) {
    if (!sourceSet.has(name)) continue;
    const runtimeHash = hashFile(path.join(runtimeDir, name));
    const sourceHash = hashFile(path.join(sourceDir, name));
    if (runtimeHash !== sourceHash) {
      mismatchedHash.push(name);
    }
  }

  console.log('Asset sync summary');
  console.log(`- runtime PNG count: ${runtimeFiles.length}`);
  console.log(`- source PNG count: ${sourceFiles.length}`);

  if (!missingInRuntime.length && !missingInSource.length && !mismatchedHash.length) {
    console.log('PASS: source and runtime PNG sets are synchronized.');
    process.exit(0);
  }

  if (missingInRuntime.length) {
    console.log('Missing in runtime:');
    missingInRuntime.forEach(name => console.log(`  - ${name}`));
  }

  if (missingInSource.length) {
    console.log('Missing in source:');
    missingInSource.forEach(name => console.log(`  - ${name}`));
  }

  if (mismatchedHash.length) {
    console.log('Hash mismatch:');
    mismatchedHash.forEach(name => console.log(`  - ${name}`));
  }

  process.exit(1);
}

main();
