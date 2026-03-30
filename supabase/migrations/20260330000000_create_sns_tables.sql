-- ============================================================
-- SNS機能テーブル (Phase 0 + Phase 1)
-- ============================================================

-- moddatetime拡張は既に有効化済み

-- ------------------------------------------------------------
-- 1. public_profiles — 公開プロフィール (1 user = 1 row)
-- ------------------------------------------------------------
create table if not exists public_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  nickname text not null check (char_length(nickname) between 1 and 30),
  avatar_url text,
  bio text check (bio is null or char_length(bio) <= 100),
  challenge_tags text[] not null default '{}',
  update_phase text not null default 'exploring'
    check (update_phase in ('exploring', 'starting', 'building', 'maintaining')),
  seeking text
    check (seeking is null or seeking in ('accountability', 'inspiration', 'advice', 'companionship')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_public_profiles_user on public_profiles(user_id);
create index if not exists idx_public_profiles_public on public_profiles(is_public) where is_public = true;

alter table public_profiles enable row level security;

create policy "Users can view public profiles"
  on public_profiles for select
  using (auth.uid() = user_id or is_public = true);
create policy "Users can insert own public profile"
  on public_profiles for insert
  with check (auth.uid() = user_id);
create policy "Users can update own public profile"
  on public_profiles for update
  using (auth.uid() = user_id);
create policy "Users can delete own public profile"
  on public_profiles for delete
  using (auth.uid() = user_id);

create trigger handle_public_profiles_updated_at
  before update on public_profiles
  for each row execute procedure moddatetime(updated_at);

-- ------------------------------------------------------------
-- 2. follows — フォロー関係
-- ------------------------------------------------------------
create table if not exists follows (
  id uuid default gen_random_uuid() primary key,
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

create index if not exists idx_follows_follower on follows(follower_id);
create index if not exists idx_follows_following on follows(following_id);

alter table follows enable row level security;

create policy "Users can view own follow relationships"
  on follows for select
  using (auth.uid() = follower_id or auth.uid() = following_id);
create policy "Users can follow others"
  on follows for insert
  with check (auth.uid() = follower_id);
create policy "Users can unfollow"
  on follows for delete
  using (auth.uid() = follower_id);

-- ------------------------------------------------------------
-- 3. posts — タイムライン投稿
-- ------------------------------------------------------------
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  post_type text not null
    check (post_type in ('update', 'auto_log', 'declaration', 'milestone')),
  content jsonb not null default '{}',
  source_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_user_created on posts(user_id, created_at desc);
create index if not exists idx_posts_created on posts(created_at desc);

alter table posts enable row level security;

-- 自分の投稿は常に閲覧可能
create policy "Users can view own posts"
  on posts for select
  using (auth.uid() = user_id);

-- フォロー中の公開ユーザーの投稿を閲覧可能
create policy "Users can view followed users posts"
  on posts for select
  using (
    exists (
      select 1 from follows f
      join public_profiles pp on pp.user_id = posts.user_id
      where f.follower_id = auth.uid()
        and f.following_id = posts.user_id
        and pp.is_public = true
    )
  );

create policy "Users can insert own posts"
  on posts for insert
  with check (auth.uid() = user_id);
create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. reactions — リアクション
-- ------------------------------------------------------------
create table if not exists reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  reaction_type text not null
    check (reaction_type in ('nice_update', 'together', 'helpful', 'keep_going')),
  created_at timestamptz not null default now(),
  unique(post_id, user_id, reaction_type)
);

create index if not exists idx_reactions_post on reactions(post_id);
create index if not exists idx_reactions_user on reactions(user_id);

alter table reactions enable row level security;

-- 閲覧可能な投稿のリアクションを閲覧可能
create policy "Users can view reactions on visible posts"
  on reactions for select
  using (
    exists (
      select 1 from posts p
      where p.id = reactions.post_id
        and (
          p.user_id = auth.uid()
          or exists (
            select 1 from follows f
            join public_profiles pp on pp.user_id = p.user_id
            where f.follower_id = auth.uid()
              and f.following_id = p.user_id
              and pp.is_public = true
          )
        )
    )
  );

create policy "Users can add reactions"
  on reactions for insert
  with check (auth.uid() = user_id);
create policy "Users can remove own reactions"
  on reactions for delete
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. badges — バッジ定義マスタ
-- ------------------------------------------------------------
create table if not exists badges (
  id text primary key,
  name text not null,
  icon text not null,
  description text not null,
  category text not null
    check (category in ('streak', 'challenge', 'social', 'story', 'body')),
  condition_type text not null,
  condition_value int not null default 1,
  sort_order int not null default 0
);

alter table badges enable row level security;
create policy "Anyone can view badges" on badges for select using (true);

-- ------------------------------------------------------------
-- 6. user_badges — ユーザー獲得バッジ
-- ------------------------------------------------------------
create table if not exists user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  badge_id text references badges(id) on delete cascade not null,
  earned_at timestamptz not null default now(),
  is_pinned boolean not null default false,
  unique(user_id, badge_id)
);

