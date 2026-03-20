import type { SiteConnector, RawListing, CrawlOptions } from '../types.js';
import { parseListPage, parseDetailPage } from './parser.js';
import { RateLimiter, withRetry } from '../../utils/rate-limit.js';
import { defaultConfig } from '../../config/default.js';
import logger from '../../utils/logger.js';

// At Home 投資用不動産 検索URL
// b_type_ids[]=2 (1棟アパート), b_type_ids[]=3 (1棟マンション)
const BASE_URL = 'https://toushi-athome.jp/property_list/';
const USE_PLAYWRIGHT = process.env.USE_PLAYWRIGHT === 'true';

/**
 * At Home 投資用不動産コネクタ
 * JS レンダリングが必要なため Playwright を使用
 * Playwright が無効な場合は fetch でフォールバック
 */
export class AtHomeConnector implements SiteConnector {
  siteName = 'athome';
  private rateLimiter = new RateLimiter(defaultConfig.crawl.intervalMs);

  async fetchListings(options?: CrawlOptions): Promise<RawListing[]> {
    const maxPages = options?.maxPages ?? defaultConfig.crawl.maxPages;
    const results: RawListing[] = [];

    logger.info(`[AtHome] Starting crawl, maxPages=${maxPages}, playwright=${USE_PLAYWRIGHT}`);

    if (USE_PLAYWRIGHT) {
      return this.fetchWithPlaywright(maxPages);
    }

    // fetch フォールバック
    for (let page = 1; page <= maxPages; page++) {
      try {
        await this.rateLimiter.wait();

        const listings = await withRetry(
          () => this.fetchPage(page),
          {
            maxRetries: defaultConfig.crawl.maxRetries,
            delayMs: defaultConfig.crawl.retryDelayMs,
            onRetry: (err, attempt) => {
              logger.warn(`[AtHome] Retry page ${page}, attempt ${attempt}: ${err.message}`);
            },
          },
        );

        if (listings.length === 0) {
          logger.info(`[AtHome] No more listings at page ${page}, stopping`);
          break;
        }
        results.push(...listings);
        logger.info(`[AtHome] Page ${page}: ${listings.length} listings fetched (total: ${results.length})`);
      } catch (error) {
        logger.error(`[AtHome] Failed to fetch page ${page}`, { error: String(error) });
        continue;
      }
    }

    logger.info(`[AtHome] Crawl complete, total ${results.length} listings`);
    return results;
  }

  private async fetchPage(page: number): Promise<RawListing[]> {
    const params = new URLSearchParams({
      'prefecture_ids[]': '13',
      'b_type_ids[]': '2', // 1棟アパート
      page: String(page),
      sort: '1', // 新着順
    });
    // 1棟マンションも追加
    params.append('b_type_ids[]', '3');

    const url = `${BASE_URL}?${params.toString()}`;
    logger.debug(`[AtHome] Fetching: ${url}`);

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
   * Playwright を使ってJS レンダリング後のHTMLを取得
   */
  private async fetchWithPlaywright(maxPages: number): Promise<RawListing[]> {
    const results: RawListing[] = [];

    let browser;
    try {
      const { chromium } = await import('playwright');
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: defaultConfig.crawl.userAgent,
        locale: 'ja-JP',
      });
      const page = await context.newPage();

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        try {
          await this.rateLimiter.wait();

          const params = new URLSearchParams({
            'prefecture_ids[]': '13',
            'b_type_ids[]': '2',
            page: String(pageNum),
            sort: '1',
          });
          params.append('b_type_ids[]', '3');

          const url = `${BASE_URL}?${params.toString()}`;
          logger.debug(`[AtHome] Playwright fetching: ${url}`);

          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          const html = await page.content();
          const listings = parseListPage(html);

          if (listings.length === 0) {
            logger.info(`[AtHome] No more listings at page ${pageNum}, stopping`);
            break;
          }

          results.push(...listings);
          logger.info(`[AtHome] Page ${pageNum}: ${listings.length} listings (total: ${results.length})`);
        } catch (error) {
          logger.error(`[AtHome] Playwright failed page ${pageNum}`, { error: String(error) });
          continue;
        }
      }

      await browser.close();
    } catch (error) {
      logger.error('[AtHome] Playwright initialization failed, falling back to fetch', { error: String(error) });
      if (browser) await browser.close();
      return this.fetchListings({ maxPages });
    }

    logger.info(`[AtHome] Playwright crawl complete, total ${results.length} listings`);
    return results;
  }

  /**
   * 詳細ページを取得
   */
  async fetchDetail(sourceUrl: string): Promise<Record<string, unknown>> {
    await this.rateLimiter.wait();

    if (USE_PLAYWRIGHT) {
      try {
        const { chromium } = await import('playwright');
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(sourceUrl, { waitUntil: 'networkidle', timeout: 30000 });
        const html = await page.content();
        await browser.close();
        return parseDetailPage(html);
      } catch (error) {
        logger.error(`[AtHome] Playwright detail fetch failed: ${sourceUrl}`, { error: String(error) });
      }
    }

    const response = await fetch(sourceUrl, {
      headers: {
        'User-Agent': defaultConfig.crawl.userAgent,
        'Accept': 'text/html',
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

export default AtHomeConnector;
