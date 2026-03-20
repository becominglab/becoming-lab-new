-- Asahi Eiken 2 Coach - 初期スキーマ

-- ユーザー
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'parent')),
  exam_target TEXT NOT NULL DEFAULT '英検2級',
  exam_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 過去問ログ
CREATE TABLE exam_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_session_name TEXT NOT NULL,
  section TEXT NOT NULL CHECK (section IN ('reading', 'listening', 'writing', 'speaking')),
  part TEXT NOT NULL,
  question_number INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  miss_tags TEXT[] DEFAULT '{}',
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 文法カード
CREATE TABLE grammar_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  related_points TEXT[] DEFAULT '{}'
);

-- カード復習記録
CREATE TABLE card_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES grammar_cards(id) ON DELETE CASCADE,
  result_rating TEXT NOT NULL CHECK (result_rating IN ('easy', 'ok', 'hard')),
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  review_count INTEGER NOT NULL DEFAULT 1,
  last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 語彙
CREATE TABLE vocab_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example_sentence TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'word' CHECK (type IN ('word', 'phrase', 'idiom')),
  level TEXT NOT NULL DEFAULT '2級',
  distractors TEXT[] DEFAULT '{}'
);

-- 語彙学習ログ
CREATE TABLE vocab_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vocab_id UUID NOT NULL REFERENCES vocab_items(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 推しエール設定
CREATE TABLE encouragement_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  mode TEXT NOT NULL DEFAULT 'original' CHECK (mode IN ('original', 'uploaded', 'hidden')),
  uploaded_image_url TEXT,
  tone TEXT NOT NULL DEFAULT 'bright' CHECK (tone IN ('gentle', 'bright', 'push', 'serious')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 推しエールログ
CREATE TABLE encouragement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'daily',
  message_text TEXT NOT NULL,
  shown_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス
CREATE INDEX idx_exam_logs_user_id ON exam_logs(user_id);
CREATE INDEX idx_exam_logs_session ON exam_logs(exam_session_name);
CREATE INDEX idx_card_reviews_user_id ON card_reviews(user_id);
CREATE INDEX idx_card_reviews_next_review ON card_reviews(next_review_at);
CREATE INDEX idx_vocab_logs_user_id ON vocab_logs(user_id);
CREATE INDEX idx_vocab_logs_reviewed_at ON vocab_logs(reviewed_at);

-- RLS ポリシー
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragement_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE encouragement_logs ENABLE ROW LEVEL SECURITY;

-- grammar_cards と vocab_items は全ユーザー読み取り可
ALTER TABLE grammar_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "grammar_cards_read" ON grammar_cards FOR SELECT USING (true);
CREATE POLICY "vocab_items_read" ON vocab_items FOR SELECT USING (true);

-- ユーザー自身のデータのみアクセス可能
CREATE POLICY "users_own" ON users
  FOR ALL USING (auth_id = auth.uid());

CREATE POLICY "exam_logs_own" ON exam_logs
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "card_reviews_own" ON card_reviews
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "vocab_logs_own" ON vocab_logs
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "encouragement_settings_own" ON encouragement_settings
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "encouragement_logs_own" ON encouragement_logs
  FOR ALL USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Storage バケット（画像アップロード用）
-- Supabase ダッシュボードまたは以下のSQLで作成:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('encouragement-images', 'encouragement-images', true);
