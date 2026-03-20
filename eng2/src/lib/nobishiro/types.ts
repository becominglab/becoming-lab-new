// のびしろクエスト TypeScript型定義

export type UserType = 'mitsuki' | 'michiru';
export type Theme = 'junior' | 'elementary';

export interface User {
  id: UserType;
  name: string;
  grade: string;
  goal: string;
  theme: Theme;
  subjects: string[];
}

export interface Subject {
  id: string;
  name: string;
  userType: UserType;
  units: Unit[];
}

export interface Unit {
  id: string;
  subjectId: string;
  name: string;
  order: number;
}

export type QuestionFormat = 'multiple_choice' | 'true_false' | 'fill_blank' | 'sort' | 'short_answer';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Question {
  id: string;
  userType: UserType;
  subject: string;
  unit: string;
  format: QuestionFormat;
  question: string;
  choices?: string[];
  answer: string;
  explanation: string;
  difficulty: Difficulty;
  tags: string[];
}

export type UnitStatus = 'unchecked' | 'growth' | 'can_do' | 'strong';

export interface UnitProgress {
  unitId: string;
  subjectId: string;
  status: UnitStatus;
  attempts: number;
  correctCount: number;
  lastAttempted?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  category: 'streak' | 'subject' | 'growth' | 'juku';
  description: string;
  condition: string;
  threshold: number;
}

export interface EarnedBadge {
  badgeId: string;
  earnedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  badgesRequired: number;
  claimed: boolean;
}

export interface ParentComment {
  id: string;
  text: string;
  type: 'free' | 'template' | 'stamp';
  createdAt: string;
}

export interface DailyLog {
  date: string;
  studied: boolean;
  juku: boolean;
  missionsCompleted: number;
  badgesEarned: string[];
  parentCommented: boolean;
  mood?: string;
  reflection?: {
    done: string;
    growth: string;
    tomorrow: string;
  };
  jukuReview?: {
    subject: string;
    difficult: string;
    nextCheck: string;
  };
}

export interface Mission {
  id: string;
  type: 'quiz' | 'review' | 'juku' | 'reflection';
  title: string;
  subject?: string;
  unit?: string;
  questionCount?: number;
  completed: boolean;
}

export interface AnswerRecord {
  questionId: string;
  correct: boolean;
  answeredAt: string;
  retryScheduled?: string[];
}

export interface ReviewSchedule {
  questionId: string;
  scheduledDates: string[];
  completedDates: string[];
}

export interface AppState {
  currentUser: UserType | null;
  onboardingDone: boolean;
  unitProgress: Record<string, UnitProgress>;
  earnedBadges: EarnedBadge[];
  rewards: Reward[];
  parentComments: ParentComment[];
  dailyLogs: Record<string, DailyLog>;
  answerRecords: AnswerRecord[];
  reviewSchedules: ReviewSchedule[];
  streak: number;
  totalPoints: number;
  settings: {
    theme: Theme;
    soundOn: boolean;
    notificationOn: boolean;
    characterOn: boolean;
    parentNotificationOn: boolean;
  };
}

export interface CharacterLine {
  id: string;
  trigger: 'login' | 'mission_start' | 'correct' | 'incorrect' | 'streak' | 'badge' | 'complete';
  text: string;
  userType?: UserType;
}
