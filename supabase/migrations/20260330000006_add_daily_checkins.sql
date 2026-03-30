-- ============================================================
-- daily_checkins: 毎日のチェックイン記録（連続日数・習慣化支援）
-- ============================================================
create table if not exists daily_checkins (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  created_at   timestamptz not null default now(),
  unique(user_id, checkin_date)
);

create index if not exists daily_checkins_user_idx
  on daily_checkins(user_id, checkin_date desc);

alter table daily_checkins enable row level security;

create policy "checkins_select" on daily_checkins
  for select using (auth.uid() = user_id);

create policy "checkins_insert" on daily_checkins
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- public_profiles に onboarding_completed フラグを追加
-- ============================================================
alter table public_profiles
  add column if not exists onboarding_completed boolean not null default false;
