import type { PropertyCanonical, ScoreBreakdown, ScoringResult, FinanceResult, ValuationResult, SafetyMarginResult } from './canonical-schema.js';
import { type BuyJudgment, type WarningFlag } from './canonical-schema.js';
import { scoringWeights } from '../config/scoring-weights.js';
import { getWardPopularity, getWardSingleDemand } from '../config/wards.js';

/** ユーティリティ: 値を0〜maxの範囲にクランプ */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** 線形スケール: value が low〜high の範囲で 0〜maxPoints に変換 */
function linearScale(value: number, low: number, high: number, maxPoints: number): number {
  if (value <= low) return 0;
  if (value >= high) return maxPoints;
  return ((value - low) / (high - low)) * maxPoints;
}

/** 逆線形スケール: 値が小さいほど高得点 */
function inverseLinearScale(value: number, low: number, high: number, maxPoints: number): number {
  if (value <= low) return maxPoints;
  if (value >= high) return 0;
  return ((high - value) / (high - low)) * maxPoints;
}

// ─────────────────────────────────────────────
// A. 立地・需要スコア（25点）
// ─────────────────────────────────────────────
function scoreLocation(
  property: PropertyCanonical,
  details: Record<string, string>,
): number {
  const w = scoringWeights.location.breakdown;
  let total = 0;

  // 駅徒歩 (6点): 1分=満点, 15分=0点
  const walk = property.station1?.walkMin ?? 20;
  const walkScore = inverseLinearScale(walk, 1, 16, w.walkMinutes);
  total += walkScore;
  details['立地_駅徒歩'] = `${walk}分 → ${walkScore.toFixed(1)}/${w.walkMinutes}点`;

  // 複数路線 (3点): 2路線=2点, 3路線=3点
  let lineCount = 0;
  if (property.station1?.name) lineCount++;
  if (property.station2?.name) lineCount++;
  if (property.station3?.name) lineCount++;
  const lineScore = clamp(lineCount - 1, 0, w.multipleLines);
  total += lineScore;
  details['立地_路線数'] = `${lineCount}路線 → ${lineScore.toFixed(1)}/${w.multipleLines}点`;

  // 区の人気度 (5点)
  const wardPop = getWardPopularity(property.ward ?? '');
  const wardScore = (wardPop / 10) * w.wardPopularity;
  total += wardScore;
  details['立地_区人気度'] = `${property.ward ?? '不明'}(${wardPop}/10) → ${wardScore.toFixed(1)}/${w.wardPopularity}点`;

  // 単身需要 (4点)
  const singleDemand = getWardSingleDemand(property.ward ?? '');
  const singleScore = (singleDemand / 10) * w.singleDemand;
  total += singleScore;
  details['立地_単身需要'] = `${singleDemand}/10 → ${singleScore.toFixed(1)}/${w.singleDemand}点`;

  // 駅乗降者数 (3点): 10万人以上=満点
  const passengers = property.station1?.dailyPassengers ?? 0;
  const passScore = linearScale(passengers, 10_000, 100_000, w.stationPassengers);
  total += passScore;
  details['立地_乗降者数'] = `${passengers.toLocaleString()}人 → ${passScore.toFixed(1)}/${w.stationPassengers}点`;

  // 賃貸需要の底堅さ (4点): 人気区+駅近+単身需要の組み合わせ
  const demandScore = ((wardPop + singleDemand) / 20) * w.rentalDemand;
  total += demandScore;
  details['立地_賃貸需要'] = `${demandScore.toFixed(1)}/${w.rentalDemand}点`;

  return clamp(total, 0, scoringWeights.location.maxPoints);
}

