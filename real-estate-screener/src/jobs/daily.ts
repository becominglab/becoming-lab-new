import { prisma } from '../db/client.js';
import { crawlAll } from './crawl-all.js';
import { normalizeAll } from './normalize-all.js';
import { scoreAll } from './score-all.js';
import { rankDaily } from './rank-daily.js';
import { dbRecordToCanonical } from './score-all.js';
import { rankProperties, extractReviewQueue } from '../core/ranking.js';
import { deduplicateProperties } from '../core/dedupe.js';
import { writeReports } from './report-daily.js';
import { todayStr } from '../utils/date.js';
import logger from '../utils/logger.js';
import type { PropertyCanonical } from '../core/canonical-schema.js';

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  const date = todayStr();
  const startedAt = new Date();
  logger.info(`=== Daily Run: ${date} ===`);

  let allProperties: PropertyCanonical[];
  let crawlResult = { totalFetched: 0, totalSaved: 0, totalErrors: 0 };
  let normalizeResult = { normalized: 0, filtered: 0, failed: 0 };
  let scoreResult = { scored: 0, errors: 0 };

  if (isDryRun) {
    // ── ドライラン: ダミーデータで動作確認 ──
    logger.info('Dry-run mode: using dummy data');
    const { dummyProperties } = await import('../tests/dummy-data.js');
    allProperties = dummyProperties;
  } else {
    // ── 本番: DB連携パイプライン ──

    // Step 1: クロール
    logger.info('Step 1/4: Crawling...');
    try {
      crawlResult = await crawlAll();
    } catch (error) {
      logger.error('Crawl step failed, continuing with existing data', { error: String(error) });
    }

    // Step 2: 正規化
    logger.info('Step 2/4: Normalizing...');
    try {
      normalizeResult = await normalizeAll();
    } catch (error) {
      logger.error('Normalize step failed, continuing with existing data', { error: String(error) });
    }

    // Step 3: スコアリング
    logger.info('Step 3/4: Scoring...');
    try {
      scoreResult = await scoreAll();
    } catch (error) {
      logger.error('Score step failed', { error: String(error) });
    }

    // Step 4: DB から scored 物件を取得
    logger.info('Step 4/4: Ranking & reporting...');
    const dbProperties = await prisma.propertyCanonical.findMany({
      where: { isActive: true, scoreTotal: { not: null } },
      include: { sources: true },
    });
    allProperties = dbProperties.map(dbRecordToCanonical);

    // DB ランキング保存
    try {
      await rankDaily();
    } catch (error) {
      logger.error('DB rank step failed, continuing with file output', { error: String(error) });
    }
  }

  logger.info(`Total candidates: ${allProperties.length}`);

  if (allProperties.length === 0) {
    logger.warn('No properties to rank. Check crawl/normalize steps.');

    // DailyRun 記録
    if (!isDryRun) {
      await prisma.dailyRun.upsert({
        where: { runDate: date },
        update: {
          finishedAt: new Date(),
          status: 'completed',
          totalFetched: crawlResult.totalFetched,
          totalNormalized: normalizeResult.normalized,
          totalScored: scoreResult.scored,
          errorCount: crawlResult.totalErrors + normalizeResult.failed + scoreResult.errors,
        },
        create: {
          runDate: date,
          startedAt,
          finishedAt: new Date(),
          status: 'completed',
          totalFetched: crawlResult.totalFetched,
          totalNormalized: normalizeResult.normalized,
          totalScored: scoreResult.scored,
          errorCount: crawlResult.totalErrors + normalizeResult.failed + scoreResult.errors,
        },
      });
    }

    console.log('\n  物件が見つかりませんでした。\n');
    return;
  }

  // 名寄せ・重複排除
  const { merged, duplicates } = deduplicateProperties(allProperties);
  logger.info(`After dedup: ${merged.length} properties (${duplicates.length} duplicates found)`);

  // ランキング生成
  const entries = rankProperties(merged);
  logger.info(`Top ${entries.length} generated`);

  // レビューキュー
  const reviewItems = extractReviewQueue(merged);
  logger.info(`Review queue: ${reviewItems.length} items`);

  // レポート出力
  const reportDir = writeReports(entries, merged, reviewItems, duplicates, date);
  logger.info(`Reports written to ${reportDir}`);

  // DailyRun 記録（本番のみ）
  if (!isDryRun) {
    await prisma.dailyRun.upsert({
      where: { runDate: date },
      update: {
        finishedAt: new Date(),
        status: 'completed',
        totalFetched: crawlResult.totalFetched,
        totalNormalized: normalizeResult.normalized,
        totalScored: scoreResult.scored,
        newListings: entries.filter(e => e.isNewEntry).length,
        priceChanges: entries.filter(e => e.priceChange !== null && e.priceChange !== 0).length,
        errorCount: crawlResult.totalErrors + normalizeResult.failed + scoreResult.errors,
      },
      create: {
        runDate: date,
        startedAt,
        finishedAt: new Date(),
        status: 'completed',
        totalFetched: crawlResult.totalFetched,
        totalNormalized: normalizeResult.normalized,
        totalScored: scoreResult.scored,
        newListings: entries.filter(e => e.isNewEntry).length,
        priceChanges: entries.filter(e => e.priceChange !== null && e.priceChange !== 0).length,
        errorCount: crawlResult.totalErrors + normalizeResult.failed + scoreResult.errors,
      },
    });
  }

  // サマリ出力
  console.log('\n========================================');
  console.log(`  ${date} 東京23区 買い推奨ベスト${entries.length}`);
  console.log('========================================\n');
  for (const entry of entries) {
    const judgment = entry.buyJudgment === 'strong_buy' ? '★★★'
      : entry.buyJudgment === 'buy' ? '★★'
      : entry.buyJudgment === 'review' ? '★'
      : '  ';
    const diff = entry.isNewEntry ? ' [NEW]'
      : entry.rankChange !== null && entry.rankChange > 0 ? ` [↑${entry.rankChange}]`
      : entry.rankChange !== null && entry.rankChange < 0 ? ` [↓${Math.abs(entry.rankChange)}]`
      : '';
    const priceChg = entry.priceChange !== null && entry.priceChange < 0
      ? ` 値下${Math.round(Math.abs(entry.priceChange) / 10000)}万`
      : '';

    console.log(`  ${entry.rank}. ${judgment} ${entry.propertyName} (${entry.ward})${diff}${priceChg}`);
    console.log(`     スコア: ${entry.scoreTotal.toFixed(0)}点 | 利回り: ${entry.finance.grossYieldPct.toFixed(1)}% | CF: 年${Math.round(entry.finance.annualFullCfJpy / 10000)}万円 | 積算: ${entry.valuation.valuationRatioPct?.toFixed(0) ?? '?'}%`);
    console.log('');
  }

  if (reviewItems.length > 0) {
    console.log(`  📋 レビューキュー: ${reviewItems.length}件`);
    console.log(`  📁 レポート: ${reportDir}\n`);
  }

  logger.info('=== Daily Run Complete ===');
}

main().catch(error => {
  logger.error('Daily run failed', { error: String(error) });
  process.exit(1);
});
