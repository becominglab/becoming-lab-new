create table if not exists device_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  athlete_id text,
  connected_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, provider)
);

-- RLS を有効化
alter table device_integrations enable row level security;

-- ユーザーは自分のレコードのみ参照・操作可能
create policy "Users can view own integrations"
  on device_integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own integrations"
  on device_integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own integrations"
  on device_integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete own integrations"
  on device_integrations for delete
  using (auth.uid() = user_id);

-- updated_at を自動更新するトリガー
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger device_integrations_updated_at
  before update on device_integrations
  for each row
  execute function update_updated_at_column();
