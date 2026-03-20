import { describe, it, expect } from 'vitest';
import { checkDuplicate, deduplicateProperties } from '../core/dedupe.js';
import { dummyProperties } from './dummy-data.js';
import type { PropertyCanonical } from '../core/canonical-schema.js';

describe('checkDuplicate', () => {
  it('should detect same listing ID duplicates', () => {
    const a = dummyProperties[0];
    const b = { ...dummyProperties[0], canonicalId: 'copy-001' };
    const result = checkDuplicate(a, b);
    expect(result).not.toBeNull();
    expect(result!.matchType).toBe('listing_id');
    expect(result!.confidence).toBe(1.0);
  });

  it('should detect address+area+price duplicates', () => {
    const a = dummyProperties[0];
    const b: PropertyCanonical = {
      ...a,
      canonicalId: 'dup-001',
      sourceSite: 'athome',
      listingId: 'AH-DUP',
    };
    const result = checkDuplicate(a, b);
    expect(result).not.toBeNull();
    expect(result!.confidence).toBeGreaterThan(0.8);
  });

  it('should not match different properties', () => {
    const result = checkDuplicate(dummyProperties[0], dummyProperties[1]);
    expect(result).toBeNull();
  });
});

describe('deduplicateProperties', () => {
  it('should not remove non-duplicate properties', () => {
    const { merged, duplicates } = deduplicateProperties(dummyProperties);
    expect(merged.length).toBe(dummyProperties.length);
    expect(duplicates.length).toBe(0);
  });

  it('should merge duplicate properties', () => {
    const dup: PropertyCanonical = {
      ...dummyProperties[0],
      canonicalId: 'dup-test',
      sourceSite: 'athome',
      listingId: 'AH-DUP-TEST',
    };
    const withDup = [...dummyProperties, dup];
    const { merged, duplicates } = deduplicateProperties(withDup);
    expect(merged.length).toBe(dummyProperties.length);
    expect(duplicates.length).toBe(1);
  });
});
