import type { PropertyCanonical, FinanceResult, SafetyMarginResult, SensitivityRow } from './canonical-schema.js';

/**
 * 年間ローン返済額を元利均等で計算
 * PMT = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calcAnnualLoanPayment(
  borrowAmount: number,
  annualInterestPct: number,
  loanYears: number,
): number {
  if (borrowAmount <= 0) return 0;
  if (annualInterestPct <= 0) {
    // 無利子の場合
    return borrowAmount / loanYears;
  }
  const r = annualInterestPct / 100 / 12; // 月利
  const n = loanYears * 12; // 総返済月数
  const monthlyPayment = borrowAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return monthlyPayment * 12;
}

/**
 * 収支計算
 */
export function calcFinance(property: PropertyCanonical): FinanceResult {
  const price = property.propertyPriceJpy;
  const fullRent = property.annualFullRentJpy ?? 0;
  const currentRent = property.annualCurrentRentJpy ?? null;
  const expenseRatio = property.expenseRatioPct / 100;
  const selfFunding = property.selfFundingJpy ?? price * 0.1; // デフォルト10%
  const borrowAmount = Math.max(price - selfFunding, 0);

  // (1) 表面利回り
  const grossYieldPct = fullRent > 0 ? (fullRent / price) * 100 : 0;

  // (2) 現況利回り
  const currentYieldPct = currentRent !== null ? (currentRent / price) * 100 : null;

  // (3) 年間経費
  const annualExpenseJpy = fullRent * expenseRatio;

  // (4) 年間ローン返済
  const annualLoanPaymentJpy = calcAnnualLoanPayment(
    borrowAmount,
    property.loanInterestPct,
    property.loanYears,
  );
  const monthlyLoanPaymentJpy = annualLoanPaymentJpy / 12;

  // (5) 満室CF
  const annualFullCfJpy = fullRent - annualExpenseJpy - annualLoanPaymentJpy;

  // (6) 現況CF
  const annualCurrentCfJpy = currentRent !== null
    ? currentRent - annualExpenseJpy - annualLoanPaymentJpy
    : null;

  // (7) 満室CF率
  const fullCfPct = fullRent > 0
    ? 100 - (expenseRatio * 100) - (annualLoanPaymentJpy / fullRent * 100)
    : 0;

  // (8) 現況CF率
  const currentCfPct = currentRent !== null && currentRent > 0
    ? 100 - (expenseRatio * 100) - (annualLoanPaymentJpy / currentRent * 100)
    : null;

  // (9) CCR
  const ccrPct = selfFunding > 0 ? (annualFullCfJpy / selfFunding) * 100 : null;

  // ローン返済比率
  const loanRepaymentRatioPct = fullRent > 0
    ? (annualLoanPaymentJpy / fullRent) * 100
    : 0;

  return {
    grossYieldPct,
    currentYieldPct,
    annualExpenseJpy,
    annualLoanPaymentJpy,
    monthlyLoanPaymentJpy,
    annualFullCfJpy,
    annualCurrentCfJpy,
    monthlyFullCfJpy: annualFullCfJpy / 12,
    monthlyCurrentCfJpy: annualCurrentCfJpy !== null ? annualCurrentCfJpy / 12 : null,
    fullCfPct,
    currentCfPct,
    ccrPct,
    loanRepaymentRatioPct,
    borrowAmount,
  };
}

/**
 * 安全余力CF計算
 * 家賃80%、経費10%、金利5%想定
 */
export function calcSafetyMargin(
  property: PropertyCanonical,
  safetyInterestPct = 5.0,
  safetyRentRatio = 0.8,
  safetyExpenseRatio = 0.10,
): SafetyMarginResult {
  const fullRent = property.annualFullRentJpy ?? 0;
  const selfFunding = property.selfFundingJpy ?? property.propertyPriceJpy * 0.1;
  const borrowAmount = Math.max(property.propertyPriceJpy - selfFunding, 0);

  const safeMonthlyRentJpy = (fullRent / 12) * safetyRentRatio;
  const safeMonthlyExpenseJpy = (fullRent / 12) * safetyExpenseRatio;
  const safeAnnualLoan = calcAnnualLoanPayment(borrowAmount, safetyInterestPct, property.loanYears);
  const safeMonthlyLoanJpy = safeAnnualLoan / 12;
  const safeMonthlyCfJpy = safeMonthlyRentJpy - safeMonthlyExpenseJpy - safeMonthlyLoanJpy;

  return {
    safeMonthlyRentJpy,
    safeMonthlyExpenseJpy,
    safeMonthlyLoanJpy,
    safeMonthlyCfJpy,
    isSafe: safeMonthlyCfJpy >= 0,
  };
}