// ─────────────────────────────────────────────
// B. 収益性スコア（15点）
// ─────────────────────────────────────────────
function scoreProfitability(
  property: PropertyCanonical,
  finance: FinanceResult,
  safety: SafetyMarginResult,
  details: Record<string, string>,
): number {
  const w = scoringWeights.profitability.breakdown;
  let total = 0;

  // 表面利回り (4点): 6%=1点, 8%=3点, 10%+=4点
  const grossScore = linearScale(finance.grossYieldPct, 5, 11, w.grossYield);
  total += grossScore;
  details['収益_表面利回り'] = `${finance.grossYieldPct.toFixed(1)}% → ${grossScore.toFixed(1)}/${w.grossYield}点`;

  // 現況利回り (3点)
  if (finance.currentYieldPct !== null) {
    const curScore = linearScale(finance.currentYieldPct, 4, 10, w.currentYield);
    total += curScore;
    details['収益_現況利回り'] = `${finance.currentYieldPct.toFixed(1)}% → ${curScore.toFixed(1)}/${w.currentYield}点`;
  } else {
    details['収益_現況利回り'] = '不明 → 0点';
  }

  // 満室CF (3点): 年間100万円以上で満点
  const cfScore = linearScale(finance.annualFullCfJpy, 0, 2_000_000, w.cashFlow);
  total += cfScore;
  details['収益_満室CF'] = `年${Math.round(finance.annualFullCfJpy / 10000)}万円 → ${cfScore.toFixed(1)}/${w.cashFlow}点`;

  // CCR (2点): 10%以上で満点
  if (finance.ccrPct !== null) {
    const ccrScore = linearScale(finance.ccrPct, 0, 15, w.ccr);
    total += ccrScore;
    details['収益_CCR'] = `${finance.ccrPct.toFixed(1)}% → ${ccrScore.toFixed(1)}/${w.ccr}点`;
  }

  // 安全余力 (3点)
  const safeScore = safety.isSafe ? w.safetyMargin : linearScale(safety.safeMonthlyCfJpy, -100_000, 0, w.safetyMargin * 0.5);
  total += safeScore;
  details['収益_安全余力'] = `月${Math.round(safety.safeMonthlyCfJpy / 1000)}千円 (${safety.isSafe ? '安全' : '要注意'}) → ${safeScore.toFixed(1)}/${w.safetyMargin}点`;

  return clamp(total, 0, scoringWeights.profitability.maxPoints);
}

// ─────────────────────────────────────────────
// C. 融資・買い進め適性スコア（15点）
// ─────────────────────────────────────────────
function scoreFinancing(
  property: PropertyCanonical,
  valuation: ValuationResult,
  details: Record<string, string>,
): number {
  const w = scoringWeights.financing.breakdown;
  let total = 0;

  // 積算比率 (4点): 70%=2点, 100%+=4点
  if (valuation.valuationRatioPct !== null) {
    const valScore = linearScale(valuation.valuationRatioPct, 40, 110, w.valuationRatio);
    total += valScore;
    details['融資_積算比率'] = `${valuation.valuationRatioPct.toFixed(0)}% → ${valScore.toFixed(1)}/${w.valuationRatio}点`;
  } else {
    details['融資_積算比率'] = '算出不可 → 0点';
  }

  // 土地値比率 (3点): 70%以上で満点
  if (valuation.landValuationJpy !== null) {
    const landRatio = (valuation.landValuationJpy / property.propertyPriceJpy) * 100;
    const landScore = linearScale(landRatio, 30, 80, w.landValueRatio);
    total += landScore;
    details['融資_土地値比率'] = `${landRatio.toFixed(0)}% → ${landScore.toFixed(1)}/${w.landValueRatio}点`;
  } else {
    details['融資_土地値比率'] = '路線価不明 → 0点';
  }

  // 再建築可否 (3点)
  if (property.reBuildable === true) {
    total += w.reBuildable;
    details['融資_再建築'] = `可 → ${w.reBuildable}/${w.reBuildable}点`;
  } else if (property.reBuildable === false) {
    details['融資_再建築'] = '不可 → 0点';
  } else {
    total += w.reBuildable * 0.5; // 不明は半分
    details['融資_再建築'] = `不明 → ${(w.reBuildable * 0.5).toFixed(1)}/${w.reBuildable}点`;
  }

  // 接道 (2点)
  if (property.roadWidth) {
    const roadScore = property.roadWidth >= 4.0 ? w.roadAccess : linearScale(property.roadWidth, 2.0, 4.0, w.roadAccess);
    total += roadScore;
    details['融資_接道'] = `${property.roadWidth}m → ${roadScore.toFixed(1)}/${w.roadAccess}点`;
  } else {
    total += w.roadAccess * 0.3;
    details['融資_接道'] = `不明 → ${(w.roadAccess * 0.3).toFixed(1)}/${w.roadAccess}点`;
  }

  // 価格帯の扱いやすさ (3点): 3000万〜8000万が融資つきやすい
  const price = property.propertyPriceJpy;
  let priceScore: number;
  if (price >= 30_000_000 && price <= 80_000_000) {
    priceScore = w.priceRange;
  } else if (price >= 20_000_000 && price <= 100_000_000) {
    priceScore = w.priceRange * 0.7;
  } else {
    priceScore = w.priceRange * 0.3;
  }
  total += priceScore;
  details['融資_価格帯'] = `${Math.round(price / 10000)}万円 → ${priceScore.toFixed(1)}/${w.priceRange}点`;

  return clamp(total, 0, scoringWeights.financing.maxPoints);
}

