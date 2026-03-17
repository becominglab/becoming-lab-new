-- 宣言テーブル
create table if not exists declarations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  pinned boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_declarations_user on declarations(user_id, created_at desc);

alter table declarations enable row level security;

create policy "Users can view own declarations"
  on declarations for select using (auth.uid() = user_id);
create policy "Users can insert own declarations"
  on declarations for insert with check (auth.uid() = user_id);
create policy "Users can update own declarations"
  on declarations for update using (auth.uid() = user_id);
create policy "Users can delete own declarations"
  on declarations for delete using (auth.uid() = user_id);

create trigger declarations_updated_at
  before update on declarations
  for each row execute function extensions.moddatetime(updated_at);
