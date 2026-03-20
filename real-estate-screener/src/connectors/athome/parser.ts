import * as cheerio from 'cheerio';
import type { RawListing } from '../types.js';
import type { PropertyCanonical } from '../../core/canonical-schema.js';
import {
  parsePrice,
  parseArea,
  parseYield,
  parseWalkMinutes,
  parseBuiltYear,
  extractWard,
  normalizeStructureType,
  normalizeAddress,
  toHankaku,
} from '../../utils/text-normalizer.js';

/**
 * At Home 投資用不動産の一覧ページHTMLからRawListingを抽出
 */
export function parseListPage(html: string): RawListing[] {
  const $ = cheerio.load(html);
  const listings: RawListing[] = [];

  // 物件カードを取得
  $('[class*="property"], [class*="bukken"], [class*="item"], article').each((_i, el) => {
    try {
      const $el = $(el);
      const text = $el.text();

      // 東京都の物件のみ対象
      if (!text.includes('東京都')) return;

      // 物件詳細リンクからIDを抽出
      const detailLink = $el.find('a[href*="/property/"]').attr('href')
        ?? $el.find('a[href*="/detail/"]').attr('href')
        ?? $el.find('a').first().attr('href')
        ?? '';

      const idMatch = detailLink.match(/\/(?:property|detail)\/(\d+)/);
      if (!idMatch) return;

      const listingId = idMatch[1];
      const sourceUrl = detailLink.startsWith('http')
        ? detailLink
        : `https://toushi-athome.jp${detailLink}`;

      const rawData: Record<string, unknown> = {
        title: $el.find('h2, h3, [class*="name"], [class*="title"]').first().text().trim(),
        detailUrl: sourceUrl,
      };

      // テーブル/リスト形式のデータ抽出
      $el.find('th, dt, [class*="label"]').each((_j, th) => {
        const label = $(th).text().trim();
        const value = $(th).next('td, dd, [class*="data"], [class*="value"]').text().trim()
          || $(th).parent().find('td, dd, [class*="data"]').text().trim();
        if (!label || !value) return;

        assignField(rawData, label, value);
      });

      // テキストからフォールバック抽出
      fallbackExtract(rawData, text);

      if (!rawData.price) return;

      listings.push({
        sourceSite: 'athome',
        sourceUrl,
        listingId,
        fetchedAt: new Date(),
        rawData,
      });
    } catch {
      // パース失敗は無視
    }
  });

  return listings;
}

/**
 * At Home 詳細ページHTMLからデータを抽出
 */
export function parseDetailPage(html: string): Record<string, unknown> {
  const $ = cheerio.load(html);
  const details: Record<string, unknown> = {};

  $('th, dt, [class*="label"]').each((_i, el) => {
    const label = $(el).text().trim();
    const value = $(el).next('td, dd').text().trim();
    if (!label || !value) return;
    assignField(details, label, value);
  });

  return details;
}

function assignField(data: Record<string, unknown>, label: string, value: string): void {
  switch (true) {
    case /価格|販売価格/.test(label):
      data.price = value; break;
    case /利回り/.test(label) && /表面/.test(label):
      data.grossYield = value; break;
    case /利回り/.test(label):
      data.yield = data.yield || value; break;
    case /所在地|住所/.test(label):
      data.address = value; break;
    case /交通|アクセス|沿線/.test(label):
      data.transport = value; break;
    case /築年/.test(label):
      data.builtDate = value; break;
    case /構造/.test(label):
      data.structure = value; break;
    case /土地面積|土地/.test(label) && /面積/.test(label):
      data.landArea = value; break;
    case /建物面積|延床|専有/.test(label):
      data.buildingArea = value; break;
    case /総戸数/.test(label):
      data.totalUnits = value; break;
    case /間取り|内訳/.test(label):
      data.roomBreakdown = value; break;
    case /階数|階建/.test(label):
      data.floors = value; break;
    case /用途地域/.test(label):
      data.zoning = value; break;
    case /建ぺい率|建蔽率/.test(label):
      data.coverageRatio = value; break;
    case /容積率/.test(label):
      data.floorAreaRatio = value; break;
    case /接道/.test(label):
      data.roadAccess = value; break;
    case /権利/.test(label):
      data.landRight = value; break;
    case /現況.*賃料|現行.*賃料/.test(label):
      data.currentRent = value; break;
    case /満室.*賃料|想定.*賃料/.test(label):
      data.fullRent = value; break;
    case /空室/.test(label):
      data.vacancy = value; break;
    case /入居率/.test(label):
      data.occupancyRate = value; break;
    case /取扱|仲介|会社/.test(label):
      data.broker = value; break;
  }
}

function fallbackExtract(data: Record<string, unknown>, text: string): void {
  const s = toHankaku(text);
  if (!data.price) {
    const m = s.match(/(?:価格|販売価格)[:\s]*([\d,億万.]+円)/);
    if (m) data.price = m[1];
  }
  if (!data.yield) {
    const m = s.match(/利回り[:\s]*([\d.]+)%/);
    if (m) data.yield = `${m[1]}%`;
  }
  if (!data.address) {
    const m = s.match(/(東京都[^\s,、]+)/);
    if (m) data.address = m[1];
  }
}

/**
 * RawListing を PropertyCanonical に変換
 */
