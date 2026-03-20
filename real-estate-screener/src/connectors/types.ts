import type { PropertyCanonical } from '../core/canonical-schema.js';

/** コネクタインターフェース */
export interface SiteConnector {
  /** サイト名 */
  siteName: string;

  /**
   * 物件一覧を取得
   * @returns 正規化前の物件データ配列
   */
  fetchListings(options?: CrawlOptions): Promise<RawListing[]>;
}

/** クロールオプション */
export interface CrawlOptions {
  maxPages?: number;
  areaFilter?: string[];
  minPrice?: number;
  maxPrice?: number;
}

/** 生データ（サイトから取得した未加工データ） */
export interface RawListing {
  sourceSite: string;
  sourceUrl: string;
  listingId: string;
  fetchedAt: Date;
  rawData: Record<string, unknown>;
}

/** パーサーインターフェース */
export interface ListingParser {
  /** 生データを正規化物件データに変換 */
  parse(raw: RawListing): Partial<PropertyCanonical> | null;
}
