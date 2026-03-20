// のびしろクエスト — localStorage ベースの状態管理
import type {
  AppState,
  DailyLog,
  Reward,
  UnitStatus,
  Theme,
  AnswerRecord,
  ReviewSchedule,
  EarnedBadge,
} from './types';
import { BADGES, DEFAULT_REWARDS } from './data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'nobishiro-quest';

// ---------------------------------------------------------------------------
// Default State
// ---------------------------------------------------------------------------
export const defaultState: AppState = {
  currentUser: null,
  onboardingDone: false,
  unitProgress: {},
  earnedBadges: [],
  rewards: DEFAULT_REWARDS.map((r) => ({ ...r })),
  parentComments: [],
  dailyLogs: {},
  answerRecords: [],
  reviewSchedules: [],
  streak: 0,
  totalPoints: 0,
  settings: {
    theme: 'junior' as Theme,
    soundOn: true,
    notificationOn: true,
    characterOn: true,
    parentNotificationOn: true,
  },
};

// ---------------------------------------------------------------------------
// Core CRUD
// ---------------------------------------------------------------------------

/** localStorage から AppState を読み込む。SSR 時や未保存時は defaultState を返す */
export function getState(): AppState {
  if (typeof window === 'undefined') return { ...defaultState };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return JSON.parse(raw) as AppState;
  } catch {
    return { ...defaultState };
  }
}

/** AppState を localStorage に保存する */
export function setState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded etc. — silently ignore
  }
}

/** 関数型アップデート */
export function updateState(updater: (state: AppState) => AppState): AppState {
  const next = updater(getState());
  setState(next);
  return next;
}

/** デフォルト状態にリセット */
export function resetState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// Helpers — date
// ---------------------------------------------------------------------------

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function today(): string {
  return toDateStr(new Date());
}

