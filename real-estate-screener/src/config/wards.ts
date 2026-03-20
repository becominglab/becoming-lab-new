/**
 * 東京23区の区ごとの投資戦略データ
 * 人気度・単身需要・賃貸競争力を数値化
 */
export interface WardProfile {
  name: string;
  /** 人気度 (1-10): 賃貸需要の底堅さ */
  popularityScore: number;
  /** 単身需要度 (1-10) */
  singleDemandScore: number;
  /** 平均坪単価帯 (万円) */
  avgTsuboPriceRange: [number, number];
  /** 投資戦略メモ */
  strategy: string;
  /** 推定人口 */
  estimatedPopulation: number;
}

export const wardProfiles: Record<string, WardProfile> = {
  '千代田区': {
    name: '千代田区',
    popularityScore: 7,
    singleDemandScore: 8,
    avgTsuboPriceRange: [400, 800],
    strategy: '高単価・低戸数。出口強いが利回り出にくい。',
    estimatedPopulation: 67_000,
  },
  '中央区': {
    name: '中央区',
    popularityScore: 8,
    singleDemandScore: 9,
    avgTsuboPriceRange: [350, 700],
    strategy: '商業寄り。1棟は少ないが出口は堅い。',
    estimatedPopulation: 175_000,
  },
  '港区': {
    name: '港区',
    popularityScore: 10,
    singleDemandScore: 9,
    avgTsuboPriceRange: [400, 900],
    strategy: '超人気。利回り取れたら即検討。出口最強。',
    estimatedPopulation: 260_000,
  },
  '新宿区': {
    name: '新宿区',
    popularityScore: 9,
    singleDemandScore: 10,
    avgTsuboPriceRange: [250, 500],
    strategy: '単身需要の王者。駅近なら空室リスク極小。',
    estimatedPopulation: 350_000,
  },
  '文京区': {
    name: '文京区',
    popularityScore: 8,
    singleDemandScore: 7,
    avgTsuboPriceRange: [250, 450],
    strategy: '教育×住環境。ファミリー需要もあり安定。',
    estimatedPopulation: 240_000,
  },
  '台東区': {
    name: '台東区',
    popularityScore: 7,
    singleDemandScore: 8,
    avgTsuboPriceRange: [200, 400],
    strategy: '下町人気上昇中。利回りと人気のバランス良好。',
    estimatedPopulation: 215_000,
  },
  '墨田区': {
    name: '墨田区',
    popularityScore: 7,
    singleDemandScore: 7,
    avgTsuboPriceRange: [180, 350],
    strategy: '再開発エリアに注目。スカイツリー効果も。',
    estimatedPopulation: 275_000,
  },
  '江東区': {
    name: '江東区',
    popularityScore: 7,
    singleDemandScore: 7,
    avgTsuboPriceRange: [180, 380],
    strategy: '湾岸再開発エリア。人口増加中で将来性あり。',
    estimatedPopulation: 525_000,
  },
  '品川区': {
    name: '品川区',
    popularityScore: 9,
    singleDemandScore: 9,
    avgTsuboPriceRange: [280, 550],
    strategy: '交通利便性抜群。リニア効果期待。出口堅い。',
    estimatedPopulation: 420_000,
  },
  '目黒区': {
    name: '目黒区',
    popularityScore: 9,
    singleDemandScore: 8,
    avgTsuboPriceRange: [300, 600],
    strategy: '住みたい街上位。利回り取れたらお宝。',
    estimatedPopulation: 285_000,
  },
  '大田区': {
    name: '大田区',
    popularityScore: 7,
    singleDemandScore: 7,
    avgTsuboPriceRange: [170, 350],
    strategy: '広い区で立地差大。蒲田周辺は利回り取れる。',
    estimatedPopulation: 740_000,
  },
  '世田谷区': {
    name: '世田谷区',
    popularityScore: 9,
    singleDemandScore: 7,
    avgTsuboPriceRange: [250, 500],
    strategy: '人口最大。ファミリー強い。駅遠物件に注意。',
    estimatedPopulation: 940_000,
  },
  '渋谷区': {
    name: '渋谷区',
    popularityScore: 10,
    singleDemandScore: 10,
    avgTsuboPriceRange: [350, 750],
    strategy: '超人気。1棟自体が希少。出ればすぐ検討。',
    estimatedPopulation: 240_000,
  },
  '中野区': {
    name: '中野区',
    popularityScore: 8,
    singleDemandScore: 9,
    avgTsuboPriceRange: [220, 400],
    strategy: '単身需要堅い。中野駅再開発で上昇期待。',
    estimatedPopulation: 345_000,
  },
  '杉並区': {
    name: '杉並区',
    popularityScore: 8,
    singleDemandScore: 7,
    avgTsuboPriceRange: [220, 420],
    strategy: '住環境良好。中央線沿線は安定需要。',
    estimatedPopulation: 580_000,
  },
  '豊島区': {
    name: '豊島区',
    popularityScore: 8,
    singleDemandScore: 9,
    avgTsuboPriceRange: [230, 420],
    strategy: '池袋圏の単身需要強い。コンパクト物件向き。',
    estimatedPopulation: 300_000,
  },
  '北区': {
    name: '北区',
    popularityScore: 7,
    singleDemandScore: 7,
    avgTsuboPriceRange: [180, 340],
    strategy: '赤羽人気上昇。利回りと需要のバランス取れる。',
    estimatedPopulation: 355_000,
  },
  '荒川区': {
    name: '荒川区',
    popularityScore: 6,
    singleDemandScore: 7,
    avgTsuboPriceRange: [170, 320],
    strategy: '下町で利回り取りやすい。日暮里は需要強い。',
    estimatedPopulation: 220_000,
  },
  '板橋区': {
    name: '板橋区',
    popularityScore: 7,
    singleDemandScore: 7,
    avgTsuboPriceRange: [170, 320],
    strategy: '手頃な価格帯。利回り重視の1棟目向き。',
    estimatedPopulation: 580_000,
  },
  '練馬区': {
    name: '練馬区',
    popularityScore: 7,
    singleDemandScore: 6,
    avgTsuboPriceRange: [160, 310],
    strategy: '広い区で立地差大。駅近なら安定。ファミリー寄り。',
    estimatedPopulation: 750_000,
  },
  '足立区': {
    name: '足立区',
    popularityScore: 6,
    singleDemandScore: 6,
    avgTsuboPriceRange: [130, 260],
    strategy: '利回り最重視エリア。北千住は別格。空室注意。',
    estimatedPopulation: 690_000,
  },
  '葛飾区': {
    name: '葛飾区',
    popularityScore: 6,
    singleDemandScore: 6,
    avgTsuboPriceRange: [130, 250],
    strategy: '利回りは出るがエリア吟味必要。亀有は堅い。',
    estimatedPopulation: 450_000,
  },
  '江戸川区': {
    name: '江戸川区',
    popularityScore: 6,
    singleDemandScore: 6,
    avgTsuboPriceRange: [130, 260],
    strategy: 'ファミリー中心。水害リスク要確認。',
    estimatedPopulation: 700_000,
  },
};

/**
 * 区の人気度スコアを取得（0-10）
 */
export function getWardPopularity(ward: string): number {
  return wardProfiles[ward]?.popularityScore ?? 5;
}

/**
 * 区の単身需要スコアを取得（0-10）
 */
export function getWardSingleDemand(ward: string): number {
  return wardProfiles[ward]?.singleDemandScore ?? 5;
}

/**
 * 区の推定人口を取得
 */
export function getWardPopulation(ward: string): number {
  return wardProfiles[ward]?.estimatedPopulation ?? 300_000;
}