// ─────────────────────────────────────────────
// D. リスク耐性スコア（15点）
// ─────────────────────────────────────────────
function scoreRisk(
  property: PropertyCanonical,
  valuation: ValuationResult,
  details: Record<string, string>,
): number {
  const w = scoringWeights.risk.breakdown;
  let total = 0;

  // 築年数 (3点): 新しいほど高い。築5年=3点, 築30年=1点, 築50年=0点
  if (valuation.ageYears !== null) {
    const ageScore = inverseLinearScale(valuation.ageYears, 3, 50, w.buildingAge);
    total += ageScore;
    details['リスク_築年数'] = `築${valuation.ageYears}年 → ${ageScore.toFixed(1)}/${w.buildingAge}点`;
  } else {
    details['リスク_築年数'] = '不明 → 0点';
  }

  // 構造 (2点): RC/SRC=2, S=1.5, W劣=1, W=0.5
  const structScores: Record<string, number> = { 'RC': 2, 'SRC': 2, 'S': 1.5, 'W劣': 1, 'W': 0.5 };
  const structScore = structScores[property.structureType ?? 'W'] ?? 0.5;
  total += Math.min(structScore, w.structure);
  details['リスク_構造'] = `${property.structureType ?? '不明'} → ${Math.min(structScore, w.structure).toFixed(1)}/${w.structure}点`;

  // 空室率 (3点): 満室=3点, 80%=2点, 50%=0点
  const occupancy = property.occupancyRate ?? (property.hasOccupancyInfo ? 80 : 85);
  const vacancyScore = linearScale(occupancy, 50, 100, w.vacancyRate);
  total += vacancyScore;
  details['リスク_空室'] = `入居率${occupancy.toFixed(0)}% → ${vacancyScore.toFixed(1)}/${w.vacancyRate}点`;

  // 法的リスク (3点): 再建築不可等
  let legalScore = w.legalRisk;
  if (property.reBuildable === false) {
    legalScore -= 2;
    details['リスク_法的'] = `再建築不可 → ${Math.max(legalScore, 0).toFixed(1)}/${w.legalRisk}点`;
  } else {
    details['リスク_法的'] = `問題なし → ${legalScore.toFixed(1)}/${w.legalRisk}点`;
  }
  total += Math.max(legalScore, 0);

  // 修繕コスト推定 (2点): 築古RC=修繕高い想定
  let repairScore = w.repairCost;
  if (valuation.ageYears !== null) {
    if (valuation.ageYears > 35) repairScore *= 0.3;
    else if (valuation.ageYears > 25) repairScore *= 0.6;
    else if (valuation.ageYears > 15) repairScore *= 0.8;
  }
  total += repairScore;
  details['リスク_修繕'] = `${repairScore.toFixed(1)}/${w.repairCost}点`;

  // 災害リスク (2点): 簡易判定（将来ハザードAPI連携）
  const hazardScore = w.hazard * 0.7; // デフォルト: 23区平均として70%
  total += hazardScore;
  details['リスク_災害'] = `簡易判定 → ${hazardScore.toFixed(1)}/${w.hazard}点`;

  return clamp(total, 0, scoringWeights.risk.maxPoints);
}

