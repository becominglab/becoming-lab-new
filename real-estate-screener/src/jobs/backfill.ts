import { scoreAll } from './score-all.js';
import logger from '../utils/logger.js';

async function main() {
  logger.info('=== Backfill (Re-score All) ===');
  const result = await scoreAll();
  logger.info(`=== Backfill Complete: scored=${result.scored}, errors=${result.errors} ===`);
}

if (process.argv[1]?.endsWith('backfill.ts')) {
  main().catch(error => {
    logger.error('Backfill failed', { error: String(error) });
    process.exit(1);
  });
}
