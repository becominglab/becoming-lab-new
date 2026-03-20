import { describe, it, expect } from 'vitest';
import { normalizeRakumachiListing } from '../connectors/rakumachi/parser.js';
import { normalizeAthomeListing } from '../connectors/athome/parser.js';
import type { RawListing } from '../connectors/types.js';

describe('normalizeRakumachiListing', () => {
  it('should normalize a valid Tokyo listing', () => {
    const raw: RawListing = {
      sourceSite: 'rakumachi',
      sourceUrl: 'https://www.rakumachi.jp/syuuekibukken/kanto/tokyo/dim4001/12345/show.html',
      listingId: '12345',
      fetchedAt: new Date(),
      rawData: {
        title: 'テストレジデンス杉並',
        price: '8380万円',
        yield: '6.97%',
        address: '東京都杉並区上井草１丁目',
        transport: '西武新宿線 井荻駅 徒歩9分',
        builtDate: '2015年01月（築12年）',
        totalUnits: '11戸',
        structure: '木造',
        area: '建物117.19㎡ / 土地 84.84㎡',
        floors: '2階建て',
      },
    };

    const result = normalizeRakumachiListing(raw);
    expect(result).not.toBeNull();
    expect(result!.canonicalId).toBe('rakumachi-12345');
    expect(result!.propertyName).toBe('テストレジデンス杉並');
    expect(result!.ward).toBe('杉並区');
    expect(result!.propertyPriceJpy).toBe(83_800_000);
    expect(result!.structureType).toBe('W');
    expect(result!.builtYear).toBe(2015);
    expect(result!.builtMonth).toBe(1);
    expect(result!.totalUnits).toBe(11);
    expect(result!.buildingAreaSqm).toBeCloseTo(117.19);
    expect(result!.landAreaSqm).toBeCloseTo(84.84);
    expect(result!.station1?.name).toBe('井荻');
    expect(result!.station1?.walkMin).toBe(9);
    expect(result!.station1?.line).toBe('西武新宿線');
    expect(result!.annualFullRentJpy).toBeCloseTo(83_800_000 * 0.0697, -3);
  });

  it('should return null for non-Tokyo listing', () => {
    const raw: RawListing = {
      sourceSite: 'rakumachi',
      sourceUrl: 'https://example.com',
      listingId: '99999',
      fetchedAt: new Date(),
      rawData: {
        title: 'テスト',
        price: '5000万円',
        address: '大阪府大阪市中央区',
      },
    };

    const result = normalizeRakumachiListing(raw);
    expect(result).toBeNull();
  });

  it('should return null for non-23-ward listing', () => {
    const raw: RawListing = {
      sourceSite: 'rakumachi',
      sourceUrl: 'https://example.com',
      listingId: '99998',
      fetchedAt: new Date(),
      rawData: {
        title: 'テスト',
        price: '5000万円',
        address: '東京都八王子市元横山町',
      },
    };

    const result = normalizeRakumachiListing(raw);
    expect(result).toBeNull();
  });
});

describe('normalizeAthomeListing', () => {
  it('should normalize a valid listing', () => {
    const raw: RawListing = {
      sourceSite: 'athome',
      sourceUrl: 'https://toushi-athome.jp/property/67890',
      listingId: '67890',
      fetchedAt: new Date(),
      rawData: {
        title: 'テストマンション新宿',
        price: '1億2000万円',
        yield: '7.5%',
        address: '東京都新宿区百人町2-5-10',
        transport: 'JR山手線 新大久保駅 徒歩5分',
        builtDate: '2010年11月',
        totalUnits: '8戸',
        structure: '鉄骨造',
        buildingArea: '200㎡',
        landArea: '80㎡',
        floors: '4階建て',
      },
    };

    const result = normalizeAthomeListing(raw);
    expect(result).not.toBeNull();
    expect(result!.canonicalId).toBe('athome-67890');
    expect(result!.ward).toBe('新宿区');
    expect(result!.propertyPriceJpy).toBe(120_000_000);
    expect(result!.structureType).toBe('S');
    expect(result!.totalUnits).toBe(8);
    expect(result!.station1?.name).toBe('新大久保');
    expect(result!.station1?.walkMin).toBe(5);
  });
});
