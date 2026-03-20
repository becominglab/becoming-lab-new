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
const ACCENT = "#0d9488";

function formatJpy(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) return `${(amount / 100_000_000).toFixed(2)}億円`;
  return `${Math.round(amount / 10_000).toLocaleString()}万円`;
}

function judgmentLabel(j: string): string {
  return { strong_buy: "強い買い", buy: "買い", review: "要精査", watch: "様子見", pass: "見送り" }[j] ?? j;
}

function judgmentStyle(j: string): string {
  return {
    strong_buy: "bg-emerald-600 text-white",
    buy: "bg-[#1B6B7A] text-white",
    review: "bg-amber-500 text-white",
    watch: "bg-orange-400 text-white",
    pass: "bg-gray-400 text-white",
  }[j] ?? "bg-gray-400 text-white";
}

function scoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 75) return "text-[#1B6B7A]";
  if (score >= 65) return "text-amber-600";
  if (score >= 50) return "text-orange-500";
  return "text-red-500";
}

function scoreBgColor(score: number): string {
  if (score >= 85) return "from-emerald-500 to-emerald-600";
  if (score >= 75) return "from-teal-500 to-teal-600";
  if (score >= 65) return "from-amber-500 to-amber-600";
  if (score >= 50) return "from-orange-500 to-orange-600";
  return "from-red-500 to-red-600";
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
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs text-gray-500 text-right shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT}, ${TEAL})` }}
        />
      </div>
      <span className="w-16 text-xs font-medium text-gray-600 text-right shrink-0">
        {score.toFixed(1)}<span className="text-gray-400">/{max}</span>
      </span>
    </div>
  );
}

/* ========== Section Header ========== */
function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 pb-2 mb-4 border-b-2" style={{ borderColor: TEAL }}>
      {icon && <span className="text-base">{icon}</span>}
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

/* ========== Change Indicator Badge ========== */
function ChangeBadge({ changed, onReset }: { changed: boolean; onReset: () => void }) {
  if (!changed) return null;
  return (
    <span className="inline-flex items-center gap-1 ml-2">
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        変更済み
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onReset(); }}
        className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer underline"
        type="button"
      >
        戻す
      </button>
    </span>
  );
}

/* ========== Simulation Input Row ========== */
function SimInput({
  label,
  value,
  defaultValue,
  onChange,
  onReset,
  min,
  max,
  step,
  unit,
  extra,
  showSlider = true,
  sliderLabels,
}: {
  label: string;
  value: number;
  defaultValue: number;
  onChange: (v: number) => void;
  onReset: () => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  extra?: React.ReactNode;
  showSlider?: boolean;
  sliderLabels?: string[];
}) {
  const changed = value !== defaultValue;
  return (
    <div className={`rounded-xl p-4 transition-all duration-200 ${changed ? "bg-amber-50 border border-amber-200 ring-1 ring-amber-100" : "bg-gray-50 border border-gray-100"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <label className="text-xs font-medium text-gray-700">{label}</label>
          <ChangeBadge changed={changed} onReset={onReset} />
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
            className={`w-20 text-sm text-right font-semibold rounded-lg px-2 py-1 focus:outline-none focus:ring-2 transition-colors ${
              changed
                ? "bg-white border-amber-300 border focus:ring-amber-300 text-amber-800"
                : "bg-white border-gray-200 border focus:ring-teal-300 text-gray-800"
            }`}
          />
          <span className="text-xs text-gray-500 w-6">{unit}</span>
        </div>
      </div>
      {showSlider && (
        <>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: changed ? "#d97706" : TEAL }}
          />
          {sliderLabels && (
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              {sliderLabels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          )}
        </>
      )}
      {extra && <div className="mt-1.5">{extra}</div>}
    </div>
  );
}

