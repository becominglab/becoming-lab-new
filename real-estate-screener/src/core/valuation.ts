import type { PropertyCanonical, ValuationResult } from './canonical-schema.js';

/** 構造別の耐用年数 */
const DURABLE_YEARS: Record<string, number> = {
  'RC': 47,
  'SRC': 47,
  'S': 34,
  'W': 22,
  'W劣': 30,
};

/** 構造別の建物評価単価 (円/㎡) */
const BUILDING_UNIT_PRICE: Record<string, number> = {
  'RC': 200_000,
  'SRC': 200_000,
  'S': 180_000,
  'W': 150_000,
  'W劣': 150_000,
};

/**
 * 築年数を計算
 */
export function calcAgeYears(builtYear: number, builtMonth?: number, referenceYear?: number): number {
  const now = referenceYear ?? new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  let age = now - builtYear;
  if (builtMonth && builtMonth > currentMonth) {
    age -= 1;
  }
  return Math.max(age, 0);
}

/**
 * 耐用年数を取得
 */
export function getDurableYears(structureType: string): number {
  return DURABLE_YEARS[structureType] ?? 22; // デフォルトは木造
}

/**
 * 建物評価単価を取得
 */
export function getBuildingUnitPrice(structureType: string): number {
  return BUILDING_UNIT_PRICE[structureType] ?? 150_000;
}

/**
 * 積算評価を計算
 *
 * 土地積算 = 土地面積(㎡) × 路線価(円/㎡)
 * 建物積算 = (延床面積(㎡) × 建物評価単価 × max(耐用年数 - 築年数, 0)) / 耐用年数
 * 積算比率 = (土地積算 + 建物積算) / 物件価格 × 100
 */
export function calcValuation(property: PropertyCanonical): ValuationResult {
  const structureType = property.structureType ?? 'W';
  const durableYears = getDurableYears(structureType);

  // 築年数
  const ageYears = property.builtYear ? calcAgeYears(property.builtYear, property.builtMonth) : null;
  const remainingYears = ageYears !== null ? Math.max(durableYears - ageYears, 0) : null;

  // 土地積算
  const landValuationJpy = (property.landAreaSqm && property.roadValueJpyPerSqm)
    ? property.landAreaSqm * property.roadValueJpyPerSqm
    : null;

  // 建物積算
  let buildingValuationJpy: number | null = null;
  if (property.buildingAreaSqm && ageYears !== null) {
    const unitPrice = getBuildingUnitPrice(structureType);
    buildingValuationJpy = (property.buildingAreaSqm * unitPrice * Math.max(durableYears - ageYears, 0)) / durableYears;
  }

  // 積算合計・比率
  let totalValuationJpy: number | null = null;
  let valuationRatioPct: number | null = null;

  if (landValuationJpy !== null || buildingValuationJpy !== null) {
    totalValuationJpy = (landValuationJpy ?? 0) + (buildingValuationJpy ?? 0);
    valuationRatioPct = (totalValuationJpy / property.propertyPriceJpy) * 100;
  }

  return {
    landValuationJpy,
    buildingValuationJpy,
    totalValuationJpy,
    valuationRatioPct,
    durableYears,
    ageYears,
    remainingYears,
  };
}

/**
 * 土地値比率を計算（土地積算 / 物件価格）
 */
export function calcLandValueRatio(property: PropertyCanonical): number | null {
  if (!property.landAreaSqm || !property.roadValueJpyPerSqm) return null;
  const landValue = property.landAreaSqm * property.roadValueJpyPerSqm;
  return (landValue / property.propertyPriceJpy) * 100;
}
