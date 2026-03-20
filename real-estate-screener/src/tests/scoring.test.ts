import { describe, it, expect } from 'vitest';
import { scoreProperty, buyJudgmentLabel } from '../core/scoring.js';
import { calcFinance, calcSafetyMargin } from '../core/finance.js';
import { calcValuation } from '../core/valuation.js';
import { dummyProperties } from './dummy-data.js';

describe('scoreProperty', () => {
  it('should score a good property highly', () => {
    const prop = dummyProperties[0]; // グランレジデンス中野
    const finance = calcFinance(prop);
    const valuation = calcValuation(prop);
    const safety = calcSafetyMargin(prop);
    const result = scoreProperty(prop, finance, valuation, safety);

    // 中野駅徒歩6分、9戸、木造、表面9.5%
    expect(result.scores.total).toBeGreaterThan(50);
    expect(result.scores.location).toBeGreaterThan(0);
    expect(result.scores.profitability).toBeGreaterThan(0);
    expect(result.warningFlags).toBeDefined();
  });

  it('should flag non-rebuildable property', () => {
    const prop = dummyProperties[7]; // 再建築不可アパート荒川
    const finance = calcFinance(prop);
    const valuation = calcValuation(prop);
    const safety = calcSafetyMargin(prop);
    const result = scoreProperty(prop, finance, valuation, safety);

    expect(result.warningFlags).toContain('non_rebuildable');
    expect(result.specialOpportunityFlag).toBe(true);
  });

  it('should rank all dummy properties without errors', () => {
    for (const prop of dummyProperties) {
      const finance = calcFinance(prop);
      const valuation = calcValuation(prop);
      const safety = calcSafetyMargin(prop);
      const result = scoreProperty(prop, finance, valuation, safety);

      expect(result.scores.total).toBeGreaterThanOrEqual(0);
      expect(result.scores.total).toBeLessThanOrEqual(100);
      expect(['strong_buy', 'buy', 'review', 'watch', 'pass']).toContain(result.buyJudgment);
    }
  });
});

describe('buyJudgmentLabel', () => {
  it('should return correct labels', () => {
    expect(buyJudgmentLabel('strong_buy')).toBe('強い買い候補');
    expect(buyJudgmentLabel('buy')).toBe('買い候補');
    expect(buyJudgmentLabel('review')).toBe('要精査');
    expect(buyJudgmentLabel('watch')).toBe('観察');
    expect(buyJudgmentLabel('pass')).toBe('見送り');
  });
});