/* ========== Cash Flow Waterfall ========== */
function CashFlowWaterfall({ monthlyRent, monthlyExpense, monthlyLoan, monthlyCf }: {
  monthlyRent: number; monthlyExpense: number; monthlyLoan: number; monthlyCf: number;
}) {
  const maxVal = monthlyRent > 0 ? monthlyRent : 1;
  const expPct = Math.min((monthlyExpense / maxVal) * 100, 100);
  const loanPct = Math.min((monthlyLoan / maxVal) * 100, 100);
  const cfPct = Math.min(Math.abs(monthlyCf) / maxVal * 100, 100);
  const cfPositive = monthlyCf >= 0;

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-4">月額キャッシュフロー内訳</div>

      {/* 家賃収入バー */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 font-medium">家賃収入</span>
          <span className="text-xs font-bold text-gray-800">+{formatJpy(monthlyRent)}</span>
        </div>
        <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div className="h-full rounded-lg bg-emerald-400 transition-all duration-500 flex items-center justify-end pr-2" style={{ width: '100%' }}>
            <span className="text-[10px] text-white font-bold">100%</span>
          </div>
        </div>
      </div>

      {/* 経費バー */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 font-medium">経費</span>
          <span className="text-xs font-bold text-orange-600">-{formatJpy(monthlyExpense)}</span>
        </div>
        <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div className="h-full rounded-lg bg-orange-400 transition-all duration-500 flex items-center pr-2" style={{ width: `${expPct}%`, minWidth: expPct > 0 ? '2rem' : '0' }}>
            {expPct >= 10 && <span className="text-[10px] text-white font-bold ml-auto">{expPct.toFixed(0)}%</span>}
          </div>
        </div>
      </div>

      {/* ローン返済バー */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600 font-medium">ローン返済</span>
          <span className="text-xs font-bold text-blue-600">-{formatJpy(monthlyLoan)}</span>
        </div>
        <div className="h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div className="h-full rounded-lg bg-blue-400 transition-all duration-500 flex items-center pr-2" style={{ width: `${loanPct}%`, minWidth: loanPct > 0 ? '2rem' : '0' }}>
            {loanPct >= 10 && <span className="text-[10px] text-white font-bold ml-auto">{loanPct.toFixed(0)}%</span>}
          </div>
        </div>
      </div>

      {/* 区切り線 */}
      <div className="border-t-2 border-dashed border-gray-300 my-3" />

      {/* 手残りバー */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-gray-800">手残り（CF）</span>
          <span className={`text-sm font-black ${cfPositive ? "text-emerald-600" : "text-red-600"}`}>
            {cfPositive ? "+" : "-"}{formatJpy(Math.abs(monthlyCf))}/月
          </span>
        </div>
        <div className="h-8 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className={`h-full rounded-lg transition-all duration-500 flex items-center pr-2 ${cfPositive ? "bg-emerald-500" : "bg-red-500"}`}
            style={{ width: `${cfPct}%`, minWidth: cfPct > 0 ? '3rem' : '0' }}
          >
            {cfPct >= 8 && (
              <span className="text-xs text-white font-bold ml-auto">
                {cfPositive ? "" : "-"}{cfPct.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Big Metric Cell ========== */
function BigMetricCell({ label, value, positive, primary, subtitle }: {
  label: string; value: string; positive: boolean; primary?: boolean; subtitle?: string;
}) {
  return (
    <div className={`rounded-xl px-3.5 py-3 border-2 transition-colors ${
      primary
        ? positive ? "bg-emerald-50 border-emerald-400" : "bg-red-50 border-red-400"
        : positive ? "bg-white border-emerald-200" : "bg-white border-red-200"
    }`}>
      <div className="text-[10px] text-gray-500 tracking-wide font-medium">{label}</div>
      <div className={`text-lg font-black mt-0.5 ${
        positive ? "text-emerald-700" : "text-red-600"
      }`}>{value}</div>
      {subtitle && <div className={`text-[10px] font-medium mt-0.5 ${positive ? "text-emerald-500" : "text-red-400"}`}>{subtitle}</div>}
    </div>
  );
}

/* ========== Detail View ========== */
function PropertyDetail({ item, onBack }: { item: RankingItem; onBack: () => void }) {
  const p = item.property;
  const v = item.valuation;
  const s = item.safety;
  const sc = item.scores;

  // --- デフォルト値 ---
  const defaultSelfFundingMan = Math.round((p.selfFundingJpy ?? Math.round(p.price * 0.1)) / 10_000);
  const defaultLoanYears = p.loanYears;
  const defaultInterestPct = p.loanInterestPct;
  const defaultBrokeragePct = 3.0;
  const defaultExpenseRatioPct = 16.0;

  // --- インタラクティブ入力 ---
  const [selfFundingMan, setSelfFundingMan] = useState(defaultSelfFundingMan);
  const [loanYears, setLoanYears] = useState(defaultLoanYears);
  const [interestPct, setInterestPct] = useState(defaultInterestPct);
  const [brokeragePct, setBrokeragePct] = useState(defaultBrokeragePct);
  const [expenseRatioPct, setExpenseRatioPct] = useState(defaultExpenseRatioPct);

  const hasAnyChange =
    selfFundingMan !== defaultSelfFundingMan ||
    loanYears !== defaultLoanYears ||
    interestPct !== defaultInterestPct ||
    brokeragePct !== defaultBrokeragePct ||
    expenseRatioPct !== defaultExpenseRatioPct;

  const resetAll = () => {
    setSelfFundingMan(defaultSelfFundingMan);
    setLoanYears(defaultLoanYears);
    setInterestPct(defaultInterestPct);
    setBrokeragePct(defaultBrokeragePct);
    setExpenseRatioPct(defaultExpenseRatioPct);
  };

  // --- リアルタイム再計算 ---
  const selfFundingJpy = selfFundingMan * 10_000;
  const initialCostsJpy = Math.round(p.price * (brokeragePct / 100));
  const totalInvestment = selfFundingJpy + initialCostsJpy;
  const borrowAmount = Math.max(0, p.price - selfFundingJpy);
  const annualLoanPayment = borrowAmount > 0 ? calcPMT(interestPct / 100, loanYears, borrowAmount) : 0;
  const monthlyLoanPayment = annualLoanPayment / 12;
  const annualFullRent = p.annualFullRentJpy ?? 0;
  const annualExpense = annualFullRent * (expenseRatioPct / 100);
  const annualFullCf = annualFullRent - annualExpense - annualLoanPayment;
  const monthlyFullCf = annualFullCf / 12;
  const grossYieldPct = p.price > 0 && annualFullRent > 0 ? (annualFullRent / p.price) * 100 : 0;
  const ccrPct = totalInvestment > 0 ? (annualFullCf / totalInvestment) * 100 : null;
  const loanRepaymentRatioPct = annualFullRent > 0 ? (annualLoanPayment / annualFullRent) * 100 : 0;
  const selfFundingPct = p.price > 0 ? (selfFundingJpy / p.price) * 100 : 0;
  const ltv = p.price > 0 ? (borrowAmount / p.price) * 100 : 0;

  const annualCurrentRent = p.annualCurrentRentJpy ?? null;
  const annualCurrentCf = annualCurrentRent != null ? annualCurrentRent - annualExpense - annualLoanPayment : null;
  const currentYieldPct = annualCurrentRent != null && p.price > 0 ? (annualCurrentRent / p.price) * 100 : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-70 cursor-pointer font-medium transition-opacity"
          style={{ color: TEAL }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          一覧に戻る
        </button>

        {/* Hero Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-6">
          {/* 物件画像 */}
          {p.imageUrl && (
            <div className="w-full h-52 sm:h-72 bg-gray-100 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={item.propertyName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold px-2.5 py-1 rounded-lg bg-white/95 shadow" style={{ color: TEAL }}>#{item.rank}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full shadow ${judgmentStyle(item.buyJudgment)}`}>
                      {judgmentLabel(item.buyJudgment)}
                    </span>
                    {item.isNewEntry && <span className="text-xs px-2 py-1 rounded-lg text-white shadow" style={{ backgroundColor: TEAL }}>NEW</span>}
                  </div>
                </div>
                <div className={`text-3xl font-black px-3 py-1.5 rounded-xl bg-white/95 shadow-lg ${scoreColor(item.scoreTotal)}`}>
                  {item.scoreTotal.toFixed(0)}<span className="text-xs text-gray-400 ml-0.5">/100</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            {/* 画像がない場合のヘッダー */}
            {!p.imageUrl && (
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: TEAL }}>#{item.rank}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${judgmentStyle(item.buyJudgment)}`}>
                    {judgmentLabel(item.buyJudgment)}
                  </span>
                  {item.isNewEntry && <span className="text-xs px-2 py-1 rounded-lg text-white" style={{ backgroundColor: TEAL }}>NEW</span>}
                </div>
                <div className={`text-4xl font-black ${scoreColor(item.scoreTotal)}`}>
                  {item.scoreTotal.toFixed(0)}<span className="text-xs text-gray-400 ml-0.5">/100</span>
                </div>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY }}>{item.propertyName}</h1>
            <p className="text-sm text-gray-500 mt-1">{p.address ?? item.ward}</p>

            {/* ソース元リンク */}
            <a
              href={p.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium mt-3 px-4 py-2 rounded-lg border-2 hover:opacity-80 transition-all hover:shadow-sm"
              style={{ color: TEAL, borderColor: TEAL }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              {p.sourceSite === "rakumachi" ? "楽待" : p.sourceSite}で実物件を確認
            </a>
          </div>
        </div>

        {/* 物件概要 */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <SectionTitle icon="&#x1F3E2;">物件概要</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            <InfoCell label="価格" value={formatJpy(p.price)} highlight />
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
          {p.station1?.name && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-1">
              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">アクセス</div>
              {p.station1?.name && (
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  {p.station1.line && `${p.station1.line} `}{p.station1.name}駅 徒歩{p.station1.walkMin ?? "?"}分
                  {p.station1.dailyPassengers && <span className="text-gray-400">（乗降{(p.station1.dailyPassengers / 10000).toFixed(1)}万人/日）</span>}
                </div>
              )}
              {p.station2?.name && (
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shrink-0" />
                  {p.station2.line && `${p.station2.line} `}{p.station2.name}駅 徒歩{p.station2.walkMin ?? "?"}分
                </div>
              )}
              {p.station3?.name && (
                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-200 shrink-0" />
                  {p.station3.line && `${p.station3.line} `}{p.station3.name}駅 徒歩{p.station3.walkMin ?? "?"}分
                </div>
              )}
            </div>
          )}
        </section>

        {/* 7軸スコア */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <SectionTitle icon="&#x1F4CA;">7軸スコアリング</SectionTitle>
          <div className="space-y-3">
            <ScoreAxis label="立地・需要" score={sc.location} max={25} />
            <ScoreAxis label="収益性" score={sc.profitability} max={15} />
            <ScoreAxis label="融資適性" score={sc.financing} max={15} />
            <ScoreAxis label="リスク耐性" score={sc.risk} max={15} />
            <ScoreAxis label="価値創造" score={sc.valueCreation} max={15} />
            <ScoreAxis label="出口" score={sc.exit} max={10} />
            <ScoreAxis label="ビジョン" score={sc.vision} max={5} />
          </div>

          <details className="mt-4">
            <summary className="text-xs cursor-pointer font-medium hover:opacity-70 transition-opacity" style={{ color: TEAL }}>採点根拠を見る</summary>
            <div className="mt-2 bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1 max-h-60 overflow-y-auto">
              {Object.entries(item.scoringDetails).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-2 py-0.5">
                  <span className="text-gray-500">{key}</span>
                  <span className="text-gray-700 text-right font-medium">{val}</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        {/* 収支シミュレーション（インタラクティブ） */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <SectionTitle icon="&#x1F4B0;">収支シミュレーション</SectionTitle>
          </div>

          {/* 変更状態インジケーター */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {hasAnyChange ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  条件変更中 — 下の結果に反映済み
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  デフォルト条件
                </span>
              )}
            </div>
            {hasAnyChange && (
              <button
                onClick={resetAll}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
              >
                全てリセット
              </button>
            )}
          </div>

          {/* 調整パネル */}
          <div className="space-y-3 mb-6">
            {/* 自己資金 */}
            <SimInput
              label="自己資金（頭金）"
              value={selfFundingMan}
              defaultValue={defaultSelfFundingMan}
              onChange={setSelfFundingMan}
              onReset={() => setSelfFundingMan(defaultSelfFundingMan)}
              min={0}
              max={Math.round(p.price / 10_000)}
              unit="万円"
              sliderLabels={["0万（フルローン）", `${selfFundingPct.toFixed(0)}%`, `${formatJpy(p.price)}（全額）`]}
              extra={
                <div className="text-[11px] text-gray-500">
                  借入額: <span className="font-semibold text-gray-700">{formatJpy(borrowAmount)}</span>
                  <span className="ml-2 text-gray-400">LTV {ltv.toFixed(0)}%</span>
                </div>
              }
            />

            {/* 借入年数 */}
            <SimInput
              label="借入年数"
              value={loanYears}
              defaultValue={defaultLoanYears}
              onChange={setLoanYears}
              onReset={() => setLoanYears(defaultLoanYears)}
              min={1}
              max={45}
              unit="年"
              sliderLabels={["1年", "15年", "30年", "45年"]}
            />

            {/* 金利 */}
            <SimInput
              label="金利"
              value={interestPct}
              defaultValue={defaultInterestPct}
              onChange={setInterestPct}
              onReset={() => setInterestPct(defaultInterestPct)}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              sliderLabels={["0%", "2.5%", "5%", "7.5%", "10%"]}
            />

            {/* 仲介手数料 */}
            <SimInput
              label="初期費用（仲介手数料）"
              value={brokeragePct}
              defaultValue={defaultBrokeragePct}
              onChange={setBrokeragePct}
              onReset={() => setBrokeragePct(defaultBrokeragePct)}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              showSlider={false}
              extra={<div className="text-[11px] text-gray-500">= {formatJpy(initialCostsJpy)}</div>}
            />

            {/* 経費率 */}
            <SimInput
              label="経費率（管理費・修繕・税等）"
              value={expenseRatioPct}
              defaultValue={defaultExpenseRatioPct}
              onChange={setExpenseRatioPct}
              onReset={() => setExpenseRatioPct(defaultExpenseRatioPct)}
              min={5}
              max={40}
              step={1}
              unit="%"
              sliderLabels={["5%", "16%（標準）", "25%", "40%"]}
              extra={<div className="text-[11px] text-gray-500">= {formatJpy(annualExpense)}/年</div>}
            />
          </div>

          {/* 月額キャッシュフロー ウォーターフォール */}
          <CashFlowWaterfall
            monthlyRent={annualFullRent / 12}
            monthlyExpense={annualExpense / 12}
            monthlyLoan={monthlyLoanPayment}
            monthlyCf={monthlyFullCf}
          />

          {/* 判定バナー */}
          <div className={`rounded-xl p-4 mb-5 border-2 ${
            monthlyFullCf >= 0
              ? "bg-emerald-50 border-emerald-300"
              : "bg-red-50 border-red-300"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${monthlyFullCf >= 0 ? "" : ""}`}>
                  {monthlyFullCf >= 0 ? "\u2705" : "\u274C"}
                </span>
                <div>
                  <div className={`text-sm font-bold ${monthlyFullCf >= 0 ? "text-emerald-800" : "text-red-800"}`}>
                    {monthlyFullCf >= 0 ? "毎月のCFはプラス — 回ります" : "毎月のCFはマイナス — 持ち出しが発生"}
                  </div>
                  <div className={`text-xs mt-0.5 ${monthlyFullCf >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {monthlyFullCf >= 0
                      ? `毎月 ${formatJpy(monthlyFullCf)} の手残り（年間 ${formatJpy(annualFullCf)}）`
                      : `毎月 ${formatJpy(Math.abs(monthlyFullCf))} の持ち出し（年間 ${formatJpy(Math.abs(annualFullCf))}）`
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主要指標カード */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            <BigMetricCell
              label="満室CF/月"
              value={formatJpy(monthlyFullCf)}
              positive={monthlyFullCf >= 0}
              primary
            />
            <BigMetricCell
              label="満室CF/年"
              value={formatJpy(annualFullCf)}
              positive={annualFullCf >= 0}
            />
            <BigMetricCell
              label="CCR"
              value={ccrPct != null ? `${ccrPct.toFixed(1)}%` : "—"}
              positive={ccrPct != null && ccrPct > 0}
            />
            <BigMetricCell
              label="返済比率"
              value={`${loanRepaymentRatioPct.toFixed(1)}%`}
              positive={loanRepaymentRatioPct <= 50}
              subtitle={loanRepaymentRatioPct <= 40 ? "安全圏" : loanRepaymentRatioPct <= 50 ? "やや高め" : "危険水域"}
            />
          </div>

          {/* 収支詳細（折りたたみ） */}
          <details className="group">
            <summary className="text-xs cursor-pointer font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: TEAL }}>
              <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              収支の内訳を詳しく見る
            </summary>
            <div className="bg-gray-50 rounded-xl p-4 mt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <InfoCell label="表面利回り" value={`${grossYieldPct.toFixed(2)}%`} />
                <InfoCell label="現況利回り" value={currentYieldPct != null ? `${currentYieldPct.toFixed(2)}%` : "—"} />
                <InfoCell label="満室年間家賃" value={annualFullRent > 0 ? formatJpy(annualFullRent) : "—"} />
                <InfoCell label="現況年間家賃" value={annualCurrentRent != null ? formatJpy(annualCurrentRent) : "—"} />
                <InfoCell label="年間経費" value={formatJpy(annualExpense)} />
                <InfoCell label="借入額" value={formatJpy(borrowAmount)} />
                <InfoCell label="年間返済額" value={formatJpy(annualLoanPayment)} />
                <InfoCell label="月額返済" value={formatJpy(monthlyLoanPayment)} />
                <InfoCell label="自己資金" value={formatJpy(selfFundingJpy)} />
                <InfoCell label="初期費用" value={formatJpy(initialCostsJpy)} />
                <InfoCell label="総投資額" value={formatJpy(totalInvestment)} />
                {annualCurrentCf != null && (
                  <InfoCell label="現況CF（年）" value={formatJpy(annualCurrentCf)} />
                )}
              </div>
            </div>
          </details>
        </section>

        {/* 積算評価 */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <SectionTitle icon="&#x1F3D7;">積算評価</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <InfoCell label="土地評価額" value={v.landValuationJpy != null ? formatJpy(v.landValuationJpy) : "—"} />
            <InfoCell label="建物評価額" value={v.buildingValuationJpy != null ? formatJpy(v.buildingValuationJpy) : "—"} />
            <InfoCell label="積算合計" value={v.totalValuationJpy != null ? formatJpy(v.totalValuationJpy) : "—"} />
            <ResultCell label="積算比率" value={v.valuationRatioPct != null ? `${v.valuationRatioPct.toFixed(0)}%` : "—"} />
            <InfoCell label="法定耐用年数" value={v.durableYears != null ? `${v.durableYears}年` : "—"} />
            <InfoCell label="経過年数" value={v.ageYears != null ? `${v.ageYears}年` : "—"} />
            <InfoCell label="残存年数" value={v.remainingYears != null ? `${v.remainingYears}年` : "—"} />
          </div>
        </section>

        {/* 安全余力 */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <SectionTitle icon="&#x1F6E1;">安全余力テスト（金利5%・家賃80%・空室10%）</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <InfoCell label="ストレス家賃/月" value={formatJpy(s.safeMonthlyRentJpy)} />
            <InfoCell label="経費/月" value={formatJpy(s.safeMonthlyExpenseJpy)} />
            <InfoCell label="返済/月" value={formatJpy(s.safeMonthlyLoanJpy)} />
            <ResultCell
              label="安全余力CF/月"
              value={formatJpy(s.safeMonthlyCfJpy)}
              warn={!s.isSafe}
            />
          </div>
          <div className="mt-3">
            {s.isSafe ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                安全 — ストレス条件でもCF黒字維持
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                要注意 — ストレス条件でCF赤字
              </span>
            )}
          </div>
        </section>

        {/* 感度分析 */}
        {item.sensitivity.length > 0 && (
          <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
            <SectionTitle icon="&#x1F50D;">感度分析</SectionTitle>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-2.5 pr-3 text-gray-400 font-medium">パラメータ</th>
                    <th className="text-right py-2.5 px-2 text-gray-400 font-medium">変動</th>
                    <th className="text-right py-2.5 px-2 text-gray-400 font-medium">CF（年）</th>
                    <th className="text-right py-2.5 px-2 text-gray-400 font-medium">利回り</th>
                    <th className="text-right py-2.5 pl-2 text-gray-400 font-medium">CCR</th>
                  </tr>
                </thead>
                <tbody>
                  {item.sensitivity.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-3 text-gray-600 font-medium">{sensitivityParamLabel(row.parameterName)}</td>
                      <td className="py-2.5 px-2 text-right text-gray-500">{sensitivityDelta(row)}</td>
                      <td className={`py-2.5 px-2 text-right font-medium ${row.resultCfJpy < 0 ? "text-red-500" : "text-gray-700"}`}>
                        {formatJpy(row.resultCfJpy)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-gray-700">{row.resultYieldPct.toFixed(2)}%</td>
                      <td className="py-2.5 pl-2 text-right text-gray-700">{row.resultCcrPct != null ? `${row.resultCcrPct.toFixed(1)}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 警告フラグ */}
        {item.warningFlags.length > 0 && (
          <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
            <SectionTitle icon="&#x26A0;">警告フラグ</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {item.warningFlags.map((flag) => (
                <span key={flag} className="text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-medium">
                  {warningLabel(flag)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 説明文 */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 mb-4 shadow-sm border border-gray-100">
          <SectionTitle icon="&#x1F4DD;">総合評価</SectionTitle>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{item.explanation}</pre>
        </section>

        {/* 元サイトリンク */}
        <div className="text-center mt-8 mb-4">
          <a
            href={p.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            style={{ background: `linear-gradient(135deg, ${TEAL}, ${ACCENT})` }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            {p.sourceSite === "rakumachi" ? "楽待" : p.sourceSite}で実物件を確認する
          </a>
          <p className="text-xs text-gray-400 mt-3">掲載元のサイトで最新情報・詳細写真を確認できます</p>
        </div>
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

function InfoCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl px-3.5 py-2.5 ${highlight ? "bg-teal-50 border border-teal-100" : "bg-gray-50"}`}>
      <div className="text-[10px] text-gray-400 tracking-wide font-medium">{label}</div>
      <div className={`text-sm font-semibold mt-0.5 ${highlight ? "text-teal-800" : "text-gray-800"}`}>{value}</div>
    </div>
  );
}

function ResultCell({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-xl px-3.5 py-3 border ${
      warn ? "bg-red-50 border-red-200" : "border-teal-200 bg-gradient-to-b from-teal-50 to-white"
    }`}>
      <div className="text-[10px] text-gray-500 tracking-wide font-medium">{label}</div>
      <div className={`text-base font-bold mt-1 ${warn ? "text-red-600" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

/* ========== List Card ========== */
function PropertyCard({ item, onSelect }: { item: RankingItem; onSelect: () => void }) {
  const hasImage = !!item.property.imageUrl;
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 group"
    >
      {/* 物件画像 */}
      {hasImage && (
        <div className="w-full h-44 sm:h-52 bg-gray-100 overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.property.imageUrl}
            alt={item.propertyName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="text-sm font-bold px-2.5 py-1 rounded-lg bg-white/95 shadow" style={{ color: TEAL }}>#{item.rank}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full shadow ${judgmentStyle(item.buyJudgment)}`}>
              {judgmentLabel(item.buyJudgment)}
            </span>
            {item.isNewEntry && <span className="text-xs px-2 py-1 rounded-lg text-white shadow" style={{ backgroundColor: TEAL }}>NEW</span>}
          </div>
          <div className="absolute top-3 right-3">
            <div className={`text-2xl font-black px-2.5 py-1 rounded-xl bg-white/95 shadow-lg ${scoreColor(item.scoreTotal)}`}>
              {item.scoreTotal.toFixed(0)}<span className="text-[10px] text-gray-400 ml-0.5">/100</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* 画像がない場合のヘッダー */}
        {!hasImage && (
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold" style={{ color: TEAL }}>#{item.rank}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${judgmentStyle(item.buyJudgment)}`}>
                  {judgmentLabel(item.buyJudgment)}
                </span>
                {item.isNewEntry && <span className="text-xs px-2 py-1 rounded-lg text-white" style={{ backgroundColor: TEAL }}>NEW</span>}
                {item.rankChange != null && item.rankChange > 0 && <span className="text-xs text-emerald-600 font-semibold">+{item.rankChange}</span>}
                {item.rankChange != null && item.rankChange < 0 && <span className="text-xs text-red-500 font-semibold">{item.rankChange}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-3xl font-black ${scoreColor(item.scoreTotal)}`}>{item.scoreTotal.toFixed(0)}</div>
              <div className="text-[10px] text-gray-400">/ 100</div>
            </div>
          </div>
        )}

        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{item.propertyName}</h3>
        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
          {item.ward}
          {item.property.station1?.name && ` / ${item.property.station1.name}駅`}
          {item.property.station1?.walkMin != null && ` 徒歩${item.property.station1.walkMin}分`}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <MiniCell label="価格" value={formatJpy(item.property.price)} />
          <MiniCell label="表面利回り" value={`${item.finance.grossYieldPct.toFixed(1)}%`} />
          <MiniCell label="満室CF" value={`${formatJpy(item.finance.annualFullCfJpy)}/年`} highlight={item.finance.annualFullCfJpy < 0} />
          <MiniCell label="CCR" value={item.finance.ccrPct != null ? `${item.finance.ccrPct.toFixed(1)}%` : "—"} />
        </div>

        <div className="mt-3 text-xs text-right font-medium group-hover:translate-x-1 transition-transform" style={{ color: TEAL }}>
          詳細を見る →
        </div>
      </div>
    </button>
  );
}

function MiniCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: highlight ? "#fef2f2" : TEAL_LIGHT }}>
      <div className="text-[10px] text-gray-500 font-medium">{label}</div>
      <div className={`text-sm font-bold mt-0.5 ${highlight ? "text-red-600" : "text-gray-900"}`}>{value}</div>
    </div>
  );
}

/* ========== Filter Types ========== */
interface ScreeningFilters {
  priceMin: number;
  priceMax: number;
  yieldMin: number;
  scoreMin: number;
  cfPositiveOnly: boolean;
  ward: string;
  judgments: string[];
  sortBy: "rank" | "price_asc" | "price_desc" | "yield_desc" | "cf_desc" | "score_desc" | "ccr_desc";
  // 楽待スタイル追加フィルター
  structures: string[];
  ageMax: number;
  walkMax: number;
  totalUnitsMin: number;
  buildingAreaMin: number;
  landAreaMin: number;
  reBuildableOnly: boolean;
  occupancyMin: number;
}

const DEFAULT_FILTERS: ScreeningFilters = {
  priceMin: 0,
  priceMax: 50000, // 5億
  yieldMin: 0,
  scoreMin: 0,
  cfPositiveOnly: false,
  ward: "",
  judgments: [],
  sortBy: "rank",
  structures: [],
  ageMax: 0,
  walkMax: 0,
  totalUnitsMin: 0,
  buildingAreaMin: 0,
  landAreaMin: 0,
  reBuildableOnly: false,
  occupancyMin: 0,
};

const SORT_OPTIONS: { value: ScreeningFilters["sortBy"]; label: string }[] = [
  { value: "rank", label: "総合スコア順" },
  { value: "score_desc", label: "スコア高い順" },
  { value: "yield_desc", label: "利回り高い順" },
  { value: "cf_desc", label: "CF高い順" },
  { value: "ccr_desc", label: "CCR高い順" },
  { value: "price_asc", label: "価格安い順" },
  { value: "price_desc", label: "価格高い順" },
];

const JUDGMENT_OPTIONS = [
  { value: "strong_buy", label: "強い買い", color: "bg-emerald-600" },
  { value: "buy", label: "買い", color: "bg-[#1B6B7A]" },
  { value: "review", label: "要精査", color: "bg-amber-500" },
  { value: "watch", label: "様子見", color: "bg-orange-400" },
  { value: "pass", label: "見送り", color: "bg-gray-400" },
];

const STRUCTURE_OPTIONS = [
  { value: "SRC", label: "SRC造" },
  { value: "RC", label: "RC造" },
  { value: "S", label: "鉄骨造" },
  { value: "LS", label: "軽量鉄骨造" },
  { value: "W", label: "木造" },
];

const WALK_OPTIONS = [
  { value: 0, label: "指定なし" },
  { value: 3, label: "3分以内" },
  { value: 5, label: "5分以内" },
  { value: 7, label: "7分以内" },
  { value: 10, label: "10分以内" },
  { value: 15, label: "15分以内" },
  { value: 20, label: "20分以内" },
];

const AGE_OPTIONS = [
  { value: 0, label: "指定なし" },
  { value: 10, label: "10年以内" },
  { value: 20, label: "20年以内" },
  { value: 30, label: "30年以内" },
  { value: 40, label: "40年以内" },
  { value: 50, label: "50年以内" },
];

/* ========== Screening Filter Panel ========== */
function isFilterActive(f: ScreeningFilters): boolean {
  return (
    f.priceMin > 0 ||
    f.priceMax < 50000 ||
    f.yieldMin > 0 ||
    f.scoreMin > 0 ||
    f.cfPositiveOnly ||
    f.ward !== "" ||
    f.judgments.length > 0 ||
    f.sortBy !== "rank" ||
    f.structures.length > 0 ||
    f.ageMax > 0 ||
    f.walkMax > 0 ||
    f.totalUnitsMin > 0 ||
    f.buildingAreaMin > 0 ||
    f.landAreaMin > 0 ||
    f.reBuildableOnly ||
    f.occupancyMin > 0
  );
}

function countActiveFilters(f: ScreeningFilters): number {
  return [
    f.priceMin > 0 || f.priceMax < 50000,
    f.yieldMin > 0,
    f.scoreMin > 0,
    f.cfPositiveOnly,
    f.ward !== "",
    f.judgments.length > 0,
    f.sortBy !== "rank",
    f.structures.length > 0,
    f.ageMax > 0,
    f.walkMax > 0,
    f.totalUnitsMin > 0,
    f.buildingAreaMin > 0 || f.landAreaMin > 0,
    f.reBuildableOnly,
    f.occupancyMin > 0,
  ].filter(Boolean).length;
}

function FilterPanel({
  filters,
  onChange,
  wards,
  totalCount,
  filteredCount,
}: {
  filters: ScreeningFilters;
  onChange: (f: ScreeningFilters) => void;
  wards: string[];
  totalCount: number;
  filteredCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ScreeningFilters>({ ...filters });

  // Sync draft when panel opens
  const handleToggle = () => {
    if (!open) setDraft({ ...filters });
    setOpen(!open);
  };

  const hasActiveFilters = isFilterActive(filters);
  const activeCount = countActiveFilters(filters);

  // Check if draft differs from applied filters
  const hasDraftChanges = JSON.stringify(draft) !== JSON.stringify(filters);

  const toggleJudgment = (j: string) => {
    const next = draft.judgments.includes(j)
      ? draft.judgments.filter((x) => x !== j)
      : [...draft.judgments, j];
    setDraft({ ...draft, judgments: next });
  };

  const toggleStructure = (s: string) => {
    const next = draft.structures.includes(s)
      ? draft.structures.filter((x) => x !== s)
      : [...draft.structures, s];
    setDraft({ ...draft, structures: next });
  };

  const handleApply = () => {
    onChange({ ...draft });
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setDraft({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
          hasActiveFilters
            ? "bg-amber-50 border-amber-200 hover:border-amber-300"
            : "bg-white border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">スクリーニング条件</span>
          {hasActiveFilters && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
              {activeCount}件の条件
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {filteredCount === totalCount ? `全${totalCount}件` : `${filteredCount}/${totalCount}件`}
          </span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Filter Panel Body */}
      {open && (
        <div className="mt-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-5">
          {/* 並び替え */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">並び替え</label>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDraft({ ...draft, sortBy: opt.value })}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    draft.sortBy === opt.value
                      ? "text-white border-teal-600 shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                  style={draft.sortBy === opt.value ? { backgroundColor: TEAL } : {}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 判定フィルタ */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">判定</label>
            <div className="flex flex-wrap gap-1.5">
              {JUDGMENT_OPTIONS.map((opt) => {
                const active = draft.judgments.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleJudgment(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                      active
                        ? `${judgmentStyle(opt.value)} border-transparent shadow-sm`
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 価格レンジ */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">
              価格帯
              {(draft.priceMin > 0 || draft.priceMax < 50000) && (
                <span className="ml-2 font-normal text-gray-400">
                  {draft.priceMin > 0 ? `${draft.priceMin.toLocaleString()}万円` : "下限なし"} 〜 {draft.priceMax < 50000 ? `${draft.priceMax.toLocaleString()}万円` : "上限なし"}
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="下限（万円）"
                value={draft.priceMin || ""}
                onChange={(e) => setDraft({ ...draft, priceMin: Number(e.target.value) || 0 })}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              />
              <span className="text-gray-400 text-xs">〜</span>
              <input
                type="number"
                placeholder="上限（万円）"
                value={draft.priceMax < 50000 ? draft.priceMax : ""}
                onChange={(e) => setDraft({ ...draft, priceMax: Number(e.target.value) || 50000 })}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              />
              <span className="text-xs text-gray-400 shrink-0">万円</span>
            </div>
          </div>

          {/* 利回り・スコア */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                表面利回り（下限）
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step={0.5}
                  min={0}
                  max={30}
                  placeholder="0"
                  value={draft.yieldMin || ""}
                  onChange={(e) => setDraft({ ...draft, yieldMin: Number(e.target.value) || 0 })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                />
                <span className="text-xs text-gray-400 shrink-0">%以上</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                スコア（下限）
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step={5}
                  min={0}
                  max={100}
                  placeholder="0"
                  value={draft.scoreMin || ""}
                  onChange={(e) => setDraft({ ...draft, scoreMin: Number(e.target.value) || 0 })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                />
                <span className="text-xs text-gray-400 shrink-0">点以上</span>
              </div>
            </div>
          </div>

          {/* エリア */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">エリア</label>
            <select
              value={draft.ward}
              onChange={(e) => setDraft({ ...draft, ward: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent bg-white"
            >
              <option value="">全エリア</option>
              {wards.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* 建物構造 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">建物構造</label>
            <div className="flex flex-wrap gap-1.5">
              {STRUCTURE_OPTIONS.map((opt) => {
                const active = draft.structures.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleStructure(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      active
                        ? "text-white border-teal-600 shadow-sm"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                    style={active ? { backgroundColor: TEAL } : {}}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 築年数・駅徒歩 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">築年数</label>
              <select
                value={draft.ageMax}
                onChange={(e) => setDraft({ ...draft, ageMax: Number(e.target.value) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent bg-white"
              >
                {AGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">駅からの徒歩分数</label>
              <select
                value={draft.walkMax}
                onChange={(e) => setDraft({ ...draft, walkMax: Number(e.target.value) })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent bg-white"
              >
                {WALK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 面積・戸数 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">建物面積</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  placeholder="下限"
                  value={draft.buildingAreaMin || ""}
                  onChange={(e) => setDraft({ ...draft, buildingAreaMin: Number(e.target.value) || 0 })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <span className="text-[10px] text-gray-400 shrink-0">㎡〜</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">土地面積</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  placeholder="下限"
                  value={draft.landAreaMin || ""}
                  onChange={(e) => setDraft({ ...draft, landAreaMin: Number(e.target.value) || 0 })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <span className="text-[10px] text-gray-400 shrink-0">㎡〜</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">総戸数</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  placeholder="下限"
                  value={draft.totalUnitsMin || ""}
                  onChange={(e) => setDraft({ ...draft, totalUnitsMin: Number(e.target.value) || 0 })}
                  className="w-full text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <span className="text-[10px] text-gray-400 shrink-0">戸〜</span>
              </div>
            </div>
          </div>

          {/* 入居率 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">
              入居率
              {draft.occupancyMin > 0 && <span className="ml-2 font-normal text-gray-400">{draft.occupancyMin}%以上</span>}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[0, 50, 70, 80, 90, 100].map((v) => (
                <button
                  key={v}
                  onClick={() => setDraft({ ...draft, occupancyMin: v })}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    draft.occupancyMin === v
                      ? "text-white border-teal-600 shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                  style={draft.occupancyMin === v ? { backgroundColor: TEAL } : {}}
                >
                  {v === 0 ? "指定なし" : v === 100 ? "満室のみ" : `${v}%以上`}
                </button>
              ))}
            </div>
          </div>

          {/* こだわり条件 */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">こだわり条件</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.cfPositiveOnly}
                  onChange={(e) => setDraft({ ...draft, cfPositiveOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: TEAL }}
                />
                <span className="text-xs font-medium text-gray-700">CF（キャッシュフロー）がプラスの物件のみ</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.reBuildableOnly}
                  onChange={(e) => setDraft({ ...draft, reBuildableOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor: TEAL }}
                />
                <span className="text-xs font-medium text-gray-700">再建築不可を除く</span>
              </label>
            </div>
          </div>

          {/* 確定ボタン・リセット */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <button
              onClick={handleApply}
              className="w-full py-3 rounded-xl text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98]"
              style={{ backgroundColor: TEAL }}
            >
              この条件で検索
              {isFilterActive(draft) && (
                <span className="ml-2 text-white/80 text-xs font-normal">
                  ({countActiveFilters(draft)}件の条件)
                </span>
              )}
            </button>
            {isFilterActive(draft) && (
              <button
                onClick={handleReset}
                className="w-full text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer underline py-1"
              >
                全ての条件をリセット
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Filter Logic ========== */
function applyFilters(rankings: RankingItem[], filters: ScreeningFilters): RankingItem[] {
  const currentYear = new Date().getFullYear();
  let result = rankings.filter((item) => {
    const p = item.property;
    const priceMan = Math.round(p.price / 10_000);
    if (filters.priceMin > 0 && priceMan < filters.priceMin) return false;
    if (filters.priceMax < 50000 && priceMan > filters.priceMax) return false;
    if (filters.yieldMin > 0 && item.finance.grossYieldPct < filters.yieldMin) return false;
    if (filters.scoreMin > 0 && item.scoreTotal < filters.scoreMin) return false;
    if (filters.cfPositiveOnly && item.finance.annualFullCfJpy < 0) return false;
    if (filters.ward && item.ward !== filters.ward) return false;
    if (filters.judgments.length > 0 && !filters.judgments.includes(item.buyJudgment)) return false;
    // 建物構造
    if (filters.structures.length > 0 && p.structureType && !filters.structures.includes(p.structureType)) return false;
    // 築年数
    if (filters.ageMax > 0 && p.builtYear) {
      const age = currentYear - p.builtYear;
      if (age > filters.ageMax) return false;
    }
    // 駅徒歩
    if (filters.walkMax > 0 && p.station1?.walkMin != null) {
      if (p.station1.walkMin > filters.walkMax) return false;
    }
    // 総戸数
    if (filters.totalUnitsMin > 0 && p.totalUnits != null && p.totalUnits < filters.totalUnitsMin) return false;
    // 建物面積
    if (filters.buildingAreaMin > 0 && p.buildingAreaSqm != null && p.buildingAreaSqm < filters.buildingAreaMin) return false;
    // 土地面積
    if (filters.landAreaMin > 0 && p.landAreaSqm != null && p.landAreaSqm < filters.landAreaMin) return false;
    // 再建築可否
    if (filters.reBuildableOnly && p.reBuildable === false) return false;
    // 入居率
    if (filters.occupancyMin > 0 && p.occupancyRate != null && p.occupancyRate < filters.occupancyMin) return false;
    return true;
  });

  // Sort
  switch (filters.sortBy) {
    case "price_asc":
      result = [...result].sort((a, b) => a.property.price - b.property.price);
      break;
    case "price_desc":
      result = [...result].sort((a, b) => b.property.price - a.property.price);
      break;
    case "yield_desc":
      result = [...result].sort((a, b) => b.finance.grossYieldPct - a.finance.grossYieldPct);
      break;
    case "cf_desc":
      result = [...result].sort((a, b) => b.finance.annualFullCfJpy - a.finance.annualFullCfJpy);
      break;
    case "score_desc":
      result = [...result].sort((a, b) => b.scoreTotal - a.scoreTotal);
      break;
    case "ccr_desc":
      result = [...result].sort((a, b) => (b.finance.ccrPct ?? -999) - (a.finance.ccrPct ?? -999));
      break;
    default: // rank
      break;
  }

  return result;
}

/* ========== Main Page ========== */
export default function ScreeningPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ScreeningFilters>({ ...DEFAULT_FILTERS });

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: TEAL, borderTopColor: "transparent" }} />
          <p className="text-gray-400 text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md text-center shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-2">データ未生成</h2>
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
  const wards = [...new Set(data.rankings.map((r) => r.ward))].sort();
  const filtered = applyFilters(data.rankings, filters);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${scoreBgColor(85)} flex items-center justify-center shadow-lg`}>
              <span className="text-white text-lg font-bold">B</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                買い推奨ベスト{data.count}
              </h1>
              <p className="text-sm text-gray-500">
                東京23区 1棟投資物件 | {data.date} 更新
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 ml-13">
            生成: {generatedAt.toLocaleString("ja-JP")}
          </p>
          {data.rankings.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.rankings.filter((r) => r.isNewEntry).length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full text-white font-medium shadow-sm" style={{ backgroundColor: TEAL }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  新着 {data.rankings.filter((r) => r.isNewEntry).length}件
                </span>
              )}
              {data.rankings.filter((r) => r.priceChange != null && r.priceChange < 0).length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  値下げ {data.rankings.filter((r) => r.priceChange != null && r.priceChange < 0).length}件
                </span>
              )}
            </div>
          )}
        </header>

        {/* スクリーニング条件パネル */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          wards={wards}
          totalCount={data.rankings.length}
          filteredCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl mb-3">&#x1F50D;</div>
            <p className="text-sm font-semibold text-gray-700 mb-1">条件に一致する物件がありません</p>
            <p className="text-xs text-gray-400">フィルター条件を緩めてお試しください</p>
            <button
              onClick={() => setFilters({ ...DEFAULT_FILTERS })}
              className="mt-4 text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              条件をリセット
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
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
        )}

        <footer className="mt-16 text-center text-xs text-gray-400 pb-8">
          <div className="w-12 h-0.5 mx-auto mb-4 rounded-full" style={{ backgroundColor: TEAL, opacity: 0.3 }} />
          <p className="font-medium">マスター投資家メソッド 7軸100点スコアリング</p>
          <p className="mt-1.5 text-gray-300">本データは投資助言ではありません。投資判断は自己責任で行ってください。</p>
        </footer>
      </div>
    </div>
  );
}
