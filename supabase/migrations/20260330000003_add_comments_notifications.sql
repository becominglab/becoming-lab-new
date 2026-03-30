-- ============================================================
-- comments: 投稿へのコメント
-- ============================================================
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  content     text not null check (char_length(content) between 1 and 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists comments_post_id_idx on comments(post_id, created_at);
create index if not exists comments_user_id_idx on comments(user_id);

create trigger set_comments_updated_at
  before update on comments
  for each row execute function extensions.moddatetime(updated_at);

-- コメント数を posts に追加
alter table posts add column if not exists comment_count integer not null default 0;

-- コメント作成時に comment_count をインクリメントする関数
create or replace function increment_comment_count()
returns trigger language plpgsql as $$
begin
  update posts set comment_count = comment_count + 1 where id = new.post_id;
  return new;
end;
$$;

-- コメント削除時にデクリメントする関数
create or replace function decrement_comment_count()
returns trigger language plpgsql as $$
begin
  update posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

create trigger after_comment_insert
  after insert on comments
  for each row execute function increment_comment_count();

create trigger after_comment_delete
  after delete on comments
  for each row execute function decrement_comment_count();

-- RLS
alter table comments enable row level security;

create policy "comments_select" on comments
  for select using (
    exists (
      select 1 from posts p
      join public_profiles pp on pp.user_id = p.user_id
      where p.id = comments.post_id and pp.is_public = true
    )
  );

create policy "comments_insert" on comments
  for insert with check (auth.uid() = user_id);

create policy "comments_delete" on comments
  for delete using (auth.uid() = user_id);

-- ============================================================
-- notifications: 通知テーブル
-- ============================================================
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  actor_id    uuid references auth.users(id) on delete set null,
  type        text not null, -- 'reaction' | 'comment' | 'follow' | 'mentor_request' | 'mentor_accepted'
  post_id     uuid references posts(id) on delete cascade,
  body        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on notifications(user_id, is_read, created_at desc);

-- RLS
alter table notifications enable row level security;

create policy "notifications_select" on notifications
  for select using (auth.uid() = user_id);

create policy "notifications_update" on notifications
  for update using (auth.uid() = user_id);

-- ============================================================
-- コメント時に通知を自動作成するトリガー
-- ============================================================
create or replace function create_comment_notification()
returns trigger language plpgsql as $$
declare
  v_post_user_id uuid;
begin
  -- 投稿者を取得
  select user_id into v_post_user_id from posts where id = new.post_id;
  -- 自分の投稿へのコメントは通知しない
  if v_post_user_id is null or v_post_user_id = new.user_id then
    return new;
  end if;
  insert into notifications(user_id, actor_id, type, post_id)
  values (v_post_user_id, new.user_id, 'comment', new.post_id);
  return new;
end;
$$;

create trigger after_comment_notify
  after insert on comments
  for each row execute function create_comment_notification();

-- ============================================================
-- リアクション時に通知を自動作成するトリガー
-- ============================================================
create or replace function create_reaction_notification()
returns trigger language plpgsql as $$
declare
  v_post_user_id uuid;
begin
  select user_id into v_post_user_id from posts where id = new.post_id;
  if v_post_user_id is null or v_post_user_id = new.user_id then
    return new;
  end if;
  insert into notifications(user_id, actor_id, type, post_id, body)
  values (v_post_user_id, new.user_id, 'reaction', new.post_id, new.reaction_type);
  return new;
end;
$$;

create trigger after_reaction_notify
  after insert on reactions
  for each row execute function create_reaction_notification();

-- ============================================================
-- フォロー時に通知を自動作成するトリガー
-- ============================================================
create or replace function create_follow_notification()
returns trigger language plpgsql as $$
begin
  insert into notifications(user_id, actor_id, type)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end;
$$;

create trigger after_follow_notify
  after insert on follows
  for each row execute function create_follow_notification();