// ─────────────────────────────────────────────
// E. 再生・価値創造スコア（15点）
// ─────────────────────────────────────────────
function scoreValueCreation(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  details: Record<string, string>,
): number {
  const w = scoringWeights.valueCreation.breakdown;
  let total = 0;

  // 家賃増額余地 (3点): 表面と現況の差、空室がある=余地あり
  if (finance.currentYieldPct !== null && finance.grossYieldPct > 0) {
    const gap = finance.grossYieldPct - finance.currentYieldPct;
    const rentScore = linearScale(gap, 0, 3, w.rentIncrease);
    total += rentScore;
    details['創造_家賃増額'] = `利回りギャップ${gap.toFixed(1)}% → ${rentScore.toFixed(1)}/${w.rentIncrease}点`;
  } else {
    total += w.rentIncrease * 0.5; // 不明は半点
    details['創造_家賃増額'] = `情報不足 → ${(w.rentIncrease * 0.5).toFixed(1)}/${w.rentIncrease}点`;
  }

  // 空室改善余地 (3点): 空きがある=改善余地
  const vacancy = property.vacantUnits ?? 0;
  const vacImpScore = vacancy > 0 ? Math.min(vacancy * 1.0, w.vacancyImprovement) : 0;
  total += vacImpScore;
  details['創造_空室改善'] = `${vacancy}戸空き → ${vacImpScore.toFixed(1)}/${w.vacancyImprovement}点`;

  // 外壁/共用部改善余地 (2点): 築年数ベース推定
  const ageYears = valuation.ageYears ?? 20;
  const extScore = ageYears > 15 ? w.exteriorImprovement : w.exteriorImprovement * 0.3;
  total += extScore;
  details['創造_外装改善'] = `築${ageYears}年 → ${extScore.toFixed(1)}/${w.exteriorImprovement}点`;

  // 間取り変更余地 (2点): 木造のほうが変更しやすい
  const struct = property.structureType ?? 'W';
  const layoutScore = (struct === 'W' || struct === 'W劣') ? w.layoutChange : w.layoutChange * 0.5;
  total += layoutScore;
  details['創造_間取り変更'] = `${struct} → ${layoutScore.toFixed(1)}/${w.layoutChange}点`;

  // 2戸ぶち抜き余地 (3点): 戸数が多く、構造が木造/軽量鉄骨なら
  const units = property.totalUnits ?? 0;
  let mergeScore = 0;
  if (units >= 6 && (struct === 'W' || struct === 'W劣' || struct === 'S')) {
    mergeScore = w.mergeUnits;
  } else if (units >= 4) {
    mergeScore = w.mergeUnits * 0.5;
  }
  total += mergeScore;
  details['創造_ぶち抜き'] = `${units}戸/${struct} → ${mergeScore.toFixed(1)}/${w.mergeUnits}点`;

  // オーナー住戸化余地 (2点)
  let ownerScore = 0;
  if (units >= 4) {
    ownerScore = w.ownerUnit * 0.7;
    if (mergeScore > 0) ownerScore = w.ownerUnit; // ぶち抜き可能ならフル
  }
  total += ownerScore;
  details['創造_オーナー住戸'] = `${ownerScore.toFixed(1)}/${w.ownerUnit}点`;

  return clamp(total, 0, scoringWeights.valueCreation.maxPoints);
}

