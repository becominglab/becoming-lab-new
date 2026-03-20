import { prisma } from '../db/client.js';
import { normalizeRakumachiListing } from '../connectors/rakumachi/parser.js';
import { normalizeAthomeListing } from '../connectors/athome/parser.js';
import { defaultConfig } from '../config/default.js';
import { getWardAvgRoadValue } from '../config/wards.js';
import { geocodeAddress } from '../utils/geo.js';
import logger from '../utils/logger.js';
import type { RawListing } from '../connectors/types.js';
import type { PropertyCanonical } from '../core/canonical-schema.js';

/**
 * パーサーの振り分け
 */
function normalizeRawListing(raw: RawListing): Partial<PropertyCanonical> | null {
  switch (raw.sourceSite) {
    case 'rakumachi':
      return normalizeRakumachiListing(raw);
    case 'athome':
      return normalizeAthomeListing(raw);
    default:
      logger.warn(`Unknown source site: ${raw.sourceSite}`);
      return null;
  }
}

/**
 * ハードフィルター適用
 */
function passesHardFilter(prop: Partial<PropertyCanonical>): boolean {
  const f = defaultConfig.filter;

  // 東京23区チェック
  if (!prop.ward || !(defaultConfig.targetWards as readonly string[]).includes(prop.ward)) return false;

  // 価格帯
  const price = prop.propertyPriceJpy;
  if (!price || price < f.minPriceJpy || price > f.maxPriceJpy) return false;

  // 利回り（annualFullRentJpy から逆算）
  if (prop.annualFullRentJpy && price) {
    const yieldPct = (prop.annualFullRentJpy / price) * 100;
    if (yieldPct < f.minYieldPct) return false;
  }

  return true;
}

