-- 投稿に画像URL追加
alter table posts add column if not exists image_url text;

-- トレンド用インデックス（最近7日の投稿取得を高速化）
create index if not exists posts_created_at_idx on posts(created_at desc);

-- 通知リアルタイム（Supabase Realtime REPLICA IDENTITY FULL）
alter table notifications replica identity full;
