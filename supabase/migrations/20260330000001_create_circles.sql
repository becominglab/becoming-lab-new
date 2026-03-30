-- circles: 挑戦サークル（4-6人の小グループ）
create table circles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  theme_tag text not null,
  description text check (char_length(description) <= 200),
  max_members int default 6 check (max_members between 2 and 10),
  is_public boolean default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- circle_members
create table circle_members (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz default now(),
  unique(circle_id, user_id)
);

-- circle_posts: サークル内のみ見える投稿
create table circle_posts (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid not null references circles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  created_at timestamptz default now()
);

-- indexes
create index on circles(theme_tag);
create index on circle_members(circle_id);
create index on circle_members(user_id);
create index on circle_posts(circle_id, created_at desc);

-- updated_at trigger
create trigger handle_circles_updated_at
  before update on circles
  for each row execute procedure moddatetime(updated_at);

-- RLS
alter table circles enable row level security;
alter table circle_members enable row level security;
alter table circle_posts enable row level security;

-- circles: 公開サークルは誰でも閲覧可
create policy "circles_select" on circles
  for select using (is_public = true or created_by = auth.uid());

-- circles: 作成は認証ユーザー
create policy "circles_insert" on circles
  for insert with check (auth.uid() is not null and created_by = auth.uid());

-- circles: 更新/削除は作成者のみ
create policy "circles_update" on circles
  for update using (created_by = auth.uid());

create policy "circles_delete" on circles
  for delete using (created_by = auth.uid());

-- circle_members: メンバーは同じサークルのメンバーが閲覧可
create policy "circle_members_select" on circle_members
  for select using (
    exists (
      select 1 from circle_members cm
      where cm.circle_id = circle_members.circle_id
        and cm.user_id = auth.uid()
    )
    or exists (
      select 1 from circles c
      where c.id = circle_members.circle_id and c.is_public = true
    )
  );

-- circle_members: 参加は自分のみ（サークルが満員でないことはAPIで確認）
create policy "circle_members_insert" on circle_members
  for insert with check (user_id = auth.uid());

-- circle_members: 退出は自分のみ
create policy "circle_members_delete" on circle_members
  for delete using (user_id = auth.uid());

-- circle_posts: サークルメンバーのみ閲覧
create policy "circle_posts_select" on circle_posts
  for select using (
    exists (
      select 1 from circle_members cm
      where cm.circle_id = circle_posts.circle_id
        and cm.user_id = auth.uid()
    )
  );

-- circle_posts: サークルメンバーのみ投稿
create policy "circle_posts_insert" on circle_posts
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from circle_members cm
      where cm.circle_id = circle_posts.circle_id
        and cm.user_id = auth.uid()
    )
  );

-- circle_posts: 自分の投稿のみ削除
create policy "circle_posts_delete" on circle_posts
  for delete using (user_id = auth.uid());
