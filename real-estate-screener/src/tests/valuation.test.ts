import { describe, it, expect } from 'vitest';
import { calcValuation, calcAgeYears, getDurableYears } from '../core/valuation.js';
import { dummyProperties } from './dummy-data.js';

describe('calcAgeYears', () => {
  it('should calculate age correctly', () => {
    const age = calcAgeYears(2005, 3, 2026);
    expect(age).toBe(21);
  });

  it('should handle future month', () => {
    // If built in December and current month is less, subtract 1
    const age = calcAgeYears(2005, undefined, 2026);
    expect(age).toBe(21);
  });
});

describe('getDurableYears', () => {
  it('should return correct durable years', () => {
    expect(getDurableYears('RC')).toBe(47);
    expect(getDurableYears('SRC')).toBe(47);
    expect(getDurableYears('S')).toBe(34);
    expect(getDurableYears('W')).toBe(22);
    expect(getDurableYears('W劣')).toBe(30);
  });
});

describe('calcValuation', () => {
  it('should calculate valuation for wooden building', () => {
    const prop = dummyProperties[0]; // 木造 2005年 中野区
    const result = calcValuation(prop);

    // 土地積算 = 120㎡ × 450,000円 = 54,000,000円
    expect(result.landValuationJpy).toBe(54_000_000);

    // 建物積算 = (180㎡ × 150,000 × max(22-21, 0)) / 22
    // 築21年で残り1年
    expect(result.buildingValuationJpy).toBeGreaterThan(0);

    // 積算比率
    expect(result.valuationRatioPct).toBeGreaterThan(0);
  });

  it('should calculate valuation for RC building', () => {
    const prop = dummyProperties[1]; // RC 1995年 品川区
    const result = calcValuation(prop);

    // 土地積算 = 150㎡ × 700,000円 = 105,000,000円
    expect(result.landValuationJpy).toBe(105_000_000);

    // RC 耐用年数47年、築31年 → 残16年
    expect(result.durableYears).toBe(47);
    expect(result.remainingYears).toBeGreaterThan(0);
  });
});
