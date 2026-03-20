/**
 * マスター投資家メソッド スコアリング配点
 */
export const scoringWeights = {
  /** A. 立地・需要スコア */
  location: {
    maxPoints: 25,
    breakdown: {
      walkMinutes: 6,        // 駅徒歩
      multipleLines: 3,      // 複数路線
      wardPopularity: 5,     // 区の人気度
      singleDemand: 4,       // 単身需要
      stationPassengers: 3,  // 駅乗降者数
      rentalDemand: 4,       // 賃貸需要の底堅さ
    },
  },

  /** B. 収益性スコア */
  profitability: {
    maxPoints: 15,
    breakdown: {
      grossYield: 4,         // 表面利回り
      currentYield: 3,       // 現況利回り
      cashFlow: 3,           // 想定CF
      ccr: 2,                // CCR
      safetyMargin: 3,       // 安全余力
    },
  },

  /** C. 融資・買い進め適性スコア */
  financing: {
    maxPoints: 15,
    breakdown: {
      valuationRatio: 4,     // 積算比率
      landValueRatio: 3,     // 土地値比率
      reBuildable: 3,        // 再建築可否
      roadAccess: 2,         // 接道
      priceRange: 3,         // 価格帯の扱いやすさ
    },
  },

  /** D. リスク耐性スコア */
  risk: {
    maxPoints: 15,
    breakdown: {
      buildingAge: 3,        // 築年数
      structure: 2,          // 構造
      vacancyRate: 3,        // 空室率
      legalRisk: 3,          // 再建築不可・越境・傾き等
      repairCost: 2,         // 修繕コスト推定
      hazard: 2,             // 災害リスク
    },
  },

  /** E. 再生・価値創造スコア */
  valueCreation: {
    maxPoints: 15,
    breakdown: {
      rentIncrease: 3,       // 家賃増額余地
      vacancyImprovement: 3, // 空室改善余地
      exteriorImprovement: 2,// 外壁/共用部改善余地
      layoutChange: 2,       // 間取り変更余地
      mergeUnits: 3,         // 2戸ぶち抜き余地
      ownerUnit: 2,          // オーナー住戸化余地
    },
  },

  /** F. 出口スコア */
  exit: {
    maxPoints: 10,
    breakdown: {
      futureMarketability: 3,// 将来売れるか
      areaPopularity: 2,     // 人気エリアか
      landSupport: 2,        // 土地値下支え
      buyerPool: 3,          // 買い手の裾野
    },
  },

  /** G. ビジョン適合スコア */
  vision: {
    maxPoints: 5,
    breakdown: {
      spaceConversion: 2,    // 空間転用余地
      ownerLiving: 1,        // 自宅兼投資展開
      brandPotential: 1,     // ブランド/思想が載るか
      communityHub: 1,       // コミュニティ拠点化余地
    },
  },
} as const;

export type ScoringWeights = typeof scoringWeights;
