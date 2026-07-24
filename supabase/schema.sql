create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  author_name text not null default 'Editorial Team',
  category text not null default 'General',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;

create trigger posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts
for select
using (published = true);

drop policy if exists "Public can insert posts" on public.posts;
create policy "Public can insert posts"
on public.posts
for insert
with check (true);

drop policy if exists "Public can update posts" on public.posts;
create policy "Public can update posts"
on public.posts
for update
using (true)
with check (true);

drop policy if exists "Public can delete posts" on public.posts;
create policy "Public can delete posts"
on public.posts
for delete
using (true);