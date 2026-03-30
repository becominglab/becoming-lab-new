-- ブックマークテーブル
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, post_id)
);

-- 投稿タグ
alter table posts add column if not exists tags text[] not null default '{}';

-- コメントテーブル（既存でなければ作成）
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check(length(content) between 1 and 300),
  created_at timestamptz not null default now()
);

-- RLS: bookmarks
alter table bookmarks enable row level security;
create policy "bookmarks_select_own" on bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on bookmarks for delete using (auth.uid() = user_id);

-- RLS: comments
alter table comments enable row level security;
create policy "comments_select_all" on comments for select using (
  exists (
    select 1 from posts p
    where p.id = comments.post_id
    and (
      p.user_id = auth.uid()
      or exists (select 1 from follows f where f.follower_id = auth.uid() and f.following_id = p.user_id)
      or exists (select 1 from public_profiles pp where pp.user_id = p.user_id and pp.is_public = true)
    )
  )
);
create policy "comments_insert_own" on comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on comments for delete using (auth.uid() = user_id);

-- RLS: posts に公開ユーザーの投稿も閲覧できるポリシーを追加
-- (既存ポリシーがあれば削除して再作成)
drop policy if exists "posts_select_feed" on posts;
drop policy if exists "posts_select_own" on posts;
drop policy if exists "posts_select_public" on posts;

create policy "posts_select_feed" on posts for select using (
  -- 自分の投稿 OR フォロー中ユーザーの投稿 OR 公開ユーザーの投稿
  auth.uid() = user_id
  or exists (
    select 1 from follows f
    where f.follower_id = auth.uid() and f.following_id = posts.user_id
  )
  or exists (
    select 1 from public_profiles pp
    where pp.user_id = posts.user_id and pp.is_public = true
  )
);

-- posts の UPDATE ポリシー（自分の投稿のみ編集可）
drop policy if exists "posts_update_own" on posts;
create policy "posts_update_own" on posts for update using (auth.uid() = user_id);

-- bookmarks インデックス
create index if not exists bookmarks_user_id_idx on bookmarks(user_id);
create index if not exists bookmarks_post_id_idx on bookmarks(post_id);

-- comments インデックス
create index if not exists comments_post_id_idx on comments(post_id);
create index if not exists comments_user_id_idx on comments(user_id);

-- posts.tags インデックス
create index if not exists posts_tags_idx on posts using gin(tags);
