-- 投稿の公開範囲設定
alter table posts
  add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'followers', 'private'));

comment on column posts.visibility is '公開範囲: public=全体, followers=フォロワーのみ, private=自分のみ';
