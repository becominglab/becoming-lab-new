-- 挑戦テーブル（既存の場合はカラム追加で対応）
create table if not exists challenges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date not null default current_date,
  target_date date,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  status text default 'active' check (status in ('active', 'completed', 'paused')) not null,
  milestones jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 既存テーブルに足りないカラムを追加（IF NOT EXISTS相当）
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'description') then
    alter table challenges add column description text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'start_date') then
    alter table challenges add column start_date date not null default current_date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'target_date') then
    alter table challenges add column target_date date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'progress') then
    alter table challenges add column progress integer default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'status') then
    alter table challenges add column status text default 'active' not null;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'milestones') then
    alter table challenges add column milestones jsonb default '[]'::jsonb not null;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'challenges' and column_name = 'updated_at') then
    alter table challenges add column updated_at timestamptz default now() not null;
  end if;
end $$;

create index if not exists idx_challenges_user on challenges(user_id, created_at desc);

alter table challenges enable row level security;

-- RLSポリシー（既存なら無視）
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'challenges' and policyname = 'Users can view own challenges') then
    create policy "Users can view own challenges" on challenges for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'challenges' and policyname = 'Users can insert own challenges') then
    create policy "Users can insert own challenges" on challenges for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'challenges' and policyname = 'Users can update own challenges') then
    create policy "Users can update own challenges" on challenges for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'challenges' and policyname = 'Users can delete own challenges') then
    create policy "Users can delete own challenges" on challenges for delete using (auth.uid() = user_id);
  end if;
end $$;

-- トリガー（既存なら無視）
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'challenges_updated_at') then
    create trigger challenges_updated_at
      before update on challenges
      for each row execute function extensions.moddatetime(updated_at);
  end if;
end $$;
