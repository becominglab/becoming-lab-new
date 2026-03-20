import { ExamLog, CardReview, VocabLog, User, EncouragementSettings } from '../types'

export const dummyUser: User = {
  id: 'user-1',
  name: 'あさひ',
  role: 'student',
  exam_target: '英検2級',
  exam_date: '2026-06-14',
  created_at: '2026-01-15T00:00:00Z',
}

export const dummyParent: User = {
  id: 'user-2',
  name: 'おとうさん',
  role: 'parent',
  exam_target: '英検2級',
  exam_date: '2026-06-14',
  created_at: '2026-01-15T00:00:00Z',
}

export const dummyEncouragementSettings: EncouragementSettings = {
  id: 'es-1',
  user_id: 'user-1',
  mode: 'original',
  uploaded_image_url: null,
  tone: 'bright',
  updated_at: '2026-03-01T00:00:00Z',
}

export const dummyExamLogs: ExamLog[] = [
  // 2025年度第3回
  { id: 'el1', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '短文語句補充', question_number: 1, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el2', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '短文語句補充', question_number: 2, is_correct: false, miss_tags: ['語彙不足', 'ケアレスミス'], memo: 'distinguishの意味がわからなかった', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el3', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '短文語句補充', question_number: 3, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el4', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '短文語句補充', question_number: 4, is_correct: false, miss_tags: ['語彙不足'], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el5', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '短文語句補充', question_number: 5, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el6', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '長文語句補充', question_number: 1, is_correct: false, miss_tags: ['読解力不足', '時間不足'], memo: '長文の途中で集中が切れた', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el7', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '長文語句補充', question_number: 2, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el8', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '長文内容一致', question_number: 1, is_correct: false, miss_tags: ['読解力不足'], memo: '選択肢の意味がわからなかった', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el9', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '長文内容一致', question_number: 2, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el10', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'reading', part: '長文内容一致', question_number: 3, is_correct: false, miss_tags: ['文法理解不足', '読解力不足'], memo: '関係代名詞の理解が曖昧', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el11', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'listening', part: '第1部', question_number: 1, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el12', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'listening', part: '第1部', question_number: 2, is_correct: false, miss_tags: ['リスニング速度', 'ケアレスミス'], memo: '速すぎて聞き取れなかった', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el13', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'listening', part: '第1部', question_number: 3, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el14', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'listening', part: '第2部', question_number: 1, is_correct: false, miss_tags: ['リスニング速度'], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el15', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'listening', part: '第2部', question_number: 2, is_correct: true, miss_tags: [], memo: '', created_at: '2026-02-10T00:00:00Z' },
  { id: 'el16', user_id: 'user-1', exam_session_name: '2025年度第3回', section: 'writing', part: 'ライティング', question_number: 1, is_correct: false, miss_tags: ['文法理解不足', '語彙不足'], memo: '接続詞の使い方が不自然だった', created_at: '2026-02-10T00:00:00Z' },
  // 2025年度第2回
  { id: 'el17', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'reading', part: '短文語句補充', question_number: 1, is_correct: false, miss_tags: ['語彙不足'], memo: '', created_at: '2026-01-20T00:00:00Z' },
  { id: 'el18', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'reading', part: '短文語句補充', question_number: 2, is_correct: true, miss_tags: [], memo: '', created_at: '2026-01-20T00:00:00Z' },
  { id: 'el19', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'reading', part: '長文語句補充', question_number: 1, is_correct: false, miss_tags: ['読解力不足', '時間不足'], memo: '', created_at: '2026-01-20T00:00:00Z' },
  { id: 'el20', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'reading', part: '長文内容一致', question_number: 1, is_correct: true, miss_tags: [], memo: '', created_at: '2026-01-20T00:00:00Z' },
  { id: 'el21', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'listening', part: '第1部', question_number: 1, is_correct: false, miss_tags: ['リスニング速度'], memo: '', created_at: '2026-01-20T00:00:00Z' },
  { id: 'el22', user_id: 'user-1', exam_session_name: '2025年度第2回', section: 'listening', part: '第2部', question_number: 1, is_correct: false, miss_tags: ['リスニング速度', '語彙不足'], memo: '', created_at: '2026-01-20T00:00:00Z' },
]

