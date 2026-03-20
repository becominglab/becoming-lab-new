/**
 * 最新レポートをNext.jsのpublic配下にコピーするスクリプト
 * Usage: npx tsx src/scripts/export-to-public.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const REPORTS_DIR = path.join(import.meta.dirname, '../../data/reports');
const PUBLIC_DIR = path.join(import.meta.dirname, '../../../public/s/inv-a8f3e1d9');

function getLatestReportDir(): string | null {
  if (!fs.existsSync(REPORTS_DIR)) return null;
  const dirs = fs
    .readdirSync(REPORTS_DIR)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort()
    .reverse();
  return dirs[0] ? path.join(REPORTS_DIR, dirs[0]) : null;
}

const latestDir = getLatestReportDir();
if (!latestDir) {
  console.error('No report found. Run daily screening first.');
  process.exit(1);
}

const src = path.join(latestDir, 'daily_top10.json');
if (!fs.existsSync(src)) {
  console.error(`daily_top10.json not found in ${latestDir}`);
  process.exit(1);
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.copyFileSync(src, path.join(PUBLIC_DIR, 'screening-data.json'));
console.log(`Exported ${src} → ${path.join(PUBLIC_DIR, 'screening-data.json')}`);
