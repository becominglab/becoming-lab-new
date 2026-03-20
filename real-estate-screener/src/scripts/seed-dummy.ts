/**
 * ダミーデータをDBに投入するスクリプト
 * Usage: DATABASE_URL="file:./data/test-screener.db" npx tsx src/scripts/seed-dummy.ts
 */
import { prisma } from '../db/client.js';
import { dummyProperties } from '../tests/dummy-data.js';
import * as crypto from 'node:crypto';

async function main() {
  console.log('Seeding dummy data...');

  for (const prop of dummyProperties) {
    // ListingRaw に投入
    const rawData = {
      title: prop.propertyName,
      price: `${Math.round(prop.propertyPriceJpy / 10000)}万円`,
      yield: prop.annualFullRentJpy
        ? `${((prop.annualFullRentJpy / prop.propertyPriceJpy) * 100).toFixed(1)}%`
        : undefined,
      address: prop.address,
      transport: prop.station1
        ? `${prop.station1.line ?? ''} ${prop.station1.name ?? ''}駅 徒歩${prop.station1.walkMin ?? '?'}分`
        : undefined,
      builtDate: prop.builtYear ? `${prop.builtYear}年${prop.builtMonth ?? ''}月` : undefined,
      totalUnits: prop.totalUnits ? `${prop.totalUnits}戸` : undefined,
      structure: prop.structureType,
      buildingArea: prop.buildingAreaSqm ? `${prop.buildingAreaSqm}㎡` : undefined,
      landArea: prop.landAreaSqm ? `${prop.landAreaSqm}㎡` : undefined,
    };
    const rawJson = JSON.stringify(rawData);

    await prisma.listingRaw.upsert({
      where: {
        sourceSite_listingId: {
          sourceSite: prop.sourceSite,
          listingId: prop.listingId,
        },
      },
      update: { rawJson, status: 'pending' },
      create: {
        sourceSite: prop.sourceSite,
        sourceUrl: prop.sourceUrl,
        listingId: prop.listingId,
        rawJson,
        htmlHash: crypto.createHash('md5').update(rawJson).digest('hex'),
        status: 'pending',
      },
    });

    // PropertyCanonical に直接投入
    const existing = await prisma.propertyCanonical.findUnique({
      where: { canonicalId: prop.canonicalId },
    });

    const data = {
      propertyName: prop.propertyName ?? null,
      prefecture: prop.prefecture ?? '東京都',
      ward: prop.ward ?? null,
      address: prop.address ?? null,
      lat: prop.lat ?? null,
      lng: prop.lng ?? null,
      structureType: prop.structureType ?? null,
      builtYear: prop.builtYear ?? null,
      builtMonth: prop.builtMonth ?? null,
      landAreaSqm: prop.landAreaSqm ?? null,
      buildingAreaSqm: prop.buildingAreaSqm ?? null,
      totalFloors: prop.totalFloors ?? null,
      totalUnits: prop.totalUnits ?? null,
      roomBreakdown: prop.roomBreakdown ?? null,
      occupiedUnits: prop.occupiedUnits ?? null,
      vacantUnits: prop.vacantUnits ?? null,
      occupancyRate: prop.occupancyRate ?? null,
      station1Line: prop.station1?.line ?? null,
      station1Name: prop.station1?.name ?? null,
      station1WalkMin: prop.station1?.walkMin ?? null,
      station1DailyPassengers: prop.station1?.dailyPassengers ?? null,
      station2Line: prop.station2?.line ?? null,
      station2Name: prop.station2?.name ?? null,
      station2WalkMin: prop.station2?.walkMin ?? null,
      station3Line: prop.station3?.line ?? null,
      station3Name: prop.station3?.name ?? null,
      station3WalkMin: prop.station3?.walkMin ?? null,
      urbanPopulation: prop.urbanPopulation ?? null,
      propertyPriceJpy: prop.propertyPriceJpy,
      annualFullRentJpy: prop.annualFullRentJpy ?? null,
      annualCurrentRentJpy: prop.annualCurrentRentJpy ?? null,
      expenseRatioPct: prop.expenseRatioPct ?? 16.0,
      selfFundingJpy: prop.selfFundingJpy ?? null,
      loanInterestPct: prop.loanInterestPct ?? 1.5,
      loanYears: prop.loanYears ?? 30,
      roadValueJpyPerSqm: prop.roadValueJpyPerSqm ?? null,
      reBuildable: prop.reBuildable ?? null,
      roadDirection: prop.roadDirection ?? null,
      roadWidth: prop.roadWidth ?? null,
      brokerName: prop.brokerName ?? null,
      hasOccupancyInfo: prop.hasOccupancyInfo ?? false,
      hasRouteValue: prop.hasRouteValue ?? false,
      hasTaxInfo: prop.hasTaxInfo ?? false,
      isActive: true,
    };

    let propertyId: number;
    if (existing) {
      const updated = await prisma.propertyCanonical.update({
        where: { canonicalId: prop.canonicalId },
        data,
      });
      propertyId = updated.id;
    } else {
      const created = await prisma.propertyCanonical.create({
        data: { canonicalId: prop.canonicalId, ...data },
      });
      propertyId = created.id;
    }

    // PropertySource
    await prisma.propertySource.upsert({
      where: {
        sourceSite_listingId: {
          sourceSite: prop.sourceSite,
          listingId: prop.listingId,
        },
      },
      update: { sourceUrl: prop.sourceUrl },
      create: {
        propertyId,
        sourceSite: prop.sourceSite,
        sourceUrl: prop.sourceUrl,
        listingId: prop.listingId,
      },
    });
  }

  const count = await prisma.propertyCanonical.count();
  console.log(`Seeded ${count} properties to DB`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
