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
 * 楽待の一覧ページHTMLからRawListingを抽出
 */
export function parseListPage(html: string): RawListing[] {
  const $ = cheerio.load(html);
  const listings: RawListing[] = [];

  // 物件カードを取得（一覧ページの各物件ブロック）
  $('div[class*="property"]').each((_i, el) => {
    try {
      const $el = $(el);

      // 物件詳細リンクからIDを抽出
      const detailLink = $el.find('a[href*="/syuuekibukken/"]').attr('href') ?? '';
      const idMatch = detailLink.match(/\/(\d+)\/show\.html/);
      if (!idMatch) return;

      const listingId = idMatch[1];
      const sourceUrl = detailLink.startsWith('http')
        ? detailLink
        : `https://www.rakumachi.jp${detailLink}`;

      // テキスト全体を取得
      const text = $el.text();

      // 基本情報抽出
      const rawData: Record<string, unknown> = {
        title: extractField($el, $, '物件名') || $el.find('h2, h3, .property-name').first().text().trim(),
        price: extractField($el, $, '価格'),
        yield: extractField($el, $, '利回り'),
        address: extractField($el, $, '所在地'),
        transport: extractField($el, $, '交通'),
        builtDate: extractField($el, $, '築年月'),
        totalUnits: extractField($el, $, '総戸数'),
        structure: extractField($el, $, '建物構造') || extractField($el, $, '構造'),
        area: extractField($el, $, '面積'),
        floors: extractField($el, $, '階数'),
        detailUrl: sourceUrl,
      };

      // テキストからフォールバック抽出
      if (!rawData.price) {
        const priceMatch = text.match(/価格\s*([\d,億万.]+円)/);
        if (priceMatch) rawData.price = priceMatch[1];
      }
      if (!rawData.yield) {
        const yieldMatch = text.match(/利回り\s*([\d.]+%)/);
        if (yieldMatch) rawData.yield = yieldMatch[1];
      }
      if (!rawData.address) {
        const addrMatch = text.match(/(東京都[^\s]+)/);
        if (addrMatch) rawData.address = addrMatch[1];
      }

      listings.push({
        sourceSite: 'rakumachi',
        sourceUrl,
        listingId,
        fetchedAt: new Date(),
        rawData,
      });
    } catch {
      // 個別パース失敗は無視
    }
  });

  return listings;
}

/**
 * 楽待HTMLからフィールド値を抽出
 */
function extractField($el: ReturnType<cheerio.CheerioAPI>, $: cheerio.CheerioAPI, label: string): string | null {
  // "ラベル" の隣or次の要素のテキストを取得
  let value: string | null = null;

  $el.find('th, dt, span, div').each((_i, th) => {
    const thText = $(th).text().trim();
    if (thText === label || thText.includes(label)) {
      const next = $(th).next('td, dd, span, div');
      if (next.length > 0) {
        value = next.text().trim();
      }
    }
  });

  return value;
}

/**
 * 一覧ページから次のページURLを取得
 */
export function extractNextPageUrl(html: string, currentPage: number): string | null {
  const $ = cheerio.load(html);
  const nextPage = currentPage + 1;

  // ページネーションリンクから次ページを探す
  let nextUrl: string | null = null;
  $('a[href*="page="]').each((_i, el) => {
    const href = $(el).attr('href') ?? '';
    if (href.includes(`page=${nextPage}`)) {
      nextUrl = href.startsWith('http') ? href : `https://www.rakumachi.jp${href}`;
    }
  });

  return nextUrl;
}

/**
 * 楽待の詳細ページHTMLから追加情報を抽出
 */
