-- public_profiles に is_mentor フラグを追加
alter table public_profiles
  add column if not exists is_mentor boolean default false;

-- mentor_connections: メンター接続 (リクエスト→承認)
create table mentor_connections (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  mentee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  message text check (char_length(message) <= 200),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(mentor_id, mentee_id),
  check(mentor_id != mentee_id)
);

create index on mentor_connections(mentor_id);
create index on mentor_connections(mentee_id);

create trigger handle_mentor_connections_updated_at
  before update on mentor_connections
  for each row execute function extensions.moddatetime(updated_at);

-- RLS
alter table mentor_connections enable row level security;

-- 当事者のみ閲覧可
create policy "mentor_connections_select" on mentor_connections
  for select using (
    mentor_id = auth.uid() or mentee_id = auth.uid()
  );

-- リクエストは mentee 本人のみ
create policy "mentor_connections_insert" on mentor_connections
  for insert with check (mentee_id = auth.uid());

-- 承認/却下は mentor、退出は mentee
create policy "mentor_connections_update" on mentor_connections
  for update using (
    mentor_id = auth.uid() or mentee_id = auth.uid()
  );

create policy "mentor_connections_delete" on mentor_connections
  for delete using (
    mentor_id = auth.uid() or mentee_id = auth.uid()
  );
