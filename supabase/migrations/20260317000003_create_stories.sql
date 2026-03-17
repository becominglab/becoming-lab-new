-- ストーリーテーブル（既存の場合はカラム追加で対応）
create table if not exists stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  chapter text not null,
  content text not null,
  entry_type text default 'everyday' check (entry_type in ('milestone', 'turning_point', 'everyday', 'insight')) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 既存テーブルに足りないカラムを追加
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'date') then
    alter table stories add column date date not null default current_date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'chapter') then
    alter table stories add column chapter text not null default '';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'entry_type') then
    alter table stories add column entry_type text default 'everyday' not null;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'updated_at') then
    alter table stories add column updated_at timestamptz default now() not null;
  end if;
end $$;

-- インデックス（dateカラムが存在する場合のみ）
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'stories' and column_name = 'date') then
    if not exists (select 1 from pg_indexes where indexname = 'idx_stories_user_date') then
      create index idx_stories_user_date on stories(user_id, date desc);
    end if;
  end if;
end $$;

alter table stories enable row level security;

-- RLSポリシー（既存なら無視）
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'stories' and policyname = 'Users can view own stories') then
    create policy "Users can view own stories" on stories for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'stories' and policyname = 'Users can insert own stories') then
    create policy "Users can insert own stories" on stories for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'stories' and policyname = 'Users can update own stories') then
    create policy "Users can update own stories" on stories for update using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'stories' and policyname = 'Users can delete own stories') then
    create policy "Users can delete own stories" on stories for delete using (auth.uid() = user_id);
  end if;
end $$;

-- トリガー（既存なら無視）
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'stories_updated_at') then
    create trigger stories_updated_at
      before update on stories
      for each row execute function extensions.moddatetime(updated_at);
  end if;
end $$;
