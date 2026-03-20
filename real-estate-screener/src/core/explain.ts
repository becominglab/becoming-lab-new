import type { PropertyCanonical, FinanceResult, ValuationResult, SafetyMarginResult, ScoringResult } from './canonical-schema.js';
import { buyJudgmentLabel } from './scoring.js';

/**
 * 物件の評価説明文を生成
 * テンプレ埋め込みではなく、条件分岐で自然な文章を出す
 */
export function generateExplanation(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  safety: SafetyMarginResult,
  scoring: ScoringResult,
): string {
  const lines: string[] = [];
  const { scores, warningFlags, specialOpportunityFlag } = scoring;

  // ── 総合判定 ──
  lines.push(`【${buyJudgmentLabel(scoring.buyJudgment)}】総合スコア ${scores.total.toFixed(0)}点`);
  lines.push('');

  // ── 強み ──
  const strengths: string[] = [];
  collectStrengths(property, finance, valuation, safety, scores, strengths);
  if (strengths.length > 0) {
    lines.push('▼ 主な加点理由');
    strengths.forEach(s => lines.push(`  - ${s}`));
    lines.push('');
  }

  // ── 懸念 ──
  const concerns: string[] = [];
  collectConcerns(property, finance, valuation, safety, scores, warningFlags, concerns);
  if (concerns.length > 0) {
    lines.push('▼ 主な懸念');
    concerns.forEach(c => lines.push(`  - ${c}`));
    lines.push('');
  }

  // ── ひとこと判断 ──
  lines.push(`▼ ひとこと`);
  lines.push(`  ${generateOneLiner(property, finance, valuation, scores, specialOpportunityFlag)}`);
  lines.push('');

  // ── 向いている投資家 ──
  lines.push(`▼ こんな人向き`);
  lines.push(`  ${suggestTargetInvestor(property, finance, scores)}`);

  return lines.join('\n');
}

function collectStrengths(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  safety: SafetyMarginResult,
  scores: import('./canonical-schema.js').ScoreBreakdown,
  out: string[],
): void {
  const walk = property.station1?.walkMin;
  const units = property.totalUnits ?? 0;

  if (walk && walk <= 5) out.push(`駅徒歩${walk}分と駅近で空室リスクが低い`);
  else if (walk && walk <= 10) out.push(`駅徒歩${walk}分で通勤利便性が良好`);

  if (finance.grossYieldPct >= 8) out.push(`表面利回り${finance.grossYieldPct.toFixed(1)}%で23区内としては高水準`);
  if (finance.annualFullCfJpy > 1_000_000) out.push(`満室CF年${Math.round(finance.annualFullCfJpy / 10000)}万円で手残りが確保できる`);
  if (safety.isSafe) out.push('金利5%・家賃80%のストレステストでもCF黒字を維持');

  if (valuation.valuationRatioPct !== null && valuation.valuationRatioPct >= 80) {
    out.push(`積算比率${valuation.valuationRatioPct.toFixed(0)}%で融資評価が高い`);
  }
  if (valuation.landValuationJpy !== null) {
    const landRatio = (valuation.landValuationJpy / property.propertyPriceJpy) * 100;
    if (landRatio >= 60) out.push(`土地値が価格の${landRatio.toFixed(0)}%を占め、出口の下支えがある`);
  }

  if (property.reBuildable === true) out.push('再建築可で将来の建て替え・売却が可能');
  if (units >= 6) out.push(`${units}戸で管理効率が良く、空室リスクが分散される`);

  if (scores.valueCreation >= 10) out.push('家賃増額・空室改善・間取り変更など再生余地が大きい');
  if (scores.vision >= 3) out.push('オーナー住戸化やコミュニティ拠点としての転用余地がある');
}

