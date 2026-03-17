-- moddatetime拡張を有効化
create extension if not exists moddatetime with schema extensions;

-- 内省記録テーブル
create table if not exists reflections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  content text not null,
  mood text check (mood in ('calm', 'energized', 'thoughtful', 'grateful', 'struggling')) not null default 'thoughtful',
  prompt text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_reflections_user_date on reflections(user_id, date desc);

alter table reflections enable row level security;

create policy "Users can view own reflections"
  on reflections for select using (auth.uid() = user_id);
create policy "Users can insert own reflections"
  on reflections for insert with check (auth.uid() = user_id);
create policy "Users can update own reflections"
  on reflections for update using (auth.uid() = user_id);
create policy "Users can delete own reflections"
  on reflections for delete using (auth.uid() = user_id);

create trigger reflections_updated_at
  before update on reflections
  for each row execute function extensions.moddatetime(updated_at);