// ─────────────────────────────────────────────
// F. 出口スコア（10点）
// ─────────────────────────────────────────────
function scoreExit(
  property: PropertyCanonical,
  valuation: ValuationResult,
  details: Record<string, string>,
): number {
  const w = scoringWeights.exit.breakdown;
  let total = 0;

  // 将来売れるか (3点): 人気エリア+駅近+再建築可
  const wardPop = getWardPopularity(property.ward ?? '');
  const walk = property.station1?.walkMin ?? 20;
  let marketScore = 0;
  if (wardPop >= 8 && walk <= 10) marketScore = w.futureMarketability;
  else if (wardPop >= 6 && walk <= 15) marketScore = w.futureMarketability * 0.7;
  else marketScore = w.futureMarketability * 0.3;
  if (property.reBuildable === false) marketScore *= 0.5;
  total += marketScore;
  details['出口_売却可能性'] = `${marketScore.toFixed(1)}/${w.futureMarketability}点`;

  // 人気エリアか (2点)
  const areaScore = (wardPop / 10) * w.areaPopularity;
  total += areaScore;
  details['出口_エリア人気'] = `${property.ward ?? '不明'}(${wardPop}/10) → ${areaScore.toFixed(1)}/${w.areaPopularity}点`;

  // 土地値下支え (2点)
  if (valuation.landValuationJpy !== null) {
    const landRatio = (valuation.landValuationJpy / property.propertyPriceJpy) * 100;
    const landSupportScore = linearScale(landRatio, 20, 70, w.landSupport);
    total += landSupportScore;
    details['出口_土地値'] = `${landRatio.toFixed(0)}% → ${landSupportScore.toFixed(1)}/${w.landSupport}点`;
  } else {
    details['出口_土地値'] = '不明 → 0点';
  }

  // 買い手の裾野 (3点): 価格帯と構造
  const price = property.propertyPriceJpy;
  let buyerScore: number;
  if (price <= 50_000_000) buyerScore = w.buyerPool; // 5000万以下は裾野広い
  else if (price <= 80_000_000) buyerScore = w.buyerPool * 0.8;
  else if (price <= 120_000_000) buyerScore = w.buyerPool * 0.5;
  else buyerScore = w.buyerPool * 0.3;
  total += buyerScore;
  details['出口_買い手裾野'] = `${Math.round(price / 10000)}万円 → ${buyerScore.toFixed(1)}/${w.buyerPool}点`;

  return clamp(total, 0, scoringWeights.exit.maxPoints);
}

// ─────────────────────────────────────────────
// G. ビジョン適合スコア（5点）
// ─────────────────────────────────────────────
function scoreVision(
  property: PropertyCanonical,
  details: Record<string, string>,
): number {
  const w = scoringWeights.vision.breakdown;
  let total = 0;
  const units = property.totalUnits ?? 0;
  const struct = property.structureType ?? 'W';

  // 空間転用余地 (2点): 戸数多め+1F店舗可能性
  let spaceScore = 0;
  if (units >= 6) spaceScore = w.spaceConversion;
  else if (units >= 4) spaceScore = w.spaceConversion * 0.5;
  total += spaceScore;
  details['ビジョン_空間転用'] = `${units}戸 → ${spaceScore.toFixed(1)}/${w.spaceConversion}点`;

  // 自宅兼投資 (1点): オーナー住戸化できるか
  const ownerScore = units >= 4 ? w.ownerLiving : 0;
  total += ownerScore;
  details['ビジョン_自宅兼投資'] = `${ownerScore.toFixed(1)}/${w.ownerLiving}点`;

  // ブランド/思想 (1点): 木造や軽量鉄骨でデザイン改変しやすい
  const brandScore = (struct === 'W' || struct === 'W劣' || struct === 'S') ? w.brandPotential : w.brandPotential * 0.5;
  total += brandScore;
  details['ビジョン_ブランド'] = `${struct} → ${brandScore.toFixed(1)}/${w.brandPotential}点`;

  // コミュニティ拠点化 (1点): 戸数+エリア
  const communityScore = units >= 6 ? w.communityHub : w.communityHub * 0.3;
  total += communityScore;
  details['ビジョン_コミュニティ'] = `${communityScore.toFixed(1)}/${w.communityHub}点`;

  return clamp(total, 0, scoringWeights.vision.maxPoints);
}

