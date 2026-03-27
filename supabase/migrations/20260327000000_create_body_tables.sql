-- moddatetime拡張を有効化
create extension if not exists moddatetime with schema extensions;

-- ============================================
-- body_profiles: Why設定（1ユーザー1行）
-- ============================================
create table if not exists body_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  why_text text,
  goal_text text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table body_profiles enable row level security;

create policy "Users can view own body profile"
  on body_profiles for select using (auth.uid() = user_id);
create policy "Users can insert own body profile"
  on body_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own body profile"
  on body_profiles for update using (auth.uid() = user_id);
create policy "Users can delete own body profile"
  on body_profiles for delete using (auth.uid() = user_id);

create trigger body_profiles_updated_at
  before update on body_profiles
  for each row execute function extensions.moddatetime(updated_at);

-- ============================================
-- body_logs: 日次ログ（1ユーザー1日1行）
-- ============================================
create table if not exists body_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  meal_score int not null check (meal_score between 1 and 3),
  workout_score int not null check (workout_score between 1 and 3),
  mood int not null check (mood between 1 and 3),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, date)
);

create index idx_body_logs_user_date on body_logs(user_id, date desc);

alter table body_logs enable row level security;

create policy "Users can view own body logs"
  on body_logs for select using (auth.uid() = user_id);
create policy "Users can insert own body logs"
  on body_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own body logs"
  on body_logs for update using (auth.uid() = user_id);
create policy "Users can delete own body logs"
  on body_logs for delete using (auth.uid() = user_id);

create trigger body_logs_updated_at
  before update on body_logs
  for each row execute function extensions.moddatetime(updated_at);

-- ============================================
-- body_streaks: ストリーク（1ユーザー1行）
-- ============================================
create table if not exists body_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  current_streak int not null default 0,
  max_streak int not null default 0,
  last_log_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table body_streaks enable row level security;

create policy "Users can view own body streaks"
  on body_streaks for select using (auth.uid() = user_id);
create policy "Users can insert own body streaks"
  on body_streaks for insert with check (auth.uid() = user_id);
create policy "Users can update own body streaks"
  on body_streaks for update using (auth.uid() = user_id);
create policy "Users can delete own body streaks"
  on body_streaks for delete using (auth.uid() = user_id);

create trigger body_streaks_updated_at
  before update on body_streaks
  for each row execute function extensions.moddatetime(updated_at);
