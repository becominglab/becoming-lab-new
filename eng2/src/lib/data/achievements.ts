// 達成バッジ & レベルシステム

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'streak' | 'vocab' | 'grammar' | 'exam' | 'time' | 'milestone'
  condition: string // 達成条件の説明
  unlockedAt: string | null // null = 未達成
}

export interface StudySession {
  date: string
  minutes: number
  activities: {
    type: 'vocab' | 'grammar' | 'quick-test' | 'exam-log' | 'upload'
    count: number // 問題数やカード枚数
  }[]
}

export interface MasteredTopic {
  category: string
  label: string
  masteredAt: string
  accuracy: number // 達成時の正答率
}

export interface LevelInfo {
  level: number
  title: string
  xp: number
  nextLevelXp: number
  totalXp: number
}

// レベル定義
export const levelDefinitions = [
  { level: 1, title: 'はじめの一歩', minXp: 0 },
  { level: 2, title: '英語の芽', minXp: 50 },
  { level: 3, title: 'コツコツ学習者', minXp: 120 },
  { level: 4, title: '語彙マスター見習い', minXp: 220 },
  { level: 5, title: '文法チャレンジャー', minXp: 350 },
  { level: 6, title: '英検ファイター', minXp: 520 },
  { level: 7, title: '読解の達人見習い', minXp: 730 },
  { level: 8, title: 'リスニング戦士', minXp: 980 },
  { level: 9, title: '2級マスター候補', minXp: 1280 },
  { level: 10, title: '英検2級の星', minXp: 1630 },
]

// XP計算ルール
export const xpRules = {
  vocabCorrect: 3,      // 語彙1問正解
  vocabComplete: 20,    // 語彙20問セット完了
  grammarReview: 5,     // 文法カード1枚復習
  grammarMaster: 15,    // 文法カード「easy」評価
  quickTestComplete: 25, // クイックテスト完了
  quickTestPerfect: 50,  // クイックテスト全問正解
  examUpload: 30,       // 過去問アップロード
  dailyLogin: 10,       // デイリーログイン
  streakBonus3: 20,     // 3日連続ボーナス
  streakBonus7: 50,     // 7日連続ボーナス
  streakBonus14: 100,   // 14日連続ボーナス
  streakBonus30: 200,   // 30日連続ボーナス
}

// 達成バッジ一覧
export const allAchievements: Achievement[] = [
  // 連続学習
  { id: 'streak-3', title: '3日連続！', description: '3日間連続で学習した', icon: '🔥', category: 'streak', condition: '3日連続学習', unlockedAt: '2026-03-18T00:00:00Z' },
  { id: 'streak-5', title: '5日連続達成！', description: '5日間連続で学習を続けた', icon: '🔥', category: 'streak', condition: '5日連続学習', unlockedAt: '2026-03-20T00:00:00Z' },
  { id: 'streak-7', title: '1週間マスター', description: '7日間休まず学習した', icon: '⭐', category: 'streak', condition: '7日連続学習', unlockedAt: null },
  { id: 'streak-14', title: '2週間の鉄人', description: '14日間連続学習を達成', icon: '💎', category: 'streak', condition: '14日連続学習', unlockedAt: null },
  { id: 'streak-30', title: '30日の伝説', description: '30日間連続で学習した！', icon: '👑', category: 'streak', condition: '30日連続学習', unlockedAt: null },

  // 語彙
  { id: 'vocab-first', title: 'はじめての語彙', description: '初めて語彙テストに挑戦した', icon: '📖', category: 'vocab', condition: '語彙テスト初回', unlockedAt: '2026-03-16T00:00:00Z' },
  { id: 'vocab-50', title: '50語マスター', description: '50個の単語を正解した', icon: '📚', category: 'vocab', condition: '語彙累計50問正解', unlockedAt: '2026-03-19T00:00:00Z' },
  { id: 'vocab-100', title: '100語の壁突破', description: '100個の単語を正解した', icon: '🏆', category: 'vocab', condition: '語彙累計100問正解', unlockedAt: null },
  { id: 'vocab-perfect', title: 'パーフェクト！', description: '語彙テスト20問全問正解', icon: '💯', category: 'vocab', condition: '語彙テスト満点', unlockedAt: null },
  { id: 'vocab-accuracy70', title: '正答率70%超え', description: '語彙の正答率が70%を超えた', icon: '📈', category: 'vocab', condition: '語彙正答率70%以上', unlockedAt: null },

  // 文法
  { id: 'grammar-first', title: 'カード学習スタート', description: '初めて文法カードを学習した', icon: '🃏', category: 'grammar', condition: '文法カード初回', unlockedAt: '2026-03-16T00:00:00Z' },
  { id: 'grammar-10', title: '10枚クリア', description: '文法カード10枚を復習した', icon: '📝', category: 'grammar', condition: '文法カード累計10枚', unlockedAt: '2026-03-19T00:00:00Z' },
  { id: 'grammar-all', title: '全カードコンプリート', description: '全55枚の文法カードを学習', icon: '🎓', category: 'grammar', condition: '全文法カード学習', unlockedAt: null },
  { id: 'grammar-easy5', title: '得意分野発見！', description: '5枚のカードを「easy」で通過', icon: '⚡', category: 'grammar', condition: 'easy評価5枚', unlockedAt: null },

  // 過去問・テスト
  { id: 'exam-first', title: '初めての過去問', description: '初めて過去問の結果を登録した', icon: '📋', category: 'exam', condition: '過去問初回登録', unlockedAt: '2026-02-10T00:00:00Z' },
  { id: 'exam-3', title: '3回分チャレンジ', description: '過去問を3回分登録した', icon: '📊', category: 'exam', condition: '過去問3回登録', unlockedAt: null },
  { id: 'quick-first', title: 'クイックテスト初挑戦', description: '初めて3分テストに挑戦した', icon: '⚡', category: 'exam', condition: 'クイックテスト初回', unlockedAt: null },
  { id: 'quick-80', title: 'テスト80%超え！', description: 'クイックテストで80%以上正解', icon: '🌟', category: 'exam', condition: 'クイックテスト80%以上', unlockedAt: null },

  // 学習時間
  { id: 'time-30', title: '30分達成', description: '累計学習時間30分を達成', icon: '⏰', category: 'time', condition: '累計30分', unlockedAt: '2026-03-17T00:00:00Z' },
  { id: 'time-60', title: '1時間の努力家', description: '累計学習時間1時間を達成', icon: '⏰', category: 'time', condition: '累計1時間', unlockedAt: '2026-03-19T00:00:00Z' },
  { id: 'time-300', title: '5時間の学習者', description: '累計学習時間5時間を達成', icon: '🕐', category: 'time', condition: '累計5時間', unlockedAt: null },
  { id: 'time-600', title: '10時間の挑戦者', description: '累計学習時間10時間を達成', icon: '🕐', category: 'time', condition: '累計10時間', unlockedAt: null },

  // マイルストーン
  { id: 'milestone-start', title: '学習スタート！', description: 'アプリで学習を始めた', icon: '🚀', category: 'milestone', condition: 'アプリ初回利用', unlockedAt: '2026-03-16T00:00:00Z' },
  { id: 'milestone-all-sections', title: '全セクション挑戦', description: '全セクション（R・L・W）で問題を解いた', icon: '🎯', category: 'milestone', condition: '全セクション挑戦', unlockedAt: '2026-02-10T00:00:00Z' },
  { id: 'milestone-improve', title: '成長を実感！', description: '過去問の正答率が前回より上がった', icon: '📈', category: 'milestone', condition: '過去問正答率向上', unlockedAt: null },
]

