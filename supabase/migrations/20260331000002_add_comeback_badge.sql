-- 復帰バッジ: 一度ストリークが途切れた後に戻ってきたユーザーへ
insert into badges (id, name, icon, description, category, condition_type, condition_value, sort_order)
values (
  'comeback',
  '復帰！',
  '🔄',
  '一度途切れても、また戻ってきた。それが一番大切',
  'social',
  'comeback',
  1,
  100
)
on conflict (id) do nothing;
