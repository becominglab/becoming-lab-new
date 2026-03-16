create table if not exists health_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_at timestamptz not null,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  muscle_mass_kg numeric(5,2),
  muscle_score integer,
  visceral_fat_level numeric(4,1),
  basal_metabolic_rate integer,
  body_age integer,
  bone_mass_kg numeric(4,2),
  bmi numeric(4,1),
  source text not null default 'manual' check (source in ('manual', 'healthplanet')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの日付順取得を高速化
create index idx_health_measurements_user_date
  on health_measurements (user_id, measured_at desc);

-- RLS
alter table health_measurements enable row level security;

create policy "Users can view own health_measurements"
  on health_measurements for select
  using (auth.uid() = user_id);

create policy "Users can insert own health_measurements"
  on health_measurements for insert
  with check (auth.uid() = user_id);

create policy "Users can update own health_measurements"
  on health_measurements for update
  using (auth.uid() = user_id);

create policy "Users can delete own health_measurements"
  on health_measurements for delete
  using (auth.uid() = user_id);

-- updated_at 自動更新
create trigger health_measurements_updated_at
  before update on health_measurements
  for each row
  execute function update_updated_at_column();
