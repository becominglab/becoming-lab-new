export interface User {
  id: string
  name: string
  role: 'student' | 'parent'
  exam_target: string
  exam_date: string
  created_at: string
}

export interface ExamLog {
  id: string
  user_id: string
  exam_session_name: string
  section: 'reading' | 'listening' | 'writing' | 'speaking'
  part: string
  question_number: number
  is_correct: boolean
  miss_tags: string[]
  memo: string
  created_at: string
}

export interface GrammarCard {
  id: string
  category: string
  front_text: string
  back_text: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  related_points: string[]
}

export interface CardReview {
  id: string
  user_id: string
  card_id: string
  result_rating: 'easy' | 'ok' | 'hard'
  next_review_at: string
  review_count: number
  last_reviewed_at: string
}

export interface VocabItem {
  id: string
  word: string
  meaning: string
  example_sentence: string
  type: 'word' | 'phrase' | 'idiom'
  level: string
  distractors: string[]
}

export interface VocabLog {
  id: string
  user_id: string
  vocab_id: string
  is_correct: boolean
  reviewed_at: string
}

export interface EncouragementSettings {
  id: string
  user_id: string
  mode: 'original' | 'uploaded' | 'hidden'
  uploaded_image_url: string | null
  tone: 'gentle' | 'bright' | 'push' | 'serious'
  updated_at: string
}

export interface EncouragementLog {
  id: string
  user_id: string
  message_type: string
  message_text: string
  shown_at: string
}

// 過去問アップロード関連
export interface UploadedExam {
  id: string
  session_name: string
  uploaded_at: string
  image_url: string | null
  results: UploadedExamResult[]
}

export interface UploadedExamResult {
  section: 'reading' | 'listening' | 'writing' | 'speaking'
  part: string
  question_number: number
  is_correct: boolean
}

// 弱点分析結果
export interface WeaknessAnalysis {
  category: string
  label: string
  totalQuestions: number
  correctCount: number
  accuracy: number
  level: 'weak' | 'average' | 'strong'
  recommendation: string
}

export type StudyMode = '3min' | '10min' | 'full'

export interface DailyTask {
  id: string
  title: string
  description: string
  type: 'vocab' | 'grammar' | 'exam-review'
  link: string
  priority: number
}
