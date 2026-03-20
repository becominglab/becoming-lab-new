"use client";

import { useEffect, useState } from "react";

/* ========== Types ========== */
interface StationAccess {
  line?: string;
  name?: string;
  walkMin?: number;
  dailyPassengers?: number;
}

interface PropertyInfo {
  address?: string;
  structureType?: string;
  builtYear?: number;
  builtMonth?: number;
  landAreaSqm?: number;
  buildingAreaSqm?: number;
  totalFloors?: number;
  totalUnits?: number;
  roomBreakdown?: string;
  occupiedUnits?: number;
  vacantUnits?: number;
  occupancyRate?: number;
  reBuildable?: boolean;
  roadDirection?: string;
  roadWidth?: number;
  brokerName?: string;
  imageUrl?: string;
  sourceSite: string;
  sourceUrl: string;
  price: number;
  annualFullRentJpy?: number;
  annualCurrentRentJpy?: number;
  selfFundingJpy?: number;
  loanInterestPct: number;
  loanYears: number;
  roadValueJpyPerSqm?: number;
  station1?: StationAccess;
  station2?: StationAccess;
  station3?: StationAccess;
}

interface FinanceData {
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

interface ValuationData {
  landValuationJpy: number | null;
  buildingValuationJpy: number | null;
  totalValuationJpy: number | null;
  valuationRatioPct: number | null;
  durableYears: number | null;
  ageYears: number | null;
  remainingYears: number | null;
}

interface SafetyData {
  safeMonthlyRentJpy: number;
  safeMonthlyExpenseJpy: number;
  safeMonthlyLoanJpy: number;
  safeMonthlyCfJpy: number;
  isSafe: boolean;
}

interface ScoreBreakdown {
  location: number;
  profitability: number;
  financing: number;
  risk: number;
  valueCreation: number;
  exit: number;
  vision: number;
  total: number;
}

interface SensitivityRow {
  parameterName: string;
  deltaValue: number;
  resultCfJpy: number;
  resultYieldPct: number;
  resultCcrPct: number | null;
}

interface RankingItem {
  rank: number;
  canonicalId: string;
  propertyName: string;
  ward: string;
  scoreTotal: number;
  buyJudgment: string;
  isNewEntry: boolean;
  rankChange: number | null;
  priceChange: number | null;
  property: PropertyInfo;
  finance: FinanceData;
  valuation: ValuationData;
  safety: SafetyData;
  scores: ScoreBreakdown;
  warningFlags: string[];
  specialOpportunityFlag: boolean;
  scoringDetails: Record<string, string>;
  sensitivity: SensitivityRow[];
  explanation: string;
}

interface ReportData {
  date: string;
  generatedAt: string;
  count: number;
  rankings: RankingItem[];
}

/* ========== Helpers ========== */
const TEAL = "#1B6B7A";
const TEAL_LIGHT = "#e8f4f6";
const NAVY = "#1a1a2e";

function formatJpy(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) return `${(amount / 100_000_000).toFixed(2)}億円`;
  return `${Math.round(amount / 10_000).toLocaleString()}万円`;
}

function formatJpyFull(amount: number): string {
  return `${amount.toLocaleString()}円`;
}

function judgmentLabel(j: string): string {
  return { strong_buy: "強い買い", buy: "買い", review: "要精査", watch: "様子見", pass: "見送り" }[j] ?? j;
}

function judgmentStyle(j: string): string {
  return {
    strong_buy: "bg-emerald-600 text-white",
    buy: "bg-[#1B6B7A] text-white",
    review: "bg-yellow-500 text-white",
    watch: "bg-orange-400 text-white",
    pass: "bg-gray-400 text-white",
  }[j] ?? "bg-gray-400 text-white";
}

function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 75) return "text-[#1B6B7A]";
  if (score >= 65) return "text-yellow-600";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function warningLabel(flag: string): string {
  const labels: Record<string, string> = {
    non_rebuildable: "再建築不可",
    unknown_road_access: "接道不明",
    high_yield_high_vacancy: "高利回り・高空室",
    unknown_current_rent: "現況家賃不明",
    unknown_repair_history: "修繕履歴不明",
    weak_valuation: "積算評価低",
    weak_land_value: "土地値低",
    long_listed: "長期掲載",
    incident_suspected: "事故物件疑い",
    insufficient_rent_roll: "レントロール不足",
    low_improvement_potential: "改善余地少",
  };
  return labels[flag] ?? flag;
}

