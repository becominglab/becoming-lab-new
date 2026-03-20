import * as fs from 'node:fs';
import * as path from 'node:path';
import { stringify } from 'csv-stringify/sync';
import type { PropertyCanonical, RankingEntry } from '../core/canonical-schema.js';
import type { RankedProperty } from '../core/ranking.js';
import { calcFinance, calcSafetyMargin, calcSensitivity } from '../core/finance.js';
import { calcValuation } from '../core/valuation.js';
import { scoreProperty, buyJudgmentLabel } from '../core/scoring.js';
import { generateExplanation, generateShortSummary } from '../core/explain.js';
import { todayStr } from '../utils/date.js';
import { defaultConfig } from '../config/default.js';
import logger from '../utils/logger.js';

// ─────────────────────────────────────────────
// Markdown レポート生成
// ─────────────────────────────────────────────
export function generateMarkdownReport(
  entries: RankingEntry[],
  date: string,
  allCount: number,
): string {
  const lines: string[] = [];
  lines.push(`# ${date} 東京23区 買い推奨ベスト${entries.length}`);
  lines.push('');
  lines.push(`> 対象物件数: ${allCount}件 | 生成日時: ${new Date().toISOString()}`);
  lines.push('');

  // 差分サマリ
  const newEntries = entries.filter(e => e.isNewEntry);
  const priceDrops = entries.filter(e => e.priceChange !== null && e.priceChange < 0);
  if (newEntries.length > 0 || priceDrops.length > 0) {
    lines.push('## 本日の注目変化');
    if (newEntries.length > 0) {
      lines.push(`- **新着**: ${newEntries.map(e => e.propertyName).join(', ')}`);
    }
    if (priceDrops.length > 0) {
      priceDrops.forEach(e => {
        lines.push(`- **値下げ**: ${e.propertyName} (${Math.round((e.priceChange ?? 0) / 10000)}万円)`);
      });
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');

  // 各物件
  for (const entry of entries) {
    lines.push(`## ${entry.rank}位 ${entry.propertyName}`);
    lines.push('');
    lines.push(`| 項目 | 値 |`);
    lines.push(`|---|---|`);
    lines.push(`| 総合スコア | **${entry.scoreTotal.toFixed(0)}点** |`);
    lines.push(`| 判定 | **${buyJudgmentLabel(entry.buyJudgment)}** |`);
    lines.push(`| 価格 | ${formatJpy(entry.property.propertyPriceJpy)} |`);
    lines.push(`| 表面利回り | ${entry.finance.grossYieldPct.toFixed(2)}% |`);
    lines.push(`| 現況利回り | ${entry.finance.currentYieldPct?.toFixed(2) ?? '不明'}% |`);
    lines.push(`| 満室CF | 年${formatJpy(entry.finance.annualFullCfJpy)} / 月${formatJpy(entry.finance.monthlyFullCfJpy)} |`);
    lines.push(`| 現況CF | 年${entry.finance.annualCurrentCfJpy !== null ? formatJpy(entry.finance.annualCurrentCfJpy) : '不明'} |`);
    lines.push(`| CCR | ${entry.finance.ccrPct?.toFixed(1) ?? '不明'}% |`);
    lines.push(`| 積算比率 | ${entry.valuation.valuationRatioPct?.toFixed(0) ?? '不明'}% |`);
    lines.push(`| 最寄駅 | ${entry.property.station1?.name ?? '不明'} |`);
    lines.push(`| 駅徒歩 | ${entry.property.station1?.walkMin ?? '不明'}分 |`);
    lines.push(`| 総戸数 | ${entry.property.totalUnits ?? '不明'}戸 |`);
    lines.push(`| 構造 | ${entry.property.structureType ?? '不明'} |`);
    lines.push(`| 築年 | ${entry.property.builtYear ?? '不明'}年 |`);
    lines.push(`| 掲載元 | ${entry.property.sourceSite} |`);
    lines.push(`| URL | ${entry.property.sourceUrl} |`);

    if (entry.isNewEntry) {
      lines.push(`| 差分 | **新着** |`);
    } else if (entry.rankChange !== null) {
      const arrow = entry.rankChange > 0 ? `↑${entry.rankChange}` : entry.rankChange < 0 ? `↓${Math.abs(entry.rankChange)}` : '→';
      lines.push(`| 順位変動 | ${arrow} |`);
    }

    lines.push('');

    // 説明文
    lines.push(entry.explanation);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────
// JSON 出力
// ─────────────────────────────────────────────
export function generateJsonReport(entries: RankingEntry[], date: string): string {
  const detailedRankings = entries.map(e => {
    const finance = calcFinance(e.property);
    const valuation = calcValuation(e.property);
    const safety = calcSafetyMargin(e.property);
    const scoring = scoreProperty(e.property, finance, valuation, safety);
    const sensitivity = calcSensitivity(e.property);
    const explanation = generateExplanation(e.property, finance, valuation, safety, scoring);

    return {
      rank: e.rank,
      canonicalId: e.canonicalId,
      propertyName: e.propertyName,
      ward: e.ward,
      scoreTotal: e.scoreTotal,
      buyJudgment: e.buyJudgment,
      isNewEntry: e.isNewEntry,
      rankChange: e.rankChange,
      priceChange: e.priceChange,
      property: {
        address: e.property.address,
        structureType: e.property.structureType,
        builtYear: e.property.builtYear,
        builtMonth: e.property.builtMonth,
        landAreaSqm: e.property.landAreaSqm,
        buildingAreaSqm: e.property.buildingAreaSqm,
        totalFloors: e.property.totalFloors,
        totalUnits: e.property.totalUnits,
        roomBreakdown: e.property.roomBreakdown,
        occupiedUnits: e.property.occupiedUnits,
        vacantUnits: e.property.vacantUnits,
        occupancyRate: e.property.occupancyRate,
        reBuildable: e.property.reBuildable,
        roadDirection: e.property.roadDirection,
        roadWidth: e.property.roadWidth,
        brokerName: e.property.brokerName,
        sourceSite: e.property.sourceSite,
        sourceUrl: e.property.sourceUrl,
        price: e.property.propertyPriceJpy,
        annualFullRentJpy: e.property.annualFullRentJpy,
        annualCurrentRentJpy: e.property.annualCurrentRentJpy,
        selfFundingJpy: e.property.selfFundingJpy,
        loanInterestPct: e.property.loanInterestPct,
        loanYears: e.property.loanYears,
        roadValueJpyPerSqm: e.property.roadValueJpyPerSqm,
        station1: e.property.station1,
        station2: e.property.station2,
        station3: e.property.station3,
      },
      finance,
      valuation,
      safety,
      scores: scoring.scores,
      warningFlags: scoring.warningFlags,
      specialOpportunityFlag: scoring.specialOpportunityFlag,
      scoringDetails: scoring.scoringDetails,
      sensitivity,
      explanation,
    };
  });

  const report = {
    date,
    generatedAt: new Date().toISOString(),
    count: entries.length,
    rankings: detailedRankings,
  };
  return JSON.stringify(report, null, 2);
}

// ─────────────────────────────────────────────
// CSV 出力（全候補）
// ─────────────────────────────────────────────
export function generateAllCandidatesCsv(properties: PropertyCanonical[]): string {
  const rows = properties.map(p => {
    const finance = calcFinance(p);
    const valuation = calcValuation(p);
    const safety = calcSafetyMargin(p);
    const scoring = scoreProperty(p, finance, valuation, safety);

    return {
      canonical_id: p.canonicalId,
      property_name: p.propertyName ?? '',
      ward: p.ward ?? '',
      address: p.address ?? '',
      structure: p.structureType ?? '',
      built_year: p.builtYear ?? '',
      total_units: p.totalUnits ?? '',
      price_jpy: p.propertyPriceJpy,
      gross_yield_pct: finance.grossYieldPct.toFixed(2),
      current_yield_pct: finance.currentYieldPct?.toFixed(2) ?? '',
      annual_full_cf_jpy: Math.round(finance.annualFullCfJpy),
      ccr_pct: finance.ccrPct?.toFixed(1) ?? '',
      valuation_ratio_pct: valuation.valuationRatioPct?.toFixed(0) ?? '',
      score_total: scoring.scores.total.toFixed(0),
      buy_judgment: scoring.buyJudgment,
      station: p.station1?.name ?? '',
      walk_min: p.station1?.walkMin ?? '',
      source_site: p.sourceSite,
      source_url: p.sourceUrl,
      warning_flags: scoring.warningFlags.join(';'),
    };
  });

  return stringify(rows, { header: true });
}

// ─────────────────────────────────────────────
// レビューキュー CSV
// ─────────────────────────────────────────────
export function generateReviewQueueCsv(reviewItems: RankedProperty[]): string {
  const rows = reviewItems.map(r => ({
    canonical_id: r.property.canonicalId,
    property_name: r.property.propertyName ?? '',
    ward: r.property.ward ?? '',
    score_total: r.scoring.scores.total.toFixed(0),
    buy_judgment: r.scoring.buyJudgment,
    warnings: r.scoring.warningFlags.join(';'),
    special_opportunity: r.scoring.specialOpportunityFlag ? 'YES' : 'NO',
    price_jpy: r.property.propertyPriceJpy,
    gross_yield_pct: r.finance.grossYieldPct.toFixed(2),
    source_url: r.property.sourceUrl,
    reason: r.scoring.specialOpportunityFlag
      ? 'ワケあり候補: 知識でリスクを解ける可能性'
      : '情報不足だが精査価値あり',
  }));

  return stringify(rows, { header: true });
}

// ─────────────────────────────────────────────
// 重複レポート CSV
// ─────────────────────────────────────────────
export function generateDuplicatesReportCsv(
  duplicates: Array<{ canonicalId: string; matchedId: string; matchType: string; confidence: number }>,
): string {
  return stringify(duplicates.map(d => ({
    canonical_id: d.canonicalId,
    matched_id: d.matchedId,
    match_type: d.matchType,
    confidence: d.confidence.toFixed(2),
  })), { header: true });
}

// ─────────────────────────────────────────────
// ファイル書き出し
// ─────────────────────────────────────────────
export function writeReports(
  entries: RankingEntry[],
  allProperties: PropertyCanonical[],
  reviewItems: RankedProperty[],
  duplicates: Array<{ canonicalId: string; matchedId: string; matchType: string; confidence: number }>,
  date?: string,
): string {
  const reportDate = date ?? todayStr();
  const reportDir = path.join(defaultConfig.output.reportsDir, reportDate);
  fs.mkdirSync(reportDir, { recursive: true });

  // daily_top10.md
  const md = generateMarkdownReport(entries, reportDate, allProperties.length);
  fs.writeFileSync(path.join(reportDir, 'daily_top10.md'), md, 'utf-8');

  // daily_top10.json
  const json = generateJsonReport(entries, reportDate);
  fs.writeFileSync(path.join(reportDir, 'daily_top10.json'), json, 'utf-8');

  // all_candidates.csv
  const allCsv = generateAllCandidatesCsv(allProperties);
  fs.writeFileSync(path.join(reportDir, 'all_candidates.csv'), allCsv, 'utf-8');

  // review_queue.csv
  const reviewCsv = generateReviewQueueCsv(reviewItems);
  fs.writeFileSync(path.join(reportDir, 'review_queue.csv'), reviewCsv, 'utf-8');

  // duplicates_report.csv
  const dupCsv = generateDuplicatesReportCsv(duplicates);
  fs.writeFileSync(path.join(reportDir, 'duplicates_report.csv'), dupCsv, 'utf-8');

  // run_log.json
  const runLog = {
    date: reportDate,
    generatedAt: new Date().toISOString(),
    totalCandidates: allProperties.length,
    topN: entries.length,
    reviewQueueCount: reviewItems.length,
    duplicatesCount: duplicates.length,
  };
  fs.writeFileSync(path.join(reportDir, 'run_log.json'), JSON.stringify(runLog, null, 2), 'utf-8');

  logger.info(`Reports written to ${reportDir}`);
  return reportDir;
}

function formatJpy(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(2)}億円`;
  }
  return `${Math.round(amount / 10_000).toLocaleString()}万円`;
}

// CLI直接実行用
if (process.argv[1]?.endsWith('report-daily.ts')) {
  // ダミーデータで動作確認
  import('../tests/dummy-data.js').then(({ dummyProperties }) => {
    import('../core/ranking.js').then(({ rankProperties, extractReviewQueue }) => {
      const entries = rankProperties(dummyProperties);
      const reviewItems = extractReviewQueue(dummyProperties);
      const reportDir = writeReports(entries, dummyProperties, reviewItems, []);
      console.log(`Report generated at: ${reportDir}`);
    });
  });
}
