-- event_tag カラムを circles テーブルに追加（イベント識別子用）
alter table circles
  add column if not exists event_tag text;
