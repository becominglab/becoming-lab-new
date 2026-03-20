import { prisma } from '../db/client.js';
import { dbRecordToCanonical } from './score-all.js';
import { rankProperties, extractReviewQueue } from '../core/ranking.js';
import { todayStr, formatDate } from '../utils/date.js';
import logger from '../utils/logger.js';
import type { PropertyCanonical } from '../core/canonical-schema.js';

async function main() {
  logger.info('=== Rank Daily ===');

  const date = todayStr();

  // 1. scored 物件を取得
  const dbProperties = await prisma.propertyCanonical.findMany({
    where: { isActive: true, scoreTotal: { not: null } },
    include: { sources: true },
    orderBy: { scoreTotal: 'desc' },
  });

  if (dbProperties.length === 0) {
    logger.warn('No scored properties found. Run score-all first.');
    return;
  }

  const properties: PropertyCanonical[] = dbProperties.map(dbRecordToCanonical);
  logger.info(`Found ${properties.length} scored properties`);

  // 2. 前日のランキングを取得（差分比較用）
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  const previousRun = await prisma.dailyRun.findUnique({
    where: { runDate: yesterdayStr },
    include: { rankings: true },
  });

  const previousRankings = new Map<string, number>();
  const previousPrices = new Map<string, number>();

  if (previousRun) {
    for (const ranking of previousRun.rankings) {
      const prop = await prisma.propertyCanonical.findUnique({
        where: { id: ranking.propertyId },
      });
      if (prop) {
        previousRankings.set(prop.canonicalId, ranking.rank);
        previousPrices.set(prop.canonicalId, prop.propertyPriceJpy);
      }
    }
  }

  // 3. ランキング生成
  const entries = rankProperties(properties, 10, previousRankings, previousPrices);
  logger.info(`Top ${entries.length} generated`);

  // 4. DailyRun 作成
  const run = await prisma.dailyRun.upsert({
    where: { runDate: date },
    update: {
      totalScored: dbProperties.length,
      finishedAt: new Date(),
      status: 'completed',
    },
    create: {
      runDate: date,
      status: 'completed',
      totalScored: dbProperties.length,
      finishedAt: new Date(),
    },
  });

  // 既存ランキング削除して再作成
  await prisma.dailyRanking.deleteMany({ where: { runId: run.id } });

  // 5. DailyRanking に保存
  for (const entry of entries) {
    const prop = await prisma.propertyCanonical.findUnique({
      where: { canonicalId: entry.canonicalId },
    });
    if (!prop) continue;

    await prisma.dailyRanking.create({
      data: {
        runId: run.id,
        propertyId: prop.id,
        rank: entry.rank,
        scoreTotal: entry.scoreTotal,
        buyJudgment: entry.buyJudgment,
        explanation: entry.explanation,
        isNewEntry: entry.isNewEntry,
        rankChange: entry.rankChange,
        priceChange: entry.priceChange,
      },
    });
  }

  // 6. ReviewQueue に保存
  const reviewItems = extractReviewQueue(properties);
  for (const item of reviewItems) {
    const prop = await prisma.propertyCanonical.findUnique({
      where: { canonicalId: item.property.canonicalId },
    });
    if (!prop) continue;

    await prisma.reviewQueue.upsert({
      where: { id: -1 }, // force create (no unique constraint on propertyId alone)
      update: {},
      create: {
        propertyId: prop.id,
        reason: item.scoring.specialOpportunityFlag
          ? 'ワケあり候補: 知識でリスクをさばける可能性'
          : `情報不足だが精査価値あり (警告: ${item.scoring.warningFlags.join(', ')})`,
        priority: Math.round(item.scoring.scores.total),
        status: 'pending',
      },
    }).catch(() => {
      // upsert に一意制約がないので create で代替
      return prisma.reviewQueue.create({
        data: {
          propertyId: prop.id,
          reason: item.scoring.specialOpportunityFlag
            ? 'ワケあり候補: 知識でリスクをさばける可能性'
            : `情報不足だが精査価値あり (警告: ${item.scoring.warningFlags.join(', ')})`,
          priority: Math.round(item.scoring.scores.total),
          status: 'pending',
        },
      });
    });
  }

  logger.info(`=== Rank Complete: top${entries.length}, review=${reviewItems.length} ===`);
  return { entries, reviewItems, run };
}

export { main as rankDaily };

if (process.argv[1]?.endsWith('rank-daily.ts')) {
  main().catch(error => {
    logger.error('Rank failed', { error: String(error) });
    process.exit(1);
  });
}
