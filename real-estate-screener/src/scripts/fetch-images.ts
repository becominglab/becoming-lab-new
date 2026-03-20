/**
 * 既存物件の詳細ページから画像URLを取得してDBに保存
 */
import { prisma } from '../db/client.js';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger.js';

const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchImageUrl(sourceUrl: string): Promise<string | null> {
  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // 実物件画像（img.rakumachi.jp/c/property/ パスのもの）
    const propertyImg = $('img[src*="img.rakumachi.jp/c/property"]').first().attr('src');
    if (propertyImg) return propertyImg.startsWith('http') ? propertyImg : `https:${propertyImg}`;

    // data-src属性にある遅延読み込み画像
    const lazySrc = $('img[data-src*="img.rakumachi.jp/c/property"]').first().attr('data-src');
    if (lazySrc) return lazySrc.startsWith('http') ? lazySrc : `https:${lazySrc}`;

    return null;
  } catch (e) {
    logger.warn(`Failed to fetch image from ${sourceUrl}: ${e}`);
    return null;
  }
}

async function main() {
  // imageUrlが未設定の物件を取得
  const properties = await prisma.propertyCanonical.findMany({
    where: {
      isActive: true,
      imageUrl: null,
    },
    include: { sources: true },
    orderBy: { scoreTotal: 'desc' },
  });

  logger.info(`Found ${properties.length} properties without images`);

  let updated = 0;
  for (const prop of properties) {
    const source = prop.sources[0];
    if (!source?.sourceUrl) continue;

    logger.info(`Fetching image for ${prop.canonicalId} from ${source.sourceUrl}`);
    const imageUrl = await fetchImageUrl(source.sourceUrl);

    if (imageUrl) {
      await prisma.propertyCanonical.update({
        where: { id: prop.id },
        data: { imageUrl },
      });
      updated++;
      logger.info(`  → ${imageUrl}`);
    } else {
      logger.warn(`  → No image found`);
    }

    await sleep(DELAY_MS);
  }

  logger.info(`Updated ${updated}/${properties.length} properties with images`);
  await prisma.$disconnect();
}

main().catch(e => {
  logger.error(e);
  process.exit(1);
});