export function parseDetailPage(html: string): Record<string, unknown> {
  const $ = cheerio.load(html);
  const details: Record<string, unknown> = {};
  const text = $('body').text();

  // テーブル行からデータ抽出
  $('th, dt').each((_i, el) => {
    const label = $(el).text().trim();
    const value = $(el).next('td, dd').text().trim();
    if (!label || !value) return;

    switch (true) {
      case label.includes('価格') || label.includes('販売価格'):
        details.price = value;
        break;
      case label.includes('利回り') && label.includes('表面'):
        details.grossYield = value;
        break;
      case label.includes('利回り'):
        details.yield = value;
        break;
      case label.includes('所在地') || label.includes('住所'):
        details.address = value;
        break;
      case label.includes('交通') || label.includes('アクセス'):
        details.transport = value;
        break;
      case label.includes('築年'):
        details.builtDate = value;
        break;
      case label.includes('構造'):
        details.structure = value;
        break;
      case label.includes('土地面積') || label.includes('土地'):
        details.landArea = value;
        break;
      case label.includes('建物面積') || label.includes('延床'):
        details.buildingArea = value;
        break;
      case label.includes('総戸数'):
        details.totalUnits = value;
        break;
      case label.includes('間取り') || label.includes('内訳'):
        details.roomBreakdown = value;
        break;
      case label.includes('階数') || label.includes('階建'):
        details.floors = value;
        break;
      case label.includes('用途地域'):
        details.zoning = value;
        break;
      case label.includes('建ぺい率'):
        details.coverageRatio = value;
        break;
      case label.includes('容積率'):
        details.floorAreaRatio = value;
        break;
      case label.includes('接道'):
        details.roadAccess = value;
        break;
      case label.includes('権利'):
        details.landRight = value;
        break;
      case label.includes('現況') && label.includes('賃料'):
        details.currentRent = value;
        break;
      case label.includes('満室') && label.includes('賃料'):
        details.fullRent = value;
        break;
      case label.includes('空室'):
        details.vacancy = value;
        break;
      case label.includes('入居率'):
        details.occupancyRate = value;
        break;
      case label.includes('管理会社') || label.includes('取扱'):
        details.broker = value;
        break;
    }
  });

  // 面積の統合パース（「建物117.19㎡ / 土地 84.84㎡」パターン）
  const areaMatch = text.match(/建物\s*([\d.]+)\s*㎡\s*[/／]\s*土地\s*([\d.]+)\s*㎡/);
  if (areaMatch) {
    details.buildingArea = details.buildingArea || `${areaMatch[1]}㎡`;
    details.landArea = details.landArea || `${areaMatch[2]}㎡`;
  }

  return details;
}

/**
 * RawListing を PropertyCanonical に変換
 */
