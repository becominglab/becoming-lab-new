import { RakumachiConnector } from '../connectors/rakumachi/index.js';
import { AtHomeConnector } from '../connectors/athome/index.js';
import { prisma } from '../db/client.js';
import logger from '../utils/logger.js';
import * as crypto from 'node:crypto';

async function main() {
  logger.info('=== Crawl All Sites ===');

  const connectors = [
    new RakumachiConnector(),
    // AtHome は 405 エラーを返すため一時無効化
    // new AtHomeConnector(),
  ];

  let totalFetched = 0;
  let totalSaved = 0;
  let totalErrors = 0;

  for (const connector of connectors) {
    try {
      logger.info(`Crawling ${connector.siteName}...`);
      const listings = await connector.fetchListings();
      logger.info(`${connector.siteName}: ${listings.length} listings fetched`);
      totalFetched += listings.length;

      // ListingRaw テーブルに保存
      for (const listing of listings) {
        try {
          const rawJson = JSON.stringify(listing.rawData);
          const htmlHash = crypto.createHash('md5').update(rawJson).digest('hex');

          await prisma.listingRaw.upsert({
            where: {
              sourceSite_listingId: {
                sourceSite: listing.sourceSite,
                listingId: listing.listingId,
              },
            },
            update: {
              rawJson,
              htmlHash,
              fetchedAt: listing.fetchedAt,
              status: 'pending',
              errorMessage: null,
            },
            create: {
              sourceSite: listing.sourceSite,
              sourceUrl: listing.sourceUrl,
              listingId: listing.listingId,
              fetchedAt: listing.fetchedAt,
              rawJson,
              htmlHash,
              status: 'pending',
            },
          });
          totalSaved++;
        } catch (error) {
          logger.error(`Failed to save listing ${listing.listingId}`, { error: String(error) });
          totalErrors++;
        }
      }
    } catch (error) {
      logger.error(`Failed to crawl ${connector.siteName}`, { error: String(error) });
      totalErrors++;
    }
  }

  logger.info(`=== Crawl Complete: fetched=${totalFetched}, saved=${totalSaved}, errors=${totalErrors} ===`);
  return { totalFetched, totalSaved, totalErrors };
}

export { main as crawlAll };

if (process.argv[1]?.endsWith('crawl-all.ts')) {
  main().catch(error => {
    logger.error('Crawl failed', { error: String(error) });
    process.exit(1);
  });
}