async function main() {
  logger.info('=== Normalize All ===');

  // 1. ListingRaw から status=pending を取得
  const pendingRaws = await prisma.listingRaw.findMany({
    where: { status: 'pending' },
    orderBy: { fetchedAt: 'desc' },
  });

  logger.info(`Found ${pendingRaws.length} pending raw listings`);

  let normalized = 0;
  let filtered = 0;
  let failed = 0;

  for (const rawRecord of pendingRaws) {
    try {
      // 2. パーサーで正規化
      const rawListing: RawListing = {
        sourceSite: rawRecord.sourceSite,
        sourceUrl: rawRecord.sourceUrl,
        listingId: rawRecord.listingId,
        fetchedAt: rawRecord.fetchedAt,
        rawData: JSON.parse(rawRecord.rawJson),
      };

      const parsed = normalizeRawListing(rawListing);

      if (!parsed || !parsed.canonicalId) {
        await prisma.listingRaw.update({
          where: { id: rawRecord.id },
          data: { status: 'failed', errorMessage: 'Parse returned null' },
        });
        failed++;
        continue;
      }

      // 3. ハードフィルター
      if (!passesHardFilter(parsed)) {
        await prisma.listingRaw.update({
          where: { id: rawRecord.id },
          data: { status: 'normalized', errorMessage: 'Filtered out by hard filter' },
        });
        filtered++;
        continue;
      }

      // 4. ジオコーディング（簡易）
      if (!parsed.lat || !parsed.lng) {
        const geo = geocodeAddress(parsed.address ?? '', parsed.ward);
        if (geo) {
          parsed.lat = geo.lat;
          parsed.lng = geo.lng;
        }
      }

      // 4b. 路線価が無い場合、区の平均路線価で補完
      if (!parsed.roadValueJpyPerSqm && parsed.ward) {
        parsed.roadValueJpyPerSqm = getWardAvgRoadValue(parsed.ward);
        parsed.hasRouteValue = true;
      }

      // 4c. 物件名が空の場合、住所+構造+築年から自動生成
      if (!parsed.propertyName || parsed.propertyName.trim() === '') {
        const parts: string[] = [];
        if (parsed.ward) parts.push(parsed.ward);
        if (parsed.structureType) parts.push(parsed.structureType);
        if (parsed.totalUnits) parts.push(`${parsed.totalUnits}戸`);
        if (parsed.builtYear) parts.push(`築${parsed.builtYear}年`);
        if (parsed.station1?.name) parts.push(`${parsed.station1.name}駅`);
        parsed.propertyName = parts.join(' ') || parsed.address || '名称不明';
      }

      // 5. PropertyCanonical にupsert
      const existing = await prisma.propertyCanonical.findUnique({
        where: { canonicalId: parsed.canonicalId },
      });

      const propertyData = {
        propertyName: parsed.propertyName || null,
        prefecture: parsed.prefecture ?? '東京都',
        ward: parsed.ward || null,
        address: parsed.address || null,
        lat: parsed.lat || null,
        lng: parsed.lng || null,
        structureType: parsed.structureType || null,
        builtYear: parsed.builtYear || null,
        builtMonth: parsed.builtMonth || null,
        landAreaSqm: parsed.landAreaSqm || null,
        buildingAreaSqm: parsed.buildingAreaSqm || null,
        totalFloors: parsed.totalFloors || null,
        totalUnits: parsed.totalUnits || null,
        roomBreakdown: parsed.roomBreakdown || null,
        occupiedUnits: parsed.occupiedUnits || null,
        vacantUnits: parsed.vacantUnits || null,
        occupancyRate: parsed.occupancyRate || null,
        station1Line: parsed.station1?.line || null,
        station1Name: parsed.station1?.name || null,
        station1WalkMin: parsed.station1?.walkMin || null,
        station1DailyPassengers: parsed.station1?.dailyPassengers || null,
        station2Line: parsed.station2?.line || null,
        station2Name: parsed.station2?.name || null,
        station2WalkMin: parsed.station2?.walkMin || null,
        station3Line: parsed.station3?.line || null,
        station3Name: parsed.station3?.name || null,
        station3WalkMin: parsed.station3?.walkMin || null,
        urbanPopulation: parsed.urbanPopulation || null,
        propertyPriceJpy: parsed.propertyPriceJpy!,
        annualFullRentJpy: parsed.annualFullRentJpy || null,
        annualCurrentRentJpy: parsed.annualCurrentRentJpy || null,
        expenseRatioPct: parsed.expenseRatioPct ?? 16.0,
        selfFundingJpy: parsed.selfFundingJpy || null,
        loanInterestPct: parsed.loanInterestPct ?? 1.5,
        loanYears: parsed.loanYears ?? 30,
        roadValueJpyPerSqm: parsed.roadValueJpyPerSqm || null,
        reBuildable: parsed.reBuildable ?? null,
        zoning: parsed.zoning || null,
        coverageRatio: parsed.coverageRatio || null,
        floorAreaRatio: parsed.floorAreaRatio || null,
        landRightType: parsed.landRightType || null,
        roadWidth: parsed.roadWidth || null,
        brokerName: parsed.brokerName || null,
        hasOccupancyInfo: parsed.hasOccupancyInfo ?? false,
        hasRouteValue: parsed.hasRouteValue ?? false,
        hasTaxInfo: parsed.hasTaxInfo ?? false,
        lastSeenAt: new Date(),
        isActive: true,
      };

      let propertyId: number;

      if (existing) {
        const updated = await prisma.propertyCanonical.update({
          where: { canonicalId: parsed.canonicalId },
          data: propertyData,
        });
        propertyId = updated.id;

        // 価格変動記録
        if (existing.propertyPriceJpy !== parsed.propertyPriceJpy) {
          await prisma.priceHistory.create({
            data: {
              propertyId,
              priceJpy: parsed.propertyPriceJpy!,
              annualRentJpy: parsed.annualFullRentJpy || null,
              yieldPct: parsed.annualFullRentJpy
                ? (parsed.annualFullRentJpy / parsed.propertyPriceJpy!) * 100
                : null,
              source: parsed.sourceSite,
            },
          });
        }
      } else {
        const created = await prisma.propertyCanonical.create({
          data: {
            canonicalId: parsed.canonicalId,
            ...propertyData,
          },
        });
        propertyId = created.id;

        // 初回価格記録
        await prisma.priceHistory.create({
          data: {
            propertyId,
            priceJpy: parsed.propertyPriceJpy!,
            annualRentJpy: parsed.annualFullRentJpy || null,
            yieldPct: parsed.annualFullRentJpy
              ? (parsed.annualFullRentJpy / parsed.propertyPriceJpy!) * 100
              : null,
            source: parsed.sourceSite,
          },
        });
      }

      // 6. PropertySource にupsert
      await prisma.propertySource.upsert({
        where: {
          sourceSite_listingId: {
            sourceSite: parsed.sourceSite!,
            listingId: parsed.listingId!,
          },
        },
        update: {
          sourceUrl: parsed.sourceUrl!,
          lastSeenAt: new Date(),
          isActive: true,
        },
        create: {
          propertyId,
          sourceSite: parsed.sourceSite!,
          sourceUrl: parsed.sourceUrl!,
          listingId: parsed.listingId!,
        },
      });

      // 7. ListingRaw を normalized に更新
      await prisma.listingRaw.update({
        where: { id: rawRecord.id },
        data: { status: 'normalized' },
      });

      normalized++;
    } catch (error) {
      logger.error(`Failed to normalize listing ${rawRecord.listingId}`, { error: String(error) });
      await prisma.listingRaw.update({
        where: { id: rawRecord.id },
        data: { status: 'failed', errorMessage: String(error) },
      }).catch(() => {});
      failed++;
    }
  }

  logger.info(`=== Normalize Complete: normalized=${normalized}, filtered=${filtered}, failed=${failed} ===`);
  return { normalized, filtered, failed };
}

export { main as normalizeAll };

if (process.argv[1]?.endsWith('normalize-all.ts')) {
  main().catch(error => {
    logger.error('Normalize failed', { error: String(error) });
    process.exit(1);
  });
}
