import type { PropertyCanonical } from './canonical-schema.js';
import { normalizeAddress, normalizePropertyName } from '../utils/text-normalizer.js';

/** 重複判定結果 */
export interface DedupeMatch {
  canonicalId: string;
  matchedId: string;
  matchType: 'listing_id' | 'address_area_price' | 'geo_units_price' | 'name_address';
  confidence: number; // 0-1
}

/**
 * 2つの物件が重複かどうかを判定
 */
export function checkDuplicate(a: PropertyCanonical, b: PropertyCanonical): DedupeMatch | null {
  // 同じソース+同じlistingIdなら同一
  if (a.sourceSite === b.sourceSite && a.listingId === b.listingId) {
    return {
      canonicalId: a.canonicalId,
      matchedId: b.canonicalId,
      matchType: 'listing_id',
      confidence: 1.0,
    };
  }

  // 住所 + 建物面積 + 価格の近似一致
  if (a.address && b.address) {
    const addrA = normalizeAddress(a.address);
    const addrB = normalizeAddress(b.address);
    if (addrA === addrB) {
      const areaSimilar = a.buildingAreaSqm && b.buildingAreaSqm
        ? Math.abs(a.buildingAreaSqm - b.buildingAreaSqm) / Math.max(a.buildingAreaSqm, b.buildingAreaSqm) < 0.05
        : false;
      const priceSimilar = Math.abs(a.propertyPriceJpy - b.propertyPriceJpy) / Math.max(a.propertyPriceJpy, b.propertyPriceJpy) < 0.05;
      if (areaSimilar && priceSimilar) {
        return {
          canonicalId: a.canonicalId,
          matchedId: b.canonicalId,
          matchType: 'address_area_price',
          confidence: 0.95,
        };
      }
    }
  }

  // 緯度経度が近い + 戸数一致 + 価格差小
  if (a.lat && a.lng && b.lat && b.lng) {
    const distance = haversineDistance(a.lat, a.lng, b.lat, b.lng);
    if (distance < 50) { // 50m以内
      const unitsMatch = a.totalUnits && b.totalUnits && a.totalUnits === b.totalUnits;
      const priceSimilar = Math.abs(a.propertyPriceJpy - b.propertyPriceJpy) / Math.max(a.propertyPriceJpy, b.propertyPriceJpy) < 0.05;
      if (unitsMatch && priceSimilar) {
        return {
          canonicalId: a.canonicalId,
          matchedId: b.canonicalId,
          matchType: 'geo_units_price',
          confidence: 0.9,
        };
      }
    }
  }

  // 物件名類似 + 住所類似
  if (a.propertyName && b.propertyName && a.address && b.address) {
    const nameA = normalizePropertyName(a.propertyName);
    const nameB = normalizePropertyName(b.propertyName);
    const addrA = normalizeAddress(a.address);
    const addrB = normalizeAddress(b.address);
    if (stringSimilarity(nameA, nameB) > 0.8 && stringSimilarity(addrA, addrB) > 0.8) {
      return {
        canonicalId: a.canonicalId,
        matchedId: b.canonicalId,
        matchType: 'name_address',
        confidence: 0.85,
      };
    }
  }

  return null;
}

/**
 * 物件リストから重複を検出し、主レコードを選択
 */
export function deduplicateProperties(properties: PropertyCanonical[]): {
  merged: PropertyCanonical[];
  duplicates: DedupeMatch[];
} {
  const duplicates: DedupeMatch[] = [];
  const merged: PropertyCanonical[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < properties.length; i++) {
    const a = properties[i];
    if (processed.has(a.canonicalId)) continue;

    let primary = a;
    const group: PropertyCanonical[] = [a];

    for (let j = i + 1; j < properties.length; j++) {
      const b = properties[j];
      if (processed.has(b.canonicalId)) continue;

      const match = checkDuplicate(a, b);
      if (match) {
        duplicates.push(match);
        group.push(b);
        processed.add(b.canonicalId);

        // 情報量が多いほうを主レコードに
        if (countFilledFields(b) > countFilledFields(primary)) {
          primary = b;
        }
      }
    }

    processed.add(primary.canonicalId);
    merged.push(primary);
  }

  return { merged, duplicates };
}

/** フィールドが埋まっている数をカウント */
function countFilledFields(p: PropertyCanonical): number {
  let count = 0;
  const obj = p as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      count++;
    }
  }
  return count;
}

/** Haversine距離（メートル） */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** 簡易文字列類似度（Jaccard係数ベース） */
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const setA = new Set(bigrams(a));
  const setB = new Set(bigrams(b));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

function bigrams(s: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < s.length - 1; i++) {
    result.push(s.slice(i, i + 2));
  }
  return result;
}
