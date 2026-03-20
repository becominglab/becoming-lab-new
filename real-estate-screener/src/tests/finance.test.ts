import { describe, it, expect } from 'vitest';
import { calcAnnualLoanPayment, calcFinance, calcSafetyMargin, calcSensitivity } from '../core/finance.js';
import { dummyProperties } from './dummy-data.js';

describe('calcAnnualLoanPayment', () => {
  it('should calculate correct annual loan payment', () => {
    // 5800万円借入、金利1.5%、30年
    const annual = calcAnnualLoanPayment(58_000_000, 1.5, 30);
    // 月返済約20万、年返済約240万
    expect(annual).toBeGreaterThan(2_300_000);
    expect(annual).toBeLessThan(2_500_000);
  });

  it('should return 0 for zero borrow amount', () => {
    expect(calcAnnualLoanPayment(0, 1.5, 30)).toBe(0);
  });

  it('should handle zero interest rate', () => {
    const annual = calcAnnualLoanPayment(30_000_000, 0, 30);
    expect(annual).toBe(1_000_000); // 3000万 / 30年
  });
});

describe('calcFinance', () => {
  it('should calculate finance for dummy property', () => {
    const prop = dummyProperties[0]; // グランレジデンス中野
    const result = calcFinance(prop);

    // 表面利回り = 648万 / 6800万 * 100 ≈ 9.53%
    expect(result.grossYieldPct).toBeCloseTo(9.53, 1);

    // 現況利回り = 576万 / 6800万 * 100 ≈ 8.47%
    expect(result.currentYieldPct).toBeCloseTo(8.47, 1);

    // CF should be positive
    expect(result.annualFullCfJpy).toBeGreaterThan(0);

    // CCR should be positive
    expect(result.ccrPct).toBeGreaterThan(0);
  });
});

describe('calcSafetyMargin', () => {
  it('should calculate safety margin', () => {
    const prop = dummyProperties[0];
    const result = calcSafetyMargin(prop);

    // 月家賃80% = 648万/12*0.8 = 43.2万
    expect(result.safeMonthlyRentJpy).toBeCloseTo(432_000, -3);

    // 安全余力は金利5%で計算されるので厳しめ
    expect(typeof result.isSafe).toBe('boolean');
  });
});

describe('calcSensitivity', () => {
  it('should generate sensitivity rows for all parameters', () => {
    const prop = dummyProperties[0];
    const rows = calcSensitivity(prop);

    const priceRows = rows.filter(r => r.parameterName === 'price');
    const interestRows = rows.filter(r => r.parameterName === 'interest');
    const yearsRows = rows.filter(r => r.parameterName === 'years');
    const fundingRows = rows.filter(r => r.parameterName === 'self_funding');

    expect(priceRows.length).toBeGreaterThan(0);
    expect(interestRows.length).toBeGreaterThan(0);
    expect(yearsRows.length).toBeGreaterThan(0);
    expect(fundingRows.length).toBeGreaterThan(0);
  });
});
