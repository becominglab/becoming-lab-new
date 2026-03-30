-- ============================================================
-- comments テーブルを正しいスキーマに修正
-- (既存テーブルを DROP して再作成)
-- ============================================================

-- 既存のトリガーを削除
drop trigger if exists after_comment_insert on comments;
drop trigger if exists after_comment_delete on comments;
drop trigger if exists after_comment_notify on comments;
drop trigger if exists set_comments_updated_at on comments;

-- 既存のインデックスを削除
drop index if exists comments_post_id_idx;
drop index if exists comments_user_id_idx;

-- 既存の comments テーブルを削除して再作成
drop table if exists comments cascade;

create table comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  content     text not null check (char_length(content) between 1 and 300),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index comments_post_id_idx on comments(post_id, created_at);
create index comments_user_id_idx on comments(user_id);

create trigger set_comments_updated_at
  before update on comments
  for each row execute function extensions.moddatetime(updated_at);

-- コメント数カラムを posts に追加（なければ）
alter table posts add column if not exists comment_count integer not null default 0;

-- コメントカウント関数
create or replace function increment_comment_count()
returns trigger language plpgsql as $$
begin
  update posts set comment_count = comment_count + 1 where id = new.post_id;
  return new;
end;
$$;

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
-- notifications テーブル（なければ作成）
-- ============================================================
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  actor_id    uuid references auth.users(id) on delete set null,
  type        text not null,
  post_id     uuid references posts(id) on delete cascade,
  body        text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on notifications(user_id, is_read, created_at desc);

alter table notifications enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'notifications' and policyname = 'notifications_select'
  ) then
    create policy "notifications_select" on notifications
      for select using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'notifications' and policyname = 'notifications_update'
  ) then
    create policy "notifications_update" on notifications
      for update using (auth.uid() = user_id);
  end if;
end;
$$;

-- ============================================================
-- コメント通知トリガー
-- ============================================================
create or replace function create_comment_notification()
returns trigger language plpgsql as $$
declare
  v_post_user_id uuid;
begin
  select user_id into v_post_user_id from posts where id = new.post_id;
  if v_post_user_id is null or v_post_user_id = new.user_id then
    return new;
  end if;
  insert into notifications(user_id, actor_id, type, post_id)
  values (v_post_user_id, new.user_id, 'comment', new.post_id);
  return new;
end;
$$;

drop trigger if exists after_comment_notify on comments;
create trigger after_comment_notify
  after insert on comments
  for each row execute function create_comment_notification();

-- ============================================================
-- リアクション通知トリガー
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

drop trigger if exists after_reaction_notify on reactions;
create trigger after_reaction_notify
  after insert on reactions
  for each row execute function create_reaction_notification();

-- ============================================================
-- フォロー通知トリガー
-- ============================================================
create or replace function create_follow_notification()
returns trigger language plpgsql as $$
begin
  insert into notifications(user_id, actor_id, type)
  values (new.following_id, new.follower_id, 'follow');
  return new;
end;
$$;

drop trigger if exists after_follow_notify on follows;
create trigger after_follow_notify
  after insert on follows
  for each row execute function create_follow_notification();