function addDays(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

/** 今日の DailyLog を返す */
export function getTodayLog(state: AppState): DailyLog | undefined {
  return state.dailyLogs[today()];
}

/** 連続学習日数（studied===true の連続日数） */
export function getStreak(state: AppState): number {
  let count = 0;
  const d = new Date();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const key = toDateStr(d);
    const log = state.dailyLogs[key];
    if (log?.studied) {
      count++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

/** 獲得バッジ数 */
export function getBadgeCount(state: AppState): number {
  return state.earnedBadges.length;
}

/** 次の未獲得リワードを返す */
export function getNextReward(state: AppState): Reward | undefined {
  return state.rewards
    .filter((r) => !r.claimed)
    .sort((a, b) => a.badgesRequired - b.badgesRequired)[0];
}

/** 指定ユニットの学習ステータス */
export function getUnitStatus(state: AppState, unitId: string): UnitStatus {
  return state.unitProgress[unitId]?.status ?? 'unchecked';
}

// ---------------------------------------------------------------------------
// Write helpers (immutable — return new AppState)
// ---------------------------------------------------------------------------

/** 解答記録を追加。不正解なら復習スケジュールも設定 */
export function addAnswerRecord(
  state: AppState,
  questionId: string,
  correct: boolean,
): AppState {
  const now = new Date().toISOString();
  const todayStr = today();

  const record: AnswerRecord = {
    questionId,
    correct,
    answeredAt: now,
  };

  let reviewSchedules = [...state.reviewSchedules];

  if (!correct) {
    // 不正解 → 翌日 / +3日 / +7日 の復習スケジュール
    const scheduled = [
      addDays(todayStr, 1),
      addDays(todayStr, 3),
      addDays(todayStr, 7),
    ];
    record.retryScheduled = scheduled;

    const existing = reviewSchedules.find((r) => r.questionId === questionId);
    if (existing) {
      reviewSchedules = reviewSchedules.map((r) =>
        r.questionId === questionId
          ? { ...r, scheduledDates: Array.from(new Set([...r.scheduledDates, ...scheduled])) }
          : r,
      );
    } else {
      const schedule: ReviewSchedule = {
        questionId,
        scheduledDates: scheduled,
        completedDates: [],
      };
      reviewSchedules = [...reviewSchedules, schedule];
    }
  }

  return {
    ...state,
    answerRecords: [...state.answerRecords, record],
    reviewSchedules,
    totalPoints: state.totalPoints + (correct ? 10 : 2),
  };
}

/** バッジ条件をチェックし、新たに獲得できるものを付与 */
export function checkAndAwardBadges(state: AppState): AppState {
  const earned = new Set(state.earnedBadges.map((b) => b.badgeId));
  const newBadges: EarnedBadge[] = [];
  const now = new Date().toISOString();

  const streak = getStreak(state);
  const progressEntries = Object.values(state.unitProgress);
  const growthUnits = progressEntries.filter((p) => p.status === 'growth').length;
  const canDoFromGrowth = progressEntries.filter(
    (p) => p.status === 'can_do' || p.status === 'strong',
  ).length;
  const retryCount = state.answerRecords.filter(
    (r) => r.retryScheduled && r.retryScheduled.length > 0,
  ).length;
  const totalAttempts = state.answerRecords.length;

  // Juku count
  const jukuDays = Object.values(state.dailyLogs).filter((l) => l.juku).length;
  const jukuReviewDays = Object.values(state.dailyLogs).filter(
    (l) => l.juku && l.jukuReview,
  ).length;
  const missionsCompleted = Object.values(state.dailyLogs).reduce(
    (sum, l) => sum + l.missionsCompleted,
    0,
  );

  // Subject unit counts
  const subjectUnitDone: Record<string, number> = {};
  for (const p of progressEntries) {
    if (p.status !== 'unchecked') {
      subjectUnitDone[p.subjectId] = (subjectUnitDone[p.subjectId] || 0) + 1;
    }
  }

  for (const badge of BADGES) {
    if (earned.has(badge.id)) continue;

    let met = false;
    switch (badge.category) {
      case 'streak':
        met = streak >= badge.threshold;
        break;
      case 'subject': {
        // badge.condition contains subject id pattern
        const relevantSubjects = Object.keys(subjectUnitDone).filter((sid) =>
          sid.includes(badge.condition),
        );
        met = relevantSubjects.some((sid) => (subjectUnitDone[sid] || 0) >= badge.threshold);
        break;
      }
      case 'growth':
        if (badge.condition === 'growth_units') met = growthUnits >= badge.threshold;
        else if (badge.condition === 'retry_count') met = retryCount >= badge.threshold;
        else if (badge.condition === 'total_attempts') met = totalAttempts >= badge.threshold;
        else if (badge.condition === 'growth_to_can_do') met = canDoFromGrowth >= badge.threshold;
        break;
      case 'juku':
        if (badge.condition === 'juku_days') met = jukuDays >= badge.threshold;
        else if (badge.condition === 'juku_review') met = jukuReviewDays >= badge.threshold;
        else if (badge.condition === 'missions_completed') met = missionsCompleted >= badge.threshold;
        break;
    }

    if (met) {
      newBadges.push({ badgeId: badge.id, earnedAt: now });
    }
  }

  if (newBadges.length === 0) return state;

  // Also check rewards
  const totalBadges = state.earnedBadges.length + newBadges.length;
  const rewards = state.rewards.map((r) =>
    !r.claimed && totalBadges >= r.badgesRequired ? { ...r, claimed: false } : r,
  );

  return {
    ...state,
    earnedBadges: [...state.earnedBadges, ...newBadges],
    rewards,
  };
}

/** ミッション完了を記録 */
export function completeMission(
  state: AppState,
  missionType: 'quiz' | 'review' | 'juku' | 'reflection',
): AppState {
  const todayStr = today();
  const log: DailyLog = state.dailyLogs[todayStr] ?? {
    date: todayStr,
    studied: false,
    juku: false,
    missionsCompleted: 0,
    badgesEarned: [],
    parentCommented: false,
  };

  const updatedLog: DailyLog = {
    ...log,
    studied: true,
    juku: missionType === 'juku' ? true : log.juku,
    missionsCompleted: log.missionsCompleted + 1,
  };

  const nextState: AppState = {
    ...state,
    dailyLogs: {
      ...state.dailyLogs,
      [todayStr]: updatedLog,
    },
  };

  // ストリーク再計算
  nextState.streak = getStreak(nextState);

  return checkAndAwardBadges(nextState);
}
