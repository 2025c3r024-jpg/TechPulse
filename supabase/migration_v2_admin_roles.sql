-- ============================================================
--  TechPulse — Migration v2: Admin Roles & Security Hardening
--  Run this AFTER migration.sql in your Supabase SQL Editor
-- ============================================================

-- ── Add role column to profiles ───────────────────────────────
alter table public.profiles
  add column if not exists role text not null default 'user';

-- ── Helper function: is current user an admin? ────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Promote yourself to admin (run once with your user id) ────
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<your-auth-user-id>';

-- ── Tighten article policies (admin-only write) ───────────────
drop policy if exists "articles_auth_insert"   on public.articles;
drop policy if exists "articles_author_update" on public.articles;
drop policy if exists "articles_author_delete" on public.articles;

create policy "articles_admin_insert" on public.articles
  for insert with check (public.is_admin());

create policy "articles_admin_update" on public.articles
  for update using (public.is_admin());

create policy "articles_admin_delete" on public.articles
  for delete using (public.is_admin());

-- ── Tighten category policies (admin-only write) ──────────────
drop policy if exists "categories_auth_insert" on public.categories;
drop policy if exists "categories_auth_update" on public.categories;
drop policy if exists "categories_auth_delete" on public.categories;

create policy "categories_admin_insert" on public.categories
  for insert with check (public.is_admin());

create policy "categories_admin_update" on public.categories
  for update using (public.is_admin());

create policy "categories_admin_delete" on public.categories
  for delete using (public.is_admin());

-- ── Tighten tag policies (admin-only write) ───────────────────
drop policy if exists "tags_auth_write" on public.tags;

create policy "tags_admin_write" on public.tags
  for insert with check (public.is_admin());

-- ── Tighten article_tags policies (admin-only write) ──────────
drop policy if exists "article_tags_auth_write"  on public.article_tags;
drop policy if exists "article_tags_auth_delete" on public.article_tags;

create policy "article_tags_admin_write" on public.article_tags
  for insert with check (public.is_admin());

create policy "article_tags_admin_delete" on public.article_tags
  for delete using (public.is_admin());

-- ── Newsletter read: admin-only ───────────────────────────────
-- (already restricted to auth users; no change needed)

-- ── Comment rate limiting via DB ─────────────────────────────
-- Prevent more than 5 comments per user per 5 minutes
create or replace function public.check_comment_rate_limit()
returns trigger language plpgsql security definer as $$
begin
  if (
    select count(*) from public.comments
    where user_id = new.user_id
      and created_at > now() - interval '5 minutes'
  ) >= 5 then
    raise exception 'Rate limit exceeded: too many comments. Please wait a few minutes.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_comment_rate_limit on public.comments;
create trigger enforce_comment_rate_limit
  before insert on public.comments
  for each row execute procedure public.check_comment_rate_limit();
