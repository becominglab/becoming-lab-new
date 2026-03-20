import { z } from 'zod';

/** 構造タイプ */
export const StructureType = z.enum(['RC', 'SRC', 'S', 'W', 'W劣']);
export type StructureType = z.infer<typeof StructureType>;

/** 買い判定 */
export const BuyJudgment = z.enum(['strong_buy', 'buy', 'review', 'watch', 'pass']);
export type BuyJudgment = z.infer<typeof BuyJudgment>;

/** 警告フラグ */
export const WarningFlag = z.enum([
  'non_rebuildable',        // 再建築不可
  'unknown_road_access',    // 接道不明
  'high_yield_high_vacancy',// 利回り高いが空室多い
  'unknown_current_rent',   // 現況家賃不明
  'unknown_repair_history', // 修繕履歴不明
  'weak_valuation',         // 積算弱い
  'weak_land_value',        // 土地値弱い
  'long_listed',            // 長期掲載疑い
  'incident_suspected',     // 事故/告知事項疑い
  'insufficient_rent_roll', // レントロール不足
  'low_improvement_potential', // 改善余地薄い
]);
export type WarningFlag = z.infer<typeof WarningFlag>;

/** 駅アクセス */
export const StationAccessSchema = z.object({
  line: z.string().optional(),
  name: z.string().optional(),
  walkMin: z.number().optional(),
  dailyPassengers: z.number().optional(),
});
export type StationAccess = z.infer<typeof StationAccessSchema>;

/** 正規化済み物件スキーマ（Zodバリデーション用） */
export const PropertyCanonicalSchema = z.object({
  // 識別
  canonicalId: z.string(),

  // 物件情報
  propertyName: z.string().optional(),
  prefecture: z.string().default('東京都'),
  ward: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),

  // 建物
  structureType: StructureType.optional(),
  builtYear: z.number().int().optional(),
  builtMonth: z.number().int().min(1).max(12).optional(),
  landAreaSqm: z.number().positive().optional(),
  buildingAreaSqm: z.number().positive().optional(),
  frontageM: z.number().positive().optional(),
  totalFloors: z.number().int().positive().optional(),
  totalUnits: z.number().int().positive().optional(),
  roomBreakdown: z.string().optional(),
  occupiedUnits: z.number().int().min(0).optional(),
  vacantUnits: z.number().int().min(0).optional(),
  occupancyRate: z.number().min(0).max(100).optional(),

  // アクセス
  station1: StationAccessSchema.optional(),
  station2: StationAccessSchema.optional(),
  station3: StationAccessSchema.optional(),
  urbanPopulation: z.number().int().positive().optional(),

  // 価格・収入
  propertyPriceJpy: z.number().positive(),
  annualFullRentJpy: z.number().positive().optional(),
  annualCurrentRentJpy: z.number().positive().optional(),
  expenseRatioPct: z.number().default(16.0),

  // 資金調達
  selfFundingJpy: z.number().positive().optional(),
  loanInterestPct: z.number().default(1.5),
  loanYears: z.number().int().default(30),

  // 土地・法規
  roadValueJpyPerSqm: z.number().optional(),
  reBuildable: z.boolean().optional(),
  zoning: z.string().optional(),
  coverageRatio: z.number().optional(),
  floorAreaRatio: z.number().optional(),
  landRightType: z.string().optional(),
  roadDirection: z.string().optional(),
  roadWidth: z.number().optional(),

  // その他
  brokerName: z.string().optional(),
  hasOccupancyInfo: z.boolean().default(false),
  hasRouteValue: z.boolean().default(false),
  hasTaxInfo: z.boolean().default(false),
  memo: z.string().optional(),

  imageUrl: z.string().optional(),

  // ソース情報
  sourceSite: z.string(),
  sourceUrl: z.string(),
  listingId: z.string(),
  listingPublishedAt: z.date().optional(),
});
export type PropertyCanonical = z.infer<typeof PropertyCanonicalSchema>;

/** 収支計算結果 */
export interface FinanceResult {
  grossYieldPct: number;
  currentYieldPct: number | null;
  annualExpenseJpy: number;
  annualLoanPaymentJpy: number;
  monthlyLoanPaymentJpy: number;
  annualFullCfJpy: number;
  annualCurrentCfJpy: number | null;
  monthlyFullCfJpy: number;
  monthlyCurrentCfJpy: number | null;
  fullCfPct: number;
  currentCfPct: number | null;
  ccrPct: number | null;
  loanRepaymentRatioPct: number;
  borrowAmount: number;
}

/** 積算評価結果 */
export interface ValuationResult {
  landValuationJpy: number | null;
  buildingValuationJpy: number | null;
  totalValuationJpy: number | null;
  valuationRatioPct: number | null;
  durableYears: number | null;
  ageYears: number | null;
  remainingYears: number | null;
}

/** 安全余力結果 */
export interface SafetyMarginResult {
  safeMonthlyRentJpy: number;
  safeMonthlyExpenseJpy: number;
  safeMonthlyLoanJpy: number;
  safeMonthlyCfJpy: number;
  isSafe: boolean;
}

/** 感度分析1行 */
export interface SensitivityRow {
  parameterName: 'price' | 'interest' | 'years' | 'self_funding';
  deltaValue: number;
  resultCfJpy: number;
  resultYieldPct: number;
  resultCcrPct: number | null;
}

/** スコア内訳 */
export interface ScoreBreakdown {
  location: number;       // A: 25点
  profitability: number;  // B: 15点
  financing: number;      // C: 15点
  risk: number;           // D: 15点
  valueCreation: number;  // E: 15点
  exit: number;           // F: 10点
  vision: number;         // G: 5点
  total: number;          // 100点
}

/** スコアリング結果 */
export interface ScoringResult {
  scores: ScoreBreakdown;
  buyJudgment: BuyJudgment;
  warningFlags: WarningFlag[];
  specialOpportunityFlag: boolean;
  explanation: string;
  scoringDetails: Record<string, string>; // 各項目の採点根拠
}

/** ランキングエントリ */
export interface RankingEntry {
  rank: number;
  canonicalId: string;
  propertyName: string;
  ward: string;
  scoreTotal: number;
  buyJudgment: BuyJudgment;
  explanation: string;
  isNewEntry: boolean;
  rankChange: number | null;
  priceChange: number | null;
  finance: FinanceResult;
  valuation: ValuationResult;
  property: PropertyCanonical;
}