function collectConcerns(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  safety: SafetyMarginResult,
  scores: import('./canonical-schema.js').ScoreBreakdown,
  warningFlags: import('./canonical-schema.js').WarningFlag[],
  out: string[],
): void {
  if (warningFlags.includes('non_rebuildable')) out.push('再建築不可のため出口が細く、融資も付きにくい');
  if (warningFlags.includes('unknown_road_access')) out.push('接道状況が不明。再建築可否の確認が必要');
  if (warningFlags.includes('high_yield_high_vacancy')) out.push('利回りは高いが空室が多く、実質収益は要確認');
  if (warningFlags.includes('unknown_current_rent')) out.push('現況家賃が不明。レントロールの確認が必須');
  if (warningFlags.includes('weak_valuation')) out.push('積算評価が物件価格を大きく下回り、融資が通りにくい可能性');
  if (warningFlags.includes('weak_land_value')) out.push('土地値比率が低く、出口の下支えが弱い');
  if (warningFlags.includes('insufficient_rent_roll')) out.push('入居状況の詳細が不明。精査が必要');

  if (!safety.isSafe) out.push(`安全余力テスト不通過（月${Math.round(safety.safeMonthlyCfJpy / 1000)}千円）。金利上昇リスクに注意`);

  const age = valuation.ageYears;
  if (age !== null && age > 35) out.push(`築${age}年で大規模修繕の可能性。修繕履歴の確認を推奨`);
  if (age !== null && age > 40 && property.structureType === 'W') out.push('木造築40年超。耐震・劣化の確認が必須');
}

function generateOneLiner(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  scores: import('./canonical-schema.js').ScoreBreakdown,
  specialOpportunity: boolean,
): string {
  const ward = property.ward ?? '23区内';
  const walk = property.station1?.walkMin ?? null;
  const units = property.totalUnits ?? 0;
  const struct = property.structureType ?? '';
  const yieldStr = `表面${finance.grossYieldPct.toFixed(1)}%`;

  if (specialOpportunity) {
    return `ワケあり物件だが、知識でリスクをさばける余地がある。精査推奨。`;
  }

  if (scores.total >= 85) {
    return `${ward}・駅徒歩${walk ?? '?'}分・${units}戸・${yieldStr}。立地・収益・出口のバランスが取れた優良候補。即検討を推奨。`;
  }
  if (scores.total >= 75) {
    return `${ward}で${yieldStr}が取れる堅実な物件。融資がつけば次の買い増しにもつながる。`;
  }
  if (scores.total >= 65) {
    return `${ward}の${struct}${units}戸。数字は悪くないが、情報不足箇所があり精査が必要。`;
  }
  if (scores.total >= 50) {
    return `現状の数字では積極的に動く水準にない。条件変更（値下げ・空室改善）があれば再評価。`;
  }
  return `スコアが低く、現段階では見送り。他の候補を優先。`;
}

function suggestTargetInvestor(
  property: PropertyCanonical,
  finance: FinanceResult,
  scores: import('./canonical-schema.js').ScoreBreakdown,
): string {
  const price = property.propertyPriceJpy;

  if (price <= 30_000_000 && finance.grossYieldPct >= 8) {
    return '1棟目として始めたい初心者〜2棟目の買い増し層。融資のハードルが低い価格帯。';
  }
  if (scores.valueCreation >= 10) {
    return 'リノベ・空室改善で価値を引き上げられる経験者。手間をかけてリターンを最大化したい人。';
  }
  if (scores.vision >= 3) {
    return '自宅兼投資やコミュニティ拠点など、投資+ライフスタイルを両立させたい人。';
  }
  if (price >= 80_000_000) {
    return '既に実績があり、金融機関との関係が構築済みの中級以上の投資家。';
  }
  return '堅実にCFを積み上げたい投資家。特別な戦略は不要だが、基本に忠実な運用が求められる。';
}

/**
 * 簡潔な1行サマリを生成（ランキング表示用）
 */
export function generateShortSummary(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
): string {
  const parts: string[] = [];
  const walk = property.station1?.walkMin;
  if (walk) parts.push(`徒歩${walk}分`);
  if (property.totalUnits) parts.push(`${property.totalUnits}戸`);
  if (property.structureType) parts.push(property.structureType);
  parts.push(`表面${finance.grossYieldPct.toFixed(1)}%`);
  if (valuation.valuationRatioPct !== null) parts.push(`積算${valuation.valuationRatioPct.toFixed(0)}%`);
  return parts.join('・');
}