create index if not exists idx_user_badges_user on user_badges(user_id);

alter table user_badges enable row level security;

create policy "Users can view own badges"
  on user_badges for select
  using (auth.uid() = user_id);
create policy "Users can view public users badges"
  on user_badges for select
  using (
    exists (
      select 1 from public_profiles pp
      where pp.user_id = user_badges.user_id and pp.is_public = true
    )
  );
create policy "Users can earn badges"
  on user_badges for insert
  with check (auth.uid() = user_id);
create policy "Users can update own badges"
  on user_badges for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 初期バッジデータ (15種)
-- ------------------------------------------------------------
insert into badges (id, name, icon, description, category, condition_type, condition_value, sort_order) values
  ('streak_3',           '3日連続',           '🔥', '3日連続で記録をつけた',           'streak',    'body_streak',          3,  1),
  ('streak_7',           '1週間連続',         '🔥', '7日連続で記録をつけた',           'streak',    'body_streak',          7,  2),
  ('streak_30',          '1ヶ月連続',         '🔥', '30日連続で記録をつけた',          'streak',    'body_streak',         30,  3),
  ('streak_100',         '100日連続',         '💎', '100日連続で記録をつけた',         'streak',    'body_streak',        100,  4),
  ('first_log',          '最初の一歩',        '🌱', '初めてのBody記録',               'body',      'body_log_count',       1,  5),
  ('log_50',             '50回記録',          '📝', '合計50回の記録を達成',            'body',      'body_log_count',      50,  6),
  ('first_declaration',  '宣言者',            '📣', '初めての宣言を投稿した',          'challenge', 'declaration_count',    1,  7),
  ('first_challenge',    '挑戦開始',          '🎯', '初めてのチャレンジを登録した',     'challenge', 'challenge_count',      1,  8),
  ('challenge_complete', 'チャレンジ達成',     '🏆', 'チャレンジを1つ完了した',         'challenge', 'challenge_complete',   1,  9),
  ('first_story',        'ストーリーテラー',   '📖', '初めてのストーリーを投稿した',     'story',     'story_count',          1, 10),
  ('story_10',           '物語の紡ぎ手',       '✨', '10件のストーリーを投稿した',      'story',     'story_count',         10, 11),
  ('first_follow',       'つながり',           '🤝', '初めて誰かをフォローした',        'social',    'follow_count',         1, 12),
  ('follow_10',          'コミュニティ',       '🌐', '10人をフォローした',             'social',    'follow_count',        10, 13),
  ('first_reaction',     'リアクター',         '👏', '初めてリアクションを送った',       'social',    'reaction_given_count', 1, 14),
  ('first_update',       '更新報告',           '📋', '初めての更新ポストを投稿した',    'social',    'post_count',           1, 15);