export function normalizeAthomeListing(raw: RawListing): Partial<PropertyCanonical> | null {
  const d = raw.rawData;

  const address = String(d.address ?? '');
  if (!address.includes('東京都')) return null;

  const ward = extractWard(address);
  if (!ward) return null;

  const priceJpy = parsePrice(String(d.price ?? ''));
  if (!priceJpy) return null;

  // 交通情報パース
  const transport = String(d.transport ?? '');
  const station1 = parseTransport(transport);

  // 面積
  const buildingArea = parseArea(String(d.buildingArea ?? ''));
  const landArea = parseArea(String(d.landArea ?? ''));

  // 築年月
  const builtInfo = parseBuiltYear(String(d.builtDate ?? ''));

  // 戸数
  const unitsMatch = toHankaku(String(d.totalUnits ?? '')).match(/(\d+)\s*戸/);
  const totalUnits = unitsMatch ? parseInt(unitsMatch[1], 10) : null;

  // 階数
  const floorsMatch = toHankaku(String(d.floors ?? '')).match(/(\d+)\s*階建/);
  const totalFloors = floorsMatch ? parseInt(floorsMatch[1], 10) : null;

  // 利回り → 年間家賃逆算
  const yieldPct = parseYield(String(d.yield ?? d.grossYield ?? ''));
  const annualFullRentJpy = yieldPct && priceJpy ? (yieldPct / 100) * priceJpy : null;
  const currentRentJpy = d.currentRent ? parsePrice(String(d.currentRent)) : null;

  // 空室
  let vacantUnits: number | null = null;
  let occupancyRate: number | null = null;
  if (d.vacancy) {
    const vm = toHankaku(String(d.vacancy)).match(/(\d+)\s*戸/);
    if (vm) vacantUnits = parseInt(vm[1], 10);
  }
  if (d.occupancyRate) {
    const om = toHankaku(String(d.occupancyRate)).match(/([\d.]+)\s*%/);
    if (om) occupancyRate = parseFloat(om[1]);
  }
  if (totalUnits && vacantUnits !== null) {
    occupancyRate = ((totalUnits - vacantUnits) / totalUnits) * 100;
  }

  // 接道
  let roadWidth: number | null = null;
  if (d.roadAccess) {
    const rm = toHankaku(String(d.roadAccess)).match(/([\d.]+)\s*m/i);
    if (rm) roadWidth = parseFloat(rm[1]);
  }

  // 建ぺい率・容積率
  let coverageRatio: number | null = null;
  let floorAreaRatio: number | null = null;
  if (d.coverageRatio) {
    const cm = toHankaku(String(d.coverageRatio)).match(/([\d.]+)/);
    if (cm) coverageRatio = parseFloat(cm[1]);
  }
  if (d.floorAreaRatio) {
    const fm = toHankaku(String(d.floorAreaRatio)).match(/([\d.]+)/);
    if (fm) floorAreaRatio = parseFloat(fm[1]);
  }

  return {
    canonicalId: `athome-${raw.listingId}`,
    propertyName: String(d.title ?? ''),
    prefecture: '東京都',
    ward,
    address: normalizeAddress(address),
    structureType: normalizeStructureType(String(d.structure ?? '')) as any,
    builtYear: builtInfo?.year,
    builtMonth: builtInfo?.month,
    landAreaSqm: landArea ?? undefined,
    buildingAreaSqm: buildingArea ?? undefined,
    totalFloors: totalFloors ?? undefined,
    totalUnits: totalUnits ?? undefined,
    roomBreakdown: d.roomBreakdown ? String(d.roomBreakdown) : undefined,
    vacantUnits: vacantUnits ?? undefined,
    occupancyRate: occupancyRate ?? undefined,
    occupiedUnits: totalUnits && vacantUnits !== null ? totalUnits - vacantUnits : undefined,
    station1: station1 ?? undefined,
    propertyPriceJpy: priceJpy,
    annualFullRentJpy: annualFullRentJpy ?? undefined,
    annualCurrentRentJpy: currentRentJpy ?? undefined,
    expenseRatioPct: 16.0,
    loanInterestPct: 1.5,
    loanYears: 30,
    zoning: d.zoning ? String(d.zoning) : undefined,
    coverageRatio: coverageRatio ?? undefined,
    floorAreaRatio: floorAreaRatio ?? undefined,
    roadWidth: roadWidth ?? undefined,
    landRightType: d.landRight ? String(d.landRight) : undefined,
    brokerName: d.broker ? String(d.broker) : undefined,
    hasOccupancyInfo: vacantUnits !== null || occupancyRate !== null,
    hasRouteValue: false,
    hasTaxInfo: false,
    sourceSite: 'athome',
    sourceUrl: raw.sourceUrl,
    listingId: raw.listingId,
  };
}

function parseTransport(transport: string): { line?: string; name?: string; walkMin?: number } | null {
  if (!transport) return null;
  const s = toHankaku(transport);

  const match = s.match(/(.+?線)\s+(.+?駅)\s+徒歩\s*(\d+)\s*分/);
  if (match) {
    return { line: match[1].trim(), name: match[2].replace(/駅$/, '').trim(), walkMin: parseInt(match[3], 10) };
  }

  const match2 = s.match(/(.+?駅)\s+徒歩\s*(\d+)\s*分/);
  if (match2) {
    return { name: match2[1].replace(/駅$/, '').trim(), walkMin: parseInt(match2[2], 10) };
  }

  const match3 = s.match(/「(.+?)」\s*(?:駅\s*)?徒歩\s*(\d+)\s*分/);
  if (match3) {
    return { name: match3[1], walkMin: parseInt(match3[2], 10) };
  }

  return null;
}
