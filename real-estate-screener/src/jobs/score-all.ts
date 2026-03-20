import { prisma } from '../db/client.js';
import { calcFinance, calcSafetyMargin, calcSensitivity } from '../core/finance.js';
import { calcValuation } from '../core/valuation.js';
import { scoreProperty } from '../core/scoring.js';
import { generateExplanation } from '../core/explain.js';
import type { PropertyCanonical } from '../core/canonical-schema.js';
import logger from '../utils/logger.js';

/**
 * DB上のPropertyCanonicalレコードをコアスキーマ型に変換
 */
export function dbRecordToCanonical(rec: any): PropertyCanonical {
  return {
    canonicalId: rec.canonicalId,
    propertyName: rec.propertyName ?? undefined,
    prefecture: rec.prefecture ?? '東京都',
    ward: rec.ward ?? undefined,
    address: rec.address ?? undefined,
    lat: rec.lat ?? undefined,
    lng: rec.lng ?? undefined,
    structureType: rec.structureType as any,
    builtYear: rec.builtYear ?? undefined,
    builtMonth: rec.builtMonth ?? undefined,
    landAreaSqm: rec.landAreaSqm ?? undefined,
    buildingAreaSqm: rec.buildingAreaSqm ?? undefined,
    frontageM: rec.frontageM ?? undefined,
    totalFloors: rec.totalFloors ?? undefined,
    totalUnits: rec.totalUnits ?? undefined,
    roomBreakdown: rec.roomBreakdown ?? undefined,
    occupiedUnits: rec.occupiedUnits ?? undefined,
    vacantUnits: rec.vacantUnits ?? undefined,
    occupancyRate: rec.occupancyRate ?? undefined,
    station1: rec.station1Name ? {
      line: rec.station1Line ?? undefined,
      name: rec.station1Name ?? undefined,
      walkMin: rec.station1WalkMin ?? undefined,
      dailyPassengers: rec.station1DailyPassengers ?? undefined,
    } : undefined,
    station2: rec.station2Name ? {
      line: rec.station2Line ?? undefined,
      name: rec.station2Name ?? undefined,
      walkMin: rec.station2WalkMin ?? undefined,
    } : undefined,
    station3: rec.station3Name ? {
      line: rec.station3Line ?? undefined,
      name: rec.station3Name ?? undefined,
      walkMin: rec.station3WalkMin ?? undefined,
    } : undefined,
    urbanPopulation: rec.urbanPopulation ?? undefined,
    propertyPriceJpy: rec.propertyPriceJpy,
    annualFullRentJpy: rec.annualFullRentJpy ?? undefined,
    annualCurrentRentJpy: rec.annualCurrentRentJpy ?? undefined,
    expenseRatioPct: rec.expenseRatioPct ?? 16.0,
    selfFundingJpy: rec.selfFundingJpy ?? undefined,
    loanInterestPct: rec.loanInterestPct ?? 1.5,
    loanYears: rec.loanYears ?? 30,
    roadValueJpyPerSqm: rec.roadValueJpyPerSqm ?? undefined,
    reBuildable: rec.reBuildable ?? undefined,
    zoning: rec.zoning ?? undefined,
    coverageRatio: rec.coverageRatio ?? undefined,
    floorAreaRatio: rec.floorAreaRatio ?? undefined,
    landRightType: rec.landRightType ?? undefined,
    roadDirection: rec.roadDirection ?? undefined,
    roadWidth: rec.roadWidth ?? undefined,
    brokerName: rec.brokerName ?? undefined,
    hasOccupancyInfo: rec.hasOccupancyInfo ?? false,
    hasRouteValue: rec.hasRouteValue ?? false,
    hasTaxInfo: rec.hasTaxInfo ?? false,
    memo: rec.memo ?? undefined,
    sourceSite: rec.sources?.[0]?.sourceSite ?? 'unknown',
    sourceUrl: rec.sources?.[0]?.sourceUrl ?? '',
    listingId: rec.sources?.[0]?.listingId ?? rec.canonicalId,
  };
}

async function main() {
  logger.info('=== Score All ===');

  const properties = await prisma.propertyCanonical.findMany({
    where: { isActive: true },
    include: { sources: true },
  });

  logger.info(`Found ${properties.length} active properties to score`);

  let scored = 0;
  let errors = 0;

  for (const rec of properties) {
    try {
      const prop = dbRecordToCanonical(rec);
      const finance = calcFinance(prop);
      const valuation = calcValuation(prop);
      const safety = calcSafetyMargin(prop);
      const scoring = scoreProperty(prop, finance, valuation, safety);
      const explanation = generateExplanation(prop, finance, valuation, safety, scoring);

      await prisma.propertyCanonical.update({
        where: { id: rec.id },
        data: {
          grossYieldPct: finance.grossYieldPct,
          currentYieldPct: finance.currentYieldPct,
          annualLoanPaymentJpy: finance.annualLoanPaymentJpy,
          annualFullCfJpy: finance.annualFullCfJpy,
          annualCurrentCfJpy: finance.annualCurrentCfJpy,
          fullCfPct: finance.fullCfPct,
          currentCfPct: finance.currentCfPct,
          ccrPct: finance.ccrPct,
          landValuationJpy: valuation.landValuationJpy,
          buildingValuationJpy: valuation.buildingValuationJpy,
          valuationRatioPct: valuation.valuationRatioPct,
          safeMonthlyRentJpy: safety.safeMonthlyRentJpy,
          safeMonthlyExpenseJpy: safety.safeMonthlyExpenseJpy,
          safeMonthlyLoanJpy: safety.safeMonthlyLoanJpy,
          safeMonthlyCfJpy: safety.safeMonthlyCfJpy,
          scoreLocation: scoring.scores.location,
          scoreProfitability: scoring.scores.profitability,
          scoreFinancing: scoring.scores.financing,
          scoreRisk: scoring.scores.risk,
          scoreValueCreation: scoring.scores.valueCreation,
          scoreExit: scoring.scores.exit,
          scoreVision: scoring.scores.vision,
          scoreTotal: scoring.scores.total,
          buyJudgment: scoring.buyJudgment,
          explanation,
          warningFlags: JSON.stringify(scoring.warningFlags),
          specialOpportunityFlag: scoring.specialOpportunityFlag,
        },
      });

      // 感度分析
      const sensitivities = calcSensitivity(prop);
      await prisma.sensitivityResult.deleteMany({ where: { propertyId: rec.id } });
      if (sensitivities.length > 0) {
        await prisma.sensitivityResult.createMany({
          data: sensitivities.map(s => ({
            propertyId: rec.id,
            parameterName: s.parameterName,
            deltaValue: s.deltaValue,
            resultCfJpy: s.resultCfJpy,
            resultYieldPct: s.resultYieldPct,
            resultCcrPct: s.resultCcrPct,
          })),
        });
      }

      scored++;
    } catch (error) {
      logger.error(`Failed to score ${rec.canonicalId}`, { error: String(error) });
      errors++;
    }
  }

  logger.info(`=== Score Complete: scored=${scored}, errors=${errors} ===`);
  return { scored, errors };
}

export { main as scoreAll };

if (process.argv[1]?.endsWith('score-all.ts')) {
  main().catch(error => {
    logger.error('Score failed', { error: String(error) });
    process.exit(1);
  });
}
