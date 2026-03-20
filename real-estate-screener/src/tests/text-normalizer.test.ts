import { describe, it, expect } from 'vitest';
import {
  normalizeAddress,
  parsePrice,
  parseArea,
  parseYield,
  parseWalkMinutes,
  parseBuiltYear,
  extractWard,
  normalizeStructureType,
} from '../utils/text-normalizer.js';

describe('normalizeAddress', () => {
  it('should normalize full-width to half-width', () => {
    expect(normalizeAddress('東京都新宿区西新宿２丁目８番１号')).toBe('東京都新宿区西新宿2-8-1');
  });

  it('should handle already normalized addresses', () => {
    expect(normalizeAddress('東京都新宿区西新宿2-8-1')).toBe('東京都新宿区西新宿2-8-1');
  });
});

describe('parsePrice', () => {
  it('should parse 億万 format', () => {
    expect(parsePrice('1億5000万円')).toBe(150_000_000);
  });

  it('should parse 万 format', () => {
    expect(parsePrice('5,000万円')).toBe(50_000_000);
  });

  it('should parse plain number', () => {
    expect(parsePrice('150000000')).toBe(150_000_000);
  });

  it('should return null for empty', () => {
    expect(parsePrice('')).toBeNull();
  });
});

describe('parseArea', () => {
  it('should parse area with unit', () => {
    expect(parseArea('123.56㎡')).toBe(123.56);
  });

  it('should parse area without unit', () => {
    expect(parseArea('123.56')).toBe(123.56);
  });
});

describe('parseYield', () => {
  it('should parse yield with percent', () => {
    expect(parseYield('8.6%')).toBe(8.6);
  });

  it('should parse yield without percent', () => {
    expect(parseYield('8.6')).toBe(8.6);
  });
});

describe('parseWalkMinutes', () => {
  it('should parse walk minutes', () => {
    expect(parseWalkMinutes('徒歩6分')).toBe(6);
    expect(parseWalkMinutes('6分')).toBe(6);
    expect(parseWalkMinutes('6')).toBe(6);
  });
});

describe('parseBuiltYear', () => {
  it('should parse year and month', () => {
    expect(parseBuiltYear('1998年3月')).toEqual({ year: 1998, month: 3 });
  });

  it('should parse year only', () => {
    expect(parseBuiltYear('1998年')).toEqual({ year: 1998 });
  });

  it('should parse age format', () => {
    const result = parseBuiltYear('築26年');
    expect(result).not.toBeNull();
    expect(result!.year).toBeGreaterThan(1990);
  });
});

describe('extractWard', () => {
  it('should extract ward from address', () => {
    expect(extractWard('東京都新宿区西新宿2-8-1')).toBe('新宿区');
    expect(extractWard('東京都足立区千住3-20-8')).toBe('足立区');
  });

  it('should return null for non-23-ward address', () => {
    expect(extractWard('東京都八王子市元横山町')).toBeNull();
  });
});

describe('normalizeStructureType', () => {
  it('should normalize structure types', () => {
    expect(normalizeStructureType('鉄筋コンクリート造')).toBe('RC');
    expect(normalizeStructureType('木造')).toBe('W');
    expect(normalizeStructureType('重量鉄骨造')).toBe('S');
    expect(normalizeStructureType('鉄骨鉄筋コンクリート造')).toBe('SRC');
  });
});
