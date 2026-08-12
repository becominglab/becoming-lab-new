alter table public_profiles
  add column if not exists default_visibility text not null default 'public'
  check (default_visibility in ('public', 'followers', 'private'));