export const dummyCardReviews: CardReview[] = [
  { id: 'cr1', user_id: 'user-1', card_id: 'g5', result_rating: 'hard', next_review_at: '2026-03-20T00:00:00Z', review_count: 3, last_reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'cr2', user_id: 'user-1', card_id: 'g15', result_rating: 'ok', next_review_at: '2026-03-22T00:00:00Z', review_count: 2, last_reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'cr3', user_id: 'user-1', card_id: 'g25', result_rating: 'hard', next_review_at: '2026-03-20T00:00:00Z', review_count: 4, last_reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'cr4', user_id: 'user-1', card_id: 'g10', result_rating: 'easy', next_review_at: '2026-03-28T00:00:00Z', review_count: 3, last_reviewed_at: '2026-03-17T00:00:00Z' },
  { id: 'cr5', user_id: 'user-1', card_id: 'g17', result_rating: 'hard', next_review_at: '2026-03-20T00:00:00Z', review_count: 2, last_reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'cr6', user_id: 'user-1', card_id: 'g22', result_rating: 'ok', next_review_at: '2026-03-21T00:00:00Z', review_count: 1, last_reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'cr7', user_id: 'user-1', card_id: 'g31', result_rating: 'easy', next_review_at: '2026-03-30T00:00:00Z', review_count: 2, last_reviewed_at: '2026-03-15T00:00:00Z' },
  { id: 'cr8', user_id: 'user-1', card_id: 'g40', result_rating: 'hard', next_review_at: '2026-03-20T00:00:00Z', review_count: 1, last_reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'cr9', user_id: 'user-1', card_id: 'g43', result_rating: 'hard', next_review_at: '2026-03-20T00:00:00Z', review_count: 3, last_reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'cr10', user_id: 'user-1', card_id: 'g48', result_rating: 'ok', next_review_at: '2026-03-23T00:00:00Z', review_count: 1, last_reviewed_at: '2026-03-18T00:00:00Z' },
]

export const dummyVocabLogs: VocabLog[] = [
  { id: 'vl1', user_id: 'user-1', vocab_id: 'v1', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl2', user_id: 'user-1', vocab_id: 'v2', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl3', user_id: 'user-1', vocab_id: 'v3', is_correct: false, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl4', user_id: 'user-1', vocab_id: 'v4', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl5', user_id: 'user-1', vocab_id: 'v5', is_correct: false, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl6', user_id: 'user-1', vocab_id: 'v6', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl7', user_id: 'user-1', vocab_id: 'v7', is_correct: false, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl8', user_id: 'user-1', vocab_id: 'v8', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl9', user_id: 'user-1', vocab_id: 'v9', is_correct: true, reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'vl10', user_id: 'user-1', vocab_id: 'v10', is_correct: false, reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'vl11', user_id: 'user-1', vocab_id: 'v11', is_correct: true, reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'vl12', user_id: 'user-1', vocab_id: 'v12', is_correct: false, reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'vl13', user_id: 'user-1', vocab_id: 'v13', is_correct: true, reviewed_at: '2026-03-17T00:00:00Z' },
  { id: 'vl14', user_id: 'user-1', vocab_id: 'v14', is_correct: false, reviewed_at: '2026-03-17T00:00:00Z' },
  { id: 'vl15', user_id: 'user-1', vocab_id: 'v15', is_correct: true, reviewed_at: '2026-03-17T00:00:00Z' },
  { id: 'vl16', user_id: 'user-1', vocab_id: 'v20', is_correct: false, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl17', user_id: 'user-1', vocab_id: 'v21', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl18', user_id: 'user-1', vocab_id: 'v22', is_correct: true, reviewed_at: '2026-03-19T00:00:00Z' },
  { id: 'vl19', user_id: 'user-1', vocab_id: 'v30', is_correct: false, reviewed_at: '2026-03-18T00:00:00Z' },
  { id: 'vl20', user_id: 'user-1', vocab_id: 'v31', is_correct: true, reviewed_at: '2026-03-18T00:00:00Z' },
]

// 学習日記録（直近の学習活動）
export const studyDays = {
  thisWeek: ['2026-03-16', '2026-03-17', '2026-03-18', '2026-03-19', '2026-03-20'],
  consecutiveDays: 5,
  totalStudyDays: 42,
}

// ミスの理由タグ一覧
export const missTagOptions = [
  '語彙不足',
  '文法理解不足',
  '読解力不足',
  'リスニング速度',
  '時間不足',
  'ケアレスミス',
  '設問の読み間違い',
  '知識不足',
  '集中力切れ',
]
