import { describe, it, expect } from 'vitest';
import { rankProperties, extractReviewQueue } from '../core/ranking.js';
import { dummyProperties } from './dummy-data.js';

describe('rankProperties', () => {
  it('should return top N entries sorted by score', () => {
    const entries = rankProperties(dummyProperties, 5);
    expect(entries.length).toBe(5);

    // スコア降順
    for (let i = 0; i < entries.length - 1; i++) {
      expect(entries[i].scoreTotal).toBeGreaterThanOrEqual(entries[i + 1].scoreTotal);
    }

    // ランク番号
    entries.forEach((e, i) => {
      expect(e.rank).toBe(i + 1);
    });
  });

  it('should mark all as new entries when no previous rankings', () => {
    const entries = rankProperties(dummyProperties, 3);
    entries.forEach(e => {
      expect(e.isNewEntry).toBe(true);
    });
  });

  it('should calculate rank changes with previous rankings', () => {
    const prev = new Map<string, number>();
    // 現在1位のものを前回3位に設定
    const firstRun = rankProperties(dummyProperties, 3);
    prev.set(firstRun[0].canonicalId, 3);

    const entries = rankProperties(dummyProperties, 3, prev);
    expect(entries[0].isNewEntry).toBe(false);
    expect(entries[0].rankChange).toBe(2); // 3位→1位 = +2
  });
});

describe('extractReviewQueue', () => {
  it('should extract review candidates', () => {
    const reviewItems = extractReviewQueue(dummyProperties);
    // 再建築不可物件(dummy-008)がレビューキューに入るはず
    expect(reviewItems.length).toBeGreaterThan(0);
    const specialOpp = reviewItems.find(r => r.scoring.specialOpportunityFlag);
    expect(specialOpp).toBeDefined();
  });
});
