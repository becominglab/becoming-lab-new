export const defaultConfig = {
  /** 対象エリア */
  targetWards: [
    '千代田区', '中央区', '港区', '新宿区', '文京区',
    '台東区', '墨田区', '江東区', '品川区', '目黒区',
    '大田区', '世田谷区', '渋谷区', '中野区', '杉並区',
    '豊島区', '北区', '荒川区', '板橋区', '練馬区',
    '足立区', '葛飾区', '江戸川区',
  ],

  /** スクリーニング条件（ハードフィルター） */
  filter: {
    minPriceJpy: 15_000_000,       // 1,500万円
    maxPriceJpy: 150_000_000,      // 1.5億円
    minYieldPct: 6.0,              // 表面利回り下限
    maxWalkMinutes: 15,            // 駅徒歩上限（超えると減点）
    minUnits: 4,                   // 最低戸数（優先）
    targetStructures: ['RC', 'SRC', 'S', 'W', 'W劣'],
  },

  /** 収支計算デフォルト */
  finance: {
    defaultExpenseRatioPct: 16.0,
    defaultLoanInterestPct: 1.5,
    defaultLoanYears: 30,
    defaultSelfFundingJpy: 15_000_000,
    safetyInterestPct: 5.0,
    safetyRentRatio: 0.8,
    safetyExpenseRatio: 0.10,
  },

  /** ランキング */
  topN: 10,

  /** クロール設定 */
  crawl: {
    intervalMs: 3000,
    maxPages: 50,
    userAgent: 'Mozilla/5.0 (compatible; REScreenerBot/0.1)',
    maxRetries: 3,
    retryDelayMs: 5000,
  },

  /** 出力先 */
  output: {
    reportsDir: './data/reports',
    rawDir: './data/raw',
    normalizedDir: './data/normalized',
  },
} as const;

export type AppConfig = typeof defaultConfig;