// ─────────────────────────────────────────────
// 警告フラグ判定
// ─────────────────────────────────────────────
function detectWarnings(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
): WarningFlag[] {
  const flags: WarningFlag[] = [];

  if (property.reBuildable === false) flags.push('non_rebuildable');
  if (property.roadWidth === undefined && property.roadDirection === undefined) flags.push('unknown_road_access');
  if (finance.grossYieldPct > 10 && (property.occupancyRate ?? 100) < 70) flags.push('high_yield_high_vacancy');
  if (property.annualCurrentRentJpy === undefined) flags.push('unknown_current_rent');
  if (!property.hasOccupancyInfo) flags.push('insufficient_rent_roll');
  if (valuation.valuationRatioPct !== null && valuation.valuationRatioPct < 50) flags.push('weak_valuation');
  if (valuation.landValuationJpy !== null && (valuation.landValuationJpy / property.propertyPriceJpy) < 0.3) flags.push('weak_land_value');

  // TODO: 長期掲載判定（firstSeenAt が古い場合）
  // TODO: 事故/告知事項判定（テキストマッチング）

  return flags;
}

// ─────────────────────────────────────────────
// 特別候補判定
// ─────────────────────────────────────────────
function detectSpecialOpportunity(
  property: PropertyCanonical,
  warnings: WarningFlag[],
  scoreTotal: number,
): boolean {
  // 「ワケありだが知識で解ける可能性がある」物件
  const hasRisk = warnings.includes('non_rebuildable') || warnings.includes('high_yield_high_vacancy');
  const hasUpside = scoreTotal >= 60; // ある程度のスコアがある
  return hasRisk && hasUpside;
}

// ─────────────────────────────────────────────
// 買い判定
// ─────────────────────────────────────────────
function judgeBuy(scoreTotal: number): BuyJudgment {
  if (scoreTotal >= 85) return 'strong_buy';
  if (scoreTotal >= 75) return 'buy';
  if (scoreTotal >= 65) return 'review';
  if (scoreTotal >= 50) return 'watch';
  return 'pass';
}

// ─────────────────────────────────────────────
// メインスコアリング関数
// ─────────────────────────────────────────────
export function scoreProperty(
  property: PropertyCanonical,
  finance: FinanceResult,
  valuation: ValuationResult,
  safety: SafetyMarginResult,
): ScoringResult {
  const details: Record<string, string> = {};

  const location = scoreLocation(property, details);
  const profitability = scoreProfitability(property, finance, safety, details);
  const financing = scoreFinancing(property, valuation, details);
  const risk = scoreRisk(property, valuation, details);
  const valueCreation = scoreValueCreation(property, finance, valuation, details);
  const exit = scoreExit(property, valuation, details);
  const vision = scoreVision(property, details);
  const total = location + profitability + financing + risk + valueCreation + exit + vision;

  const scores: ScoreBreakdown = {
    location,
    profitability,
    financing,
    risk,
    valueCreation,
    exit,
    vision,
    total,
  };

  const warningFlags = detectWarnings(property, finance, valuation);
  const buyJudgment = judgeBuy(total);
  const specialOpportunityFlag = detectSpecialOpportunity(property, warningFlags, total);

  // 説明文は explain.ts に委譲（ここでは概要のみ）
  const explanation = `総合${total.toFixed(0)}点 — ${buyJudgmentLabel(buyJudgment)}`;

  return {
    scores,
    buyJudgment,
    warningFlags,
    specialOpportunityFlag,
    explanation,
    scoringDetails: details,
  };
}

export function buyJudgmentLabel(judgment: BuyJudgment): string {
  const labels: Record<BuyJudgment, string> = {
    strong_buy: '強い買い候補',
    buy: '買い候補',
    review: '要精査',
    watch: '観察',
    pass: '見送り',
  };
  return labels[judgment];
}