export function normalizeRakumachiListing(raw: RawListing): Partial<PropertyCanonical> | null {
  const d = raw.rawData;

  const address = String(d.address ?? '');
  if (!address.includes('東京都')) return null; // 東京都以外は除外

  const ward = extractWard(address);
  if (!ward) return null; // 23区以外は除外

  const priceJpy = parsePrice(String(d.price ?? ''));
  if (!priceJpy) return null;

  // 交通情報パース
  const transport = String(d.transport ?? '');
  const station1 = parseTransport(transport);

  // 面積パース
  const areaStr = String(d.area ?? '');
  let landArea: number | null = null;
  let buildingArea: number | null = null;

  const areaMatch = toHankaku(areaStr).match(/建物\s*([\d.]+)\s*㎡?\s*[/／]\s*土地\s*([\d.]+)\s*㎡?/);
  if (areaMatch) {
    buildingArea = parseFloat(areaMatch[1]);
    landArea = parseFloat(areaMatch[2]);
  } else {
    buildingArea = parseArea(String(d.buildingArea ?? areaStr));
    landArea = parseArea(String(d.landArea ?? ''));
  }

  // 築年月パース
  const builtInfo = parseBuiltYear(String(d.builtDate ?? ''));

  // 総戸数パース
  const unitsMatch = toHankaku(String(d.totalUnits ?? '')).match(/(\d+)\s*戸/);
  const totalUnits = unitsMatch ? parseInt(unitsMatch[1], 10) : null;

  // 階数パース
  const floorsMatch = toHankaku(String(d.floors ?? '')).match(/(\d+)\s*階建/);
  const totalFloors = floorsMatch ? parseInt(floorsMatch[1], 10) : null;

  // 利回りパース
  const yieldPct = parseYield(String(d.yield ?? d.grossYield ?? ''));
  const annualFullRentJpy = yieldPct && priceJpy ? (yieldPct / 100) * priceJpy : null;

  // 現況賃料パース
  const currentRentJpy = d.currentRent ? parsePrice(String(d.currentRent)) : null;

  // 空室パース
  let vacantUnits: number | null = null;
  let occupancyRate: number | null = null;
  if (d.vacancy) {
    const vacMatch = toHankaku(String(d.vacancy)).match(/(\d+)\s*戸/);
    if (vacMatch) vacantUnits = parseInt(vacMatch[1], 10);
  }
  if (d.occupancyRate) {
    const occMatch = toHankaku(String(d.occupancyRate)).match(/([\d.]+)\s*%/);
    if (occMatch) occupancyRate = parseFloat(occMatch[1]);
  }
  if (totalUnits && vacantUnits !== null) {
    occupancyRate = ((totalUnits - vacantUnits) / totalUnits) * 100;
  }

  // 接道パース
  let roadWidth: number | null = null;
  if (d.roadAccess) {
    const roadMatch = toHankaku(String(d.roadAccess)).match(/([\d.]+)\s*m/i);
    if (roadMatch) roadWidth = parseFloat(roadMatch[1]);
  }

  // 用途地域・建ぺい率・容積率
  let coverageRatio: number | null = null;
  let floorAreaRatio: number | null = null;
  if (d.coverageRatio) {
    const covMatch = toHankaku(String(d.coverageRatio)).match(/([\d.]+)/);
    if (covMatch) coverageRatio = parseFloat(covMatch[1]);
  }
  if (d.floorAreaRatio) {
    const farMatch = toHankaku(String(d.floorAreaRatio)).match(/([\d.]+)/);
    if (farMatch) floorAreaRatio = parseFloat(farMatch[1]);
  }

  return {
    canonicalId: `rakumachi-${raw.listingId}`,
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
    reBuildable: undefined, // 詳細ページで判定
    zoning: d.zoning ? String(d.zoning) : undefined,
    coverageRatio: coverageRatio ?? undefined,
    floorAreaRatio: floorAreaRatio ?? undefined,
    roadWidth: roadWidth ?? undefined,
    landRightType: d.landRight ? String(d.landRight) : undefined,
    brokerName: d.broker ? String(d.broker) : undefined,
    hasOccupancyInfo: vacantUnits !== null || occupancyRate !== null,
    hasRouteValue: false,
    hasTaxInfo: false,
    sourceSite: 'rakumachi',
    sourceUrl: raw.sourceUrl,
    listingId: raw.listingId,
  };
}

/**
 * 交通情報をパース
 * "西武新宿線 井荻駅 徒歩9分" → { line, name, walkMin }
 */
function parseTransport(transport: string): { line?: string; name?: string; walkMin?: number } | null {
  if (!transport) return null;
  const s = toHankaku(transport);

  // "○○線 ○○駅 徒歩N分" パターン
  const match = s.match(/(.+?線)\s+(.+?駅)\s+徒歩\s*(\d+)\s*分/);
  if (match) {
    return {
      line: match[1].trim(),
      name: match[2].replace(/駅$/, '').trim(),
      walkMin: parseInt(match[3], 10),
    };
  }

  // "○○駅 徒歩N分" パターン（路線名なし）
  const match2 = s.match(/(.+?駅)\s+徒歩\s*(\d+)\s*分/);
  if (match2) {
    return {
      name: match2[1].replace(/駅$/, '').trim(),
      walkMin: parseInt(match2[2], 10),
    };
  }

  return null;
}
