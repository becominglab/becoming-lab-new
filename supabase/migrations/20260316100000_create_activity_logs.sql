create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  activity_type text not null,
  name text,
  distance_km numeric(8,2),
  duration_minutes integer,
  heart_rate_avg integer,
  elevation_m numeric(8,1),
  notes text,
  source text not null default 'manual' check (source in ('manual', 'strava')),
  strava_activity_id bigint unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの日付順取得を高速化
create index idx_activity_logs_user_date on activity_logs (user_id, date desc);

-- RLS
alter table activity_logs enable row level security;

create policy "Users can view own activity_logs"
  on activity_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own activity_logs"
  on activity_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own activity_logs"
  on activity_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete own activity_logs"
  on activity_logs for delete
  using (auth.uid() = user_id);

-- updated_at 自動更新（既存の関数を再利用）
create trigger activity_logs_updated_at
  before update on activity_logs
  for each row
  execute function update_updated_at_column();