/**
 * 感度分析
 * 価格 ±500万円、金利 ±0.25%、融資期間 ±5年、自己資金 ±500万円
 */
export function calcSensitivity(property: PropertyCanonical): SensitivityRow[] {
  const results: SensitivityRow[] = [];
  const fullRent = property.annualFullRentJpy ?? 0;
  const basePrice = property.propertyPriceJpy;
  const baseSelfFunding = property.selfFundingJpy ?? basePrice * 0.1;

  // 価格 ±500万円（100万円刻み）
  for (let delta = -5_000_000; delta <= 5_000_000; delta += 1_000_000) {
    const newPrice = basePrice + delta;
    if (newPrice <= 0) continue;
    const borrow = Math.max(newPrice - baseSelfFunding, 0);
    const annualLoan = calcAnnualLoanPayment(borrow, property.loanInterestPct, property.loanYears);
    const expense = fullRent * (property.expenseRatioPct / 100);
    const cf = fullRent - expense - annualLoan;
    const yieldPct = fullRent > 0 ? (fullRent / newPrice) * 100 : 0;
    const ccr = baseSelfFunding > 0 ? (cf / baseSelfFunding) * 100 : null;
    results.push({ parameterName: 'price', deltaValue: delta, resultCfJpy: cf, resultYieldPct: yieldPct, resultCcrPct: ccr });
  }

  // 金利 ±0.25%（0.05%刻み）
  for (let delta = -0.25; delta <= 0.25; delta += 0.05) {
    const roundedDelta = Math.round(delta * 100) / 100;
    const newRate = property.loanInterestPct + roundedDelta;
    if (newRate < 0) continue;
    const borrow = Math.max(basePrice - baseSelfFunding, 0);
    const annualLoan = calcAnnualLoanPayment(borrow, newRate, property.loanYears);
    const expense = fullRent * (property.expenseRatioPct / 100);
    const cf = fullRent - expense - annualLoan;
    const yieldPct = fullRent > 0 ? (fullRent / basePrice) * 100 : 0;
    const ccr = baseSelfFunding > 0 ? (cf / baseSelfFunding) * 100 : null;
    results.push({ parameterName: 'interest', deltaValue: roundedDelta, resultCfJpy: cf, resultYieldPct: yieldPct, resultCcrPct: ccr });
  }

  // 融資期間 ±5年（1年刻み）
  for (let delta = -5; delta <= 5; delta++) {
    const newYears = property.loanYears + delta;
    if (newYears <= 0) continue;
    const borrow = Math.max(basePrice - baseSelfFunding, 0);
    const annualLoan = calcAnnualLoanPayment(borrow, property.loanInterestPct, newYears);
    const expense = fullRent * (property.expenseRatioPct / 100);
    const cf = fullRent - expense - annualLoan;
    const yieldPct = fullRent > 0 ? (fullRent / basePrice) * 100 : 0;
    const ccr = baseSelfFunding > 0 ? (cf / baseSelfFunding) * 100 : null;
    results.push({ parameterName: 'years', deltaValue: delta, resultCfJpy: cf, resultYieldPct: yieldPct, resultCcrPct: ccr });
  }

  // 自己資金 ±500万円（100万円刻み）
  for (let delta = -5_000_000; delta <= 5_000_000; delta += 1_000_000) {
    const newSelfFunding = baseSelfFunding + delta;
    if (newSelfFunding <= 0) continue;
    const borrow = Math.max(basePrice - newSelfFunding, 0);
    const annualLoan = calcAnnualLoanPayment(borrow, property.loanInterestPct, property.loanYears);
    const expense = fullRent * (property.expenseRatioPct / 100);
    const cf = fullRent - expense - annualLoan;
    const yieldPct = fullRent > 0 ? (fullRent / basePrice) * 100 : 0;
    const ccr = newSelfFunding > 0 ? (cf / newSelfFunding) * 100 : null;
    results.push({ parameterName: 'self_funding', deltaValue: delta, resultCfJpy: cf, resultYieldPct: yieldPct, resultCcrPct: ccr });
  }

  return results;
}