// ダミー学習セッションデータ（過去2週間）
export const dummyStudySessions: StudySession[] = [
  { date: '2026-03-07', minutes: 12, activities: [{ type: 'vocab', count: 10 }] },
  { date: '2026-03-08', minutes: 0, activities: [] },
  { date: '2026-03-09', minutes: 8, activities: [{ type: 'grammar', count: 5 }] },
  { date: '2026-03-10', minutes: 0, activities: [] },
  { date: '2026-03-11', minutes: 15, activities: [{ type: 'vocab', count: 20 }, { type: 'grammar', count: 3 }] },
  { date: '2026-03-12', minutes: 0, activities: [] },
  { date: '2026-03-13', minutes: 0, activities: [] },
  { date: '2026-03-14', minutes: 10, activities: [{ type: 'vocab', count: 15 }] },
  { date: '2026-03-15', minutes: 0, activities: [] },
  { date: '2026-03-16', minutes: 18, activities: [{ type: 'vocab', count: 20 }, { type: 'grammar', count: 5 }, { type: 'exam-log', count: 5 }] },
  { date: '2026-03-17', minutes: 22, activities: [{ type: 'vocab', count: 20 }, { type: 'grammar', count: 8 }] },
  { date: '2026-03-18', minutes: 15, activities: [{ type: 'vocab', count: 20 }, { type: 'quick-test', count: 8 }] },
  { date: '2026-03-19', minutes: 25, activities: [{ type: 'vocab', count: 20 }, { type: 'grammar', count: 10 }, { type: 'quick-test', count: 8 }] },
  { date: '2026-03-20', minutes: 20, activities: [{ type: 'vocab', count: 15 }, { type: 'grammar', count: 5 }, { type: 'upload', count: 1 }] },
]

// ダミーマスター済みトピック
export const dummyMasteredTopics: MasteredTopic[] = [
  { category: 'grammar-passive', label: '受動態の基本', masteredAt: '2026-03-17T00:00:00Z', accuracy: 85 },
  { category: 'grammar-comparison', label: '比較級・最上級', masteredAt: '2026-03-19T00:00:00Z', accuracy: 80 },
  { category: 'idiom', label: '基本熟語（look/take/come）', masteredAt: '2026-03-18T00:00:00Z', accuracy: 90 },
  { category: 'grammar-preposition', label: '前置詞の基本（in/on/at）', masteredAt: '2026-03-20T00:00:00Z', accuracy: 75 },
]

// レベル計算
export function calculateLevel(totalXp: number): LevelInfo {
  let currentLevel = levelDefinitions[0]
  let nextLevel = levelDefinitions[1]

  for (let i = levelDefinitions.length - 1; i >= 0; i--) {
    if (totalXp >= levelDefinitions[i].minXp) {
      currentLevel = levelDefinitions[i]
      nextLevel = levelDefinitions[i + 1] || levelDefinitions[i]
      break
    }
  }

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xp: totalXp - currentLevel.minXp,
    nextLevelXp: nextLevel.minXp - currentLevel.minXp,
    totalXp,
  }
}

// ダミーの総XP（学習実績から計算されたもの）
export const dummyTotalXp = 385
// → Level 5: 文法チャレンジャー (350-519)
