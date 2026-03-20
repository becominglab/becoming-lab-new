import type { PropertyCanonical, FinanceResult, ValuationResult, SafetyMarginResult, ScoringResult, RankingEntry } from './canonical-schema.js';
import { calcFinance, calcSafetyMargin } from './finance.js';
import { calcValuation } from './valuation.js';
import { scoreProperty } from './scoring.js';
import { generateExplanation } from './explain.js';
import { defaultConfig } from '../config/default.js';

export interface RankedProperty {
  property: PropertyCanonical;
  finance: FinanceResult;
  valuation: ValuationResult;
  safety: SafetyMarginResult;
  scoring: ScoringResult;
  explanation: string;
}

/**
 * 物件リストをスコアリングしてランキングを作成
 */
export function rankProperties(
  properties: PropertyCanonical[],
  topN: number = defaultConfig.topN,
  previousRankings?: Map<string, number>, // canonicalId -> previous rank
  previousPrices?: Map<string, number>,   // canonicalId -> previous price
): RankingEntry[] {
  // 全物件をスコアリング
  const scored: RankedProperty[] = properties.map(property => {
    const finance = calcFinance(property);
    const valuation = calcValuation(property);
    const safety = calcSafetyMargin(property);
    const scoring = scoreProperty(property, finance, valuation, safety);
    const explanation = generateExplanation(property, finance, valuation, safety, scoring);

    return { property, finance, valuation, safety, scoring, explanation };
  });

  // special_opportunity_flag が立っているものは原則除外（ただしスコアが高ければ含める）
  const regular = scored.filter(s =>
    !s.scoring.specialOpportunityFlag || s.scoring.scores.total >= 75
  );

  // スコア降順でソート
  regular.sort((a, b) => b.scoring.scores.total - a.scoring.scores.total);

  // ベストN を抽出
  const topEntries = regular.slice(0, topN);

  return topEntries.map((entry, index): RankingEntry => {
    const rank = index + 1;
    const prevRank = previousRankings?.get(entry.property.canonicalId) ?? null;
    const prevPrice = previousPrices?.get(entry.property.canonicalId) ?? null;

    return {
      rank,
      canonicalId: entry.property.canonicalId,
      propertyName: entry.property.propertyName ?? '名称不明',
      ward: entry.property.ward ?? '不明',
      scoreTotal: entry.scoring.scores.total,
      buyJudgment: entry.scoring.buyJudgment,
      explanation: entry.explanation,
      isNewEntry: prevRank === null,
      rankChange: prevRank !== null ? prevRank - rank : null,
      priceChange: prevPrice !== null ? entry.property.propertyPriceJpy - prevPrice : null,
      finance: entry.finance,
      valuation: entry.valuation,
      property: entry.property,
    };
  });
}

/**
 * レビューキュー候補を抽出
 * special_opportunity_flag または情報不足だがスコアが中程度の物件
 */
export function extractReviewQueue(
  properties: PropertyCanonical[],
): RankedProperty[] {
  const scored: RankedProperty[] = properties.map(property => {
    const finance = calcFinance(property);
    const valuation = calcValuation(property);
    const safety = calcSafetyMargin(property);
    const scoring = scoreProperty(property, finance, valuation, safety);
    const explanation = generateExplanation(property, finance, valuation, safety, scoring);
    return { property, finance, valuation, safety, scoring, explanation };
  });

  return scored.filter(s =>
    s.scoring.specialOpportunityFlag ||
    (s.scoring.warningFlags.length > 0 && s.scoring.scores.total >= 55)
  );
}