/* ========== Score Bar Component ========== */
function ScoreAxis({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 text-xs text-gray-500 text-right shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: TEAL }}
        />
      </div>
      <span className="w-14 text-xs text-gray-700 text-right shrink-0">
        {score.toFixed(1)}/{max}
      </span>
    </div>
  );
}

/* ========== Section Header ========== */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-gray-700 border-b border-gray-200 pb-1 mb-3" style={{ borderColor: TEAL }}>
      {children}
    </h3>
  );
}

/* ========== PMT計算（元利均等） ========== */
function calcPMT(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper;
  const r = rate / 12;
  const n = nper * 12;
  return (pv * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) * 12;
}

/* ========== Detail View ========== */
function PropertyDetail({ item, onBack }: { item: RankingItem; onBack: () => void }) {
  const p = item.property;
  const v = item.valuation;
  const s = item.safety;
  const sc = item.scores;

  // --- インタラクティブ入力 ---
  const [loanYears, setLoanYears] = useState(p.loanYears);
  const [interestPct, setInterestPct] = useState(p.loanInterestPct);
  const [brokeragePct, setBrokeragePct] = useState(3.0);

  // --- リアルタイム再計算 ---
  const initialCostsJpy = Math.round(p.price * (brokeragePct / 100));
  const selfFundingJpy = p.selfFundingJpy ?? 15_000_000;
  const totalInvestment = selfFundingJpy + initialCostsJpy;
  const borrowAmount = p.price - selfFundingJpy;
  const annualLoanPayment = borrowAmount > 0 ? calcPMT(interestPct / 100, loanYears, borrowAmount) : 0;
  const monthlyLoanPayment = annualLoanPayment / 12;
  const annualFullRent = p.annualFullRentJpy ?? 0;
  const annualExpense = annualFullRent * ((p.selfFundingJpy ? 16 : 16) / 100);
  const annualFullCf = annualFullRent - annualExpense - annualLoanPayment;
  const monthlyFullCf = annualFullCf / 12;
  const grossYieldPct = p.price > 0 && annualFullRent > 0 ? (annualFullRent / p.price) * 100 : 0;
  const ccrPct = totalInvestment > 0 ? (annualFullCf / totalInvestment) * 100 : null;
  const loanRepaymentRatioPct = annualFullRent > 0 ? (annualLoanPayment / annualFullRent) * 100 : 0;

  const annualCurrentRent = p.annualCurrentRentJpy ?? null;
  const annualCurrentCf = annualCurrentRent != null ? annualCurrentRent - annualExpense - annualLoanPayment : null;
  const currentYieldPct = annualCurrentRent != null && p.price > 0 ? (annualCurrentRent / p.price) * 100 : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-sm mb-6 hover:opacity-70 cursor-pointer"
        style={{ color: TEAL }}
      >
        ← 一覧に戻る
      </button>

      {/* Title */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold" style={{ color: TEAL }}>#{item.rank}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${judgmentStyle(item.buyJudgment)}`}>
              {judgmentLabel(item.buyJudgment)}
            </span>
            {item.isNewEntry && <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: TEAL }}>NEW</span>}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY }}>{item.propertyName}</h1>
          <p className="text-sm text-gray-500 mt-1">{p.address ?? item.ward}</p>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-4xl font-bold ${scoreColor(item.scoreTotal)}`}>{item.scoreTotal.toFixed(0)}</div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>

      {/* 物件画像 */}
      {p.imageUrl && (
        <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-4 bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.imageUrl}
            alt={item.propertyName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ソース元リンク */}
      <a
        href={p.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 px-3 py-1.5 rounded-lg border hover:opacity-80 transition-opacity"
        style={{ color: TEAL, borderColor: TEAL }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        {p.sourceSite === "rakumachi" ? "楽待" : p.sourceSite}で実物件を確認 →
      </a>

      {/* 物件概要 */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>物件概要</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <InfoCell label="価格" value={formatJpy(p.price)} />
          <InfoCell label="構造" value={p.structureType ?? "—"} />
          <InfoCell label="築年" value={p.builtYear ? `${p.builtYear}年${p.builtMonth ? `${p.builtMonth}月` : ""}` : "—"} />
          <InfoCell label="築年数" value={v.ageYears != null ? `${v.ageYears}年` : "—"} />
          <InfoCell label="土地面積" value={p.landAreaSqm ? `${p.landAreaSqm}㎡` : "—"} />
          <InfoCell label="建物面積" value={p.buildingAreaSqm ? `${p.buildingAreaSqm}㎡` : "—"} />
          <InfoCell label="階数" value={p.totalFloors ? `${p.totalFloors}階` : "—"} />
          <InfoCell label="総戸数" value={p.totalUnits ? `${p.totalUnits}戸` : "—"} />
          <InfoCell label="間取り" value={p.roomBreakdown ?? "—"} />
          <InfoCell label="入居戸数" value={p.occupiedUnits != null ? `${p.occupiedUnits}戸` : "—"} />
          <InfoCell label="空室" value={p.vacantUnits != null ? `${p.vacantUnits}戸` : "—"} />
          <InfoCell label="入居率" value={p.occupancyRate != null ? `${p.occupancyRate.toFixed(0)}%` : "—"} />
          <InfoCell label="再建築" value={p.reBuildable === true ? "可" : p.reBuildable === false ? "不可" : "不明"} />
          <InfoCell label="接道" value={p.roadWidth ? `${p.roadDirection ?? ""}${p.roadWidth}m` : "—"} />
          <InfoCell label="路線価" value={p.roadValueJpyPerSqm ? `${p.roadValueJpyPerSqm.toLocaleString()}円/㎡` : "—"} />
          <InfoCell label="仲介" value={p.brokerName ?? "—"} />
        </div>

        {/* 駅アクセス */}
        <div className="mt-4 space-y-1">
          {p.station1?.name && (
            <div className="text-xs text-gray-600">
              {p.station1.line && `${p.station1.line} `}{p.station1.name}駅 徒歩{p.station1.walkMin ?? "?"}分
              {p.station1.dailyPassengers && ` (乗降${(p.station1.dailyPassengers / 10000).toFixed(1)}万人/日)`}
            </div>
          )}
          {p.station2?.name && (
            <div className="text-xs text-gray-600">
              {p.station2.line && `${p.station2.line} `}{p.station2.name}駅 徒歩{p.station2.walkMin ?? "?"}分
            </div>
          )}
          {p.station3?.name && (
            <div className="text-xs text-gray-600">
              {p.station3.line && `${p.station3.line} `}{p.station3.name}駅 徒歩{p.station3.walkMin ?? "?"}分
            </div>
          )}
        </div>
      </section>

      {/* 7軸スコア */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>7軸スコアリング</SectionTitle>
        <div className="space-y-2">
          <ScoreAxis label="A. 立地・需要" score={sc.location} max={25} />
          <ScoreAxis label="B. 収益性" score={sc.profitability} max={15} />
          <ScoreAxis label="C. 融資適性" score={sc.financing} max={15} />
          <ScoreAxis label="D. リスク耐性" score={sc.risk} max={15} />
          <ScoreAxis label="E. 価値創造" score={sc.valueCreation} max={15} />
          <ScoreAxis label="F. 出口" score={sc.exit} max={10} />
          <ScoreAxis label="G. ビジョン" score={sc.vision} max={5} />
        </div>

        {/* スコアリング詳細 */}
        <details className="mt-4">
          <summary className="text-xs cursor-pointer" style={{ color: TEAL }}>採点根拠を見る</summary>
          <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-0.5 max-h-60 overflow-y-auto">
            {Object.entries(item.scoringDetails).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-2">
                <span className="text-gray-500">{key}</span>
                <span className="text-gray-700 text-right">{val}</span>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* 収支シミュレーション（インタラクティブ） */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>収支シミュレーション</SectionTitle>

        {/* 調整パネル */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
          <div className="text-xs font-medium text-gray-500 mb-2">条件を変更してシミュレーション</div>

          {/* 借入年数 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">借入年数</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={45}
                  value={loanYears}
                  onChange={(e) => setLoanYears(Math.max(1, Math.min(45, Number(e.target.value) || 1)))}
                  className="w-14 text-sm text-right font-medium border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#1B6B7A]"
                />
                <span className="text-xs text-gray-500">年</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={45}
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: TEAL }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>1年</span><span>15年</span><span>30年</span><span>45年</span>
            </div>
          </div>

          {/* 金利 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">金利</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={interestPct}
                  onChange={(e) => setInterestPct(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
                  className="w-16 text-sm text-right font-medium border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#1B6B7A]"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={interestPct}
              onChange={(e) => setInterestPct(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: TEAL }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>0%</span><span>2.5%</span><span>5%</span><span>7.5%</span><span>10%</span>
            </div>
          </div>

          {/* 仲介手数料 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">初期費用（仲介手数料）</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={brokeragePct}
                  onChange={(e) => setBrokeragePct(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
                  className="w-16 text-sm text-right font-medium border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#1B6B7A]"
                />
                <span className="text-xs text-gray-500">%</span>
                <span className="text-xs text-gray-400 ml-1">= {formatJpy(initialCostsJpy)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 計算結果 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InfoCell label="表面利回り" value={`${grossYieldPct.toFixed(2)}%`} />
          <InfoCell label="現況利回り" value={currentYieldPct != null ? `${currentYieldPct.toFixed(2)}%` : "—"} />
          <InfoCell label="満室年間家賃" value={annualFullRent > 0 ? formatJpy(annualFullRent) : "—"} />
          <InfoCell label="現況年間家賃" value={annualCurrentRent != null ? formatJpy(annualCurrentRent) : "—"} />
          <InfoCell label="年間経費" value={formatJpy(annualExpense)} />
          <InfoCell label="借入額" value={formatJpy(borrowAmount)} />
          <InfoCell label="年間返済額" value={formatJpy(annualLoanPayment)} />
          <InfoCell label="月額返済" value={formatJpy(monthlyLoanPayment)} />
          <InfoCell label="返済比率" value={`${loanRepaymentRatioPct.toFixed(1)}%`} />
          <InfoCell label="自己資金" value={formatJpy(selfFundingJpy)} />
          <InfoCell label="初期費用" value={formatJpy(initialCostsJpy)} />
          <InfoCell label="総投資額" value={formatJpy(totalInvestment)} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
          <HighlightCell label="満室CF（年）" value={formatJpy(annualFullCf)} warn={annualFullCf < 0} />
          <HighlightCell label="満室CF（月）" value={formatJpy(monthlyFullCf)} warn={monthlyFullCf < 0} />
          <HighlightCell label="現況CF（年）" value={annualCurrentCf != null ? formatJpy(annualCurrentCf) : "—"} warn={annualCurrentCf != null && annualCurrentCf < 0} />
          <HighlightCell label="CCR" value={ccrPct != null ? `${ccrPct.toFixed(1)}%` : "—"} />
        </div>
      </section>

      {/* 積算評価 */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>積算評価</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCell label="土地評価額" value={v.landValuationJpy != null ? formatJpy(v.landValuationJpy) : "—"} />
          <InfoCell label="建物評価額" value={v.buildingValuationJpy != null ? formatJpy(v.buildingValuationJpy) : "—"} />
          <InfoCell label="積算合計" value={v.totalValuationJpy != null ? formatJpy(v.totalValuationJpy) : "—"} />
          <HighlightCell label="積算比率" value={v.valuationRatioPct != null ? `${v.valuationRatioPct.toFixed(0)}%` : "—"} />
          <InfoCell label="法定耐用年数" value={v.durableYears != null ? `${v.durableYears}年` : "—"} />
          <InfoCell label="経過年数" value={v.ageYears != null ? `${v.ageYears}年` : "—"} />
          <InfoCell label="残存年数" value={v.remainingYears != null ? `${v.remainingYears}年` : "—"} />
        </div>
      </section>

      {/* 安全余力 */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>安全余力テスト（金利5%・家賃80%・空室10%）</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCell label="ストレス家賃/月" value={formatJpy(s.safeMonthlyRentJpy)} />
          <InfoCell label="経費/月" value={formatJpy(s.safeMonthlyExpenseJpy)} />
          <InfoCell label="返済/月" value={formatJpy(s.safeMonthlyLoanJpy)} />
          <HighlightCell
            label="安全余力CF/月"
            value={formatJpy(s.safeMonthlyCfJpy)}
            warn={!s.isSafe}
          />
        </div>
        <div className="mt-3">
          {s.isSafe ? (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">安全 — ストレス条件でもCF黒字維持</span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">要注意 — ストレス条件でCF赤字</span>
          )}
        </div>
      </section>

      {/* 感度分析 */}
      {item.sensitivity.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <SectionTitle>感度分析</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-1.5 pr-3">パラメータ</th>
                  <th className="text-right py-1.5 px-2">変動</th>
                  <th className="text-right py-1.5 px-2">CF（年）</th>
                  <th className="text-right py-1.5 px-2">利回り</th>
                  <th className="text-right py-1.5 pl-2">CCR</th>
                </tr>
              </thead>
              <tbody>
                {item.sensitivity.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 pr-3 text-gray-600">{sensitivityParamLabel(row.parameterName)}</td>
                    <td className="py-1.5 px-2 text-right">{sensitivityDelta(row)}</td>
                    <td className={`py-1.5 px-2 text-right ${row.resultCfJpy < 0 ? "text-red-500" : "text-gray-700"}`}>
                      {formatJpy(row.resultCfJpy)}
                    </td>
                    <td className="py-1.5 px-2 text-right text-gray-700">{row.resultYieldPct.toFixed(2)}%</td>
                    <td className="py-1.5 pl-2 text-right text-gray-700">{row.resultCcrPct != null ? `${row.resultCcrPct.toFixed(1)}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 警告フラグ */}
      {item.warningFlags.length > 0 && (
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
          <SectionTitle>警告フラグ</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {item.warningFlags.map((flag) => (
              <span key={flag} className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                {warningLabel(flag)}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 説明文 */}
      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm">
        <SectionTitle>総合評価</SectionTitle>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{item.explanation}</pre>
      </section>

      {/* 元サイトリンク */}
      <div className="text-center mt-6">
        <a
          href={p.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-medium hover:opacity-90"
          style={{ backgroundColor: TEAL }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          {p.sourceSite === "rakumachi" ? "楽待" : p.sourceSite}で実物件を確認する →
        </a>
        <p className="text-xs text-gray-400 mt-2">掲載元のサイトで最新情報・詳細写真を確認できます</p>
      </div>
    </div>
  );
}

function sensitivityParamLabel(name: string): string {
  return { price: "物件価格", interest: "金利", years: "返済年数", self_funding: "自己資金" }[name] ?? name;
}

function sensitivityDelta(row: SensitivityRow): string {
  const sign = row.deltaValue > 0 ? "+" : "";
  if (row.parameterName === "price") return `${sign}${Math.round(row.deltaValue / 10000)}万円`;
  if (row.parameterName === "interest") return `${sign}${row.deltaValue}%`;
  if (row.parameterName === "years") return `${sign}${row.deltaValue}年`;
  if (row.parameterName === "self_funding") return `${sign}${Math.round(row.deltaValue / 10000)}万円`;
  return String(row.deltaValue);
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2 bg-gray-50">
      <div className="text-[10px] text-gray-400 tracking-wide">{label}</div>
      <div className="text-sm font-medium text-gray-800 mt-0.5">{value}</div>
    </div>
  );
}

function HighlightCell({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg px-3 py-2" style={{ backgroundColor: warn ? "#fef2f2" : TEAL_LIGHT }}>
      <div className="text-[10px] text-gray-500 tracking-wide">{label}</div>
      <div className={`text-sm font-bold mt-0.5 ${warn ? "text-red-600" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

/* ========== List Card ========== */
function PropertyCard({ item, onSelect }: { item: RankingItem; onSelect: () => void }) {
  const hasImage = !!item.property.imageUrl;
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* 物件画像 */}
      {hasImage && (
        <div className="w-full h-44 sm:h-52 bg-gray-100 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.property.imageUrl}
            alt={item.propertyName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="text-sm font-bold px-2 py-0.5 rounded-md bg-white/90 shadow-sm" style={{ color: TEAL }}>#{item.rank}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full shadow-sm ${judgmentStyle(item.buyJudgment)}`}>
              {judgmentLabel(item.buyJudgment)}
            </span>
            {item.isNewEntry && <span className="text-xs px-1.5 py-0.5 rounded text-white shadow-sm" style={{ backgroundColor: TEAL }}>NEW</span>}
          </div>
          <div className="absolute top-2 right-2">
            <div className={`text-2xl font-bold px-2 py-0.5 rounded-md bg-white/90 shadow-sm ${scoreColor(item.scoreTotal)}`}>{item.scoreTotal.toFixed(0)}<span className="text-[10px] text-gray-400">/100</span></div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* 画像がない場合のヘッダー */}
        {!hasImage && (
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold" style={{ color: TEAL }}>#{item.rank}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${judgmentStyle(item.buyJudgment)}`}>
                  {judgmentLabel(item.buyJudgment)}
                </span>
                {item.isNewEntry && <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: TEAL }}>NEW</span>}
                {item.rankChange != null && item.rankChange > 0 && <span className="text-xs text-emerald-600 font-medium">↑{item.rankChange}</span>}
                {item.rankChange != null && item.rankChange < 0 && <span className="text-xs text-red-500 font-medium">↓{Math.abs(item.rankChange)}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-3xl font-bold ${scoreColor(item.scoreTotal)}`}>{item.scoreTotal.toFixed(0)}</div>
              <div className="text-xs text-gray-400">/ 100</div>
            </div>
          </div>
        )}

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{item.propertyName}</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          {item.ward}
          {item.property.station1?.name && ` / ${item.property.station1.name}駅`}
          {item.property.station1?.walkMin != null && ` 徒歩${item.property.station1.walkMin}分`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: TEAL_LIGHT }}>
            <div className="text-[10px] text-gray-500">価格</div>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">{formatJpy(item.property.price)}</div>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: TEAL_LIGHT }}>
            <div className="text-[10px] text-gray-500">表面利回り</div>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.finance.grossYieldPct.toFixed(1)}%</div>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: TEAL_LIGHT }}>
            <div className="text-[10px] text-gray-500">満室CF</div>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">{formatJpy(item.finance.annualFullCfJpy)}<span className="text-xs text-gray-400">/年</span></div>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ backgroundColor: TEAL_LIGHT }}>
            <div className="text-[10px] text-gray-500">CCR</div>
            <div className="text-sm font-semibold text-gray-900 mt-0.5">{item.finance.ccrPct != null ? `${item.finance.ccrPct.toFixed(1)}%` : "—"}</div>
          </div>
        </div>

        <div className="mt-3 text-xs text-right" style={{ color: TEAL }}>
          詳細を見る →
        </div>
      </div>
    </button>
  );
}

/* ========== Main Page ========== */
export default function ScreeningPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/s/inv-a8f3e1d9/screening-data.json")
      .then((res) => {
        if (!res.ok) throw new Error("データを取得できませんでした");
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: TEAL, borderTopColor: "transparent" }} />
          <p className="text-gray-400 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">データ未生成</h2>
          <p className="text-sm text-gray-500">{error ?? "スクリーニングレポートがまだ生成されていません。"}</p>
        </div>
      </div>
    );
  }

  const selectedItem = selectedId ? data.rankings.find((r) => r.canonicalId === selectedId) : null;

  if (selectedItem) {
    return (
      <PropertyDetail
        item={selectedItem}
        onBack={() => {
          setSelectedId(null);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  const generatedAt = new Date(data.generatedAt);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: NAVY }}>
          買い推奨ベスト{data.count}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          東京23区 1棟投資物件 | {data.date} 更新
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          生成: {generatedAt.toLocaleString("ja-JP")}
        </p>
        {data.rankings.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.rankings.filter((r) => r.isNewEntry).length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: TEAL }}>
                新着 {data.rankings.filter((r) => r.isNewEntry).length}件
              </span>
            )}
            {data.rankings.filter((r) => r.priceChange != null && r.priceChange < 0).length > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                値下げ {data.rankings.filter((r) => r.priceChange != null && r.priceChange < 0).length}件
              </span>
            )}
          </div>
        )}
      </header>

      <div className="space-y-3">
        {data.rankings.map((item) => (
          <PropertyCard
            key={item.canonicalId}
            item={item}
            onSelect={() => {
              setSelectedId(item.canonicalId);
              window.scrollTo(0, 0);
            }}
          />
        ))}
      </div>

      <footer className="mt-12 text-center text-xs text-gray-400">
        <p>マスター投資家メソッド 7軸100点スコアリング</p>
        <p className="mt-1">本データは投資助言ではありません。投資判断は自己責任で行ってください。</p>
      </footer>
    </div>
  );
}
