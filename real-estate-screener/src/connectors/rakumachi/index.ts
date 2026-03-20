import type { SiteConnector, RawListing, CrawlOptions } from '../types.js';
import { parseListPage, parseDetailPage } from './parser.js';
import { RateLimiter, withRetry } from '../../utils/rate-limit.js';
import { defaultConfig } from '../../config/default.js';
import logger from '../../utils/logger.js';

// 1棟アパート(t1=40) + 1棟マンション(t2=41)、東京都(prefecture=13)
// 価格帯: p1=1500(万円) ~ p2=15000(万円)
const BASE_URL = 'https://www.rakumachi.jp/syuuekibukken/area/prefecture/dimAll';
const DEFAULT_PARAMS: Record<string, string> = {
  prefecture: '13',
  t1: '40',   // 1棟アパート
  t2: '41',   // 1棟マンション
  p1: '1500', // 下限1500万
  p2: '15000',// 上限1.5億
  sort: 'property_created_at',
  sort_type: 'desc',
};

/**
 * 楽待コネクタ
 * 公開検索ページから1棟アパート・1棟マンションの東京23区物件を取得
 */
export class RakumachiConnector implements SiteConnector {
  siteName = 'rakumachi';
  private rateLimiter = new RateLimiter(defaultConfig.crawl.intervalMs);

  async fetchListings(options?: CrawlOptions): Promise<RawListing[]> {
    const maxPages = options?.maxPages ?? defaultConfig.crawl.maxPages;
    const results: RawListing[] = [];

    logger.info(`[Rakumachi] Starting crawl, maxPages=${maxPages}`);

    for (let page = 1; page <= maxPages; page++) {
      try {
        await this.rateLimiter.wait();

        const listings = await withRetry(
          () => this.fetchPage(page),
          {
            maxRetries: defaultConfig.crawl.maxRetries,
            delayMs: defaultConfig.crawl.retryDelayMs,
            onRetry: (err, attempt) => {
              logger.warn(`[Rakumachi] Retry page ${page}, attempt ${attempt}: ${err.message}`);
            },
          },
        );

        if (listings.length === 0) {
          logger.info(`[Rakumachi] No more listings at page ${page}, stopping`);
          break;
        }

        results.push(...listings);
        logger.info(`[Rakumachi] Page ${page}: ${listings.length} listings fetched (total: ${results.length})`);
      } catch (error) {
        logger.error(`[Rakumachi] Failed to fetch page ${page}`, { error: String(error) });
        continue;
      }
    }

    logger.info(`[Rakumachi] Crawl complete, total ${results.length} listings`);
    return results;
  }

  private async fetchPage(page: number): Promise<RawListing[]> {
    const params = new URLSearchParams({ ...DEFAULT_PARAMS, page: String(page) });
    const url = `${BASE_URL}?${params.toString()}`;

    logger.debug(`[Rakumachi] Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': defaultConfig.crawl.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return parseListPage(html);
  }

  /**
   * 個別物件の詳細ページを取得して情報を補完
   */
  async fetchDetail(sourceUrl: string): Promise<Record<string, unknown>> {
    await this.rateLimiter.wait();

    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': defaultConfig.crawl.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja,en;q=0.5',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return parseDetailPage(html);
  }
}

export default RakumachiConnector;
