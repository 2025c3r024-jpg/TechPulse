
-- ============================================================
--  TechPulse — Supabase Migration
--  Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── profiles ──────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  display_name  text,
  avatar_url    text,
  bio           text,
  role          text not null default 'user',
  created_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── categories ────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,
  color       text
);

-- Seed default categories
insert into public.categories (name, slug, description) values
  ('Phones',     'phones',     'Smartphones and mobile devices'),
  ('Laptops',    'laptops',    'Laptop and notebook computers'),
  ('AI',         'ai',         'Artificial intelligence & machine learning'),
  ('Gaming',     'gaming',     'Gaming hardware and releases'),
  ('Wearables',  'wearables',  'Smartwatches and wearable tech'),
  ('Processors', 'processors', 'CPUs, GPUs and silicon')
on conflict (slug) do nothing;

-- ── tags ──────────────────────────────────────────────────────
create table if not exists public.tags (
  id   uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

-- ── articles ──────────────────────────────────────────────────
create table if not exists public.articles (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  content      text not null default '',
  cover_image  text,
  category_id  uuid references public.categories(id) on delete set null,
  author_id    uuid references public.profiles(id) on delete set null,
  published    boolean not null default false,
  featured     boolean not null default false,
  view_count   integer not null default 0,
  read_time    integer,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Full-text search index on title
create index if not exists articles_title_fts on public.articles
  using gin(to_tsvector('english', title));

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
  before update on public.articles
  for each row execute procedure public.update_updated_at();

-- ── article_tags ──────────────────────────────────────────────
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id     uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ── bookmarks ─────────────────────────────────────────────────
create table if not exists public.bookmarks (
  user_id    uuid references public.profiles(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);

-- ── comments ──────────────────────────────────────────────────
create table if not exists public.comments (
  id         uuid primary key default uuid_generate_v4(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  body       text not null,
  likes      integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
  before update on public.comments
  for each row execute procedure public.update_updated_at();

-- ── newsletter_subscribers ────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default uuid_generate_v4(),
  email         text not null unique,
  subscribed_at timestamptz default now()
);

-- ============================================================
--  Row Level Security
-- ============================================================

alter table public.profiles               enable row level security;
alter table public.categories             enable row level security;
alter table public.tags                   enable row level security;
alter table public.articles               enable row level security;
alter table public.article_tags           enable row level security;
alter table public.bookmarks              enable row level security;
alter table public.comments               enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- profiles
create policy "profiles_public_read"  on public.profiles for select using (true);
create policy "profiles_owner_update" on public.profiles for update using (auth.uid() = id);

-- categories (public read, admin write — simplified: any auth user)
create policy "categories_public_read"  on public.categories for select using (true);
create policy "categories_auth_insert"  on public.categories for insert with check (auth.uid() is not null);
create policy "categories_auth_update"  on public.categories for update using (auth.uid() is not null);
create policy "categories_auth_delete"  on public.categories for delete using (auth.uid() is not null);

-- tags
create policy "tags_public_read"  on public.tags for select using (true);
create policy "tags_auth_write"   on public.tags for insert with check (auth.uid() is not null);

-- articles
create policy "articles_public_read"   on public.articles for select using (published = true or auth.uid() = author_id);
create policy "articles_auth_insert"   on public.articles for insert with check (auth.uid() is not null);
create policy "articles_author_update" on public.articles for update using (auth.uid() is not null);
create policy "articles_author_delete" on public.articles for delete using (auth.uid() is not null);

-- article_tags
create policy "article_tags_public_read" on public.article_tags for select using (true);
create policy "article_tags_auth_write"  on public.article_tags for insert with check (auth.uid() is not null);
create policy "article_tags_auth_delete" on public.article_tags for delete using (auth.uid() is not null);

-- bookmarks
create policy "bookmarks_owner_read"   on public.bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_owner_insert" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_owner_delete" on public.bookmarks for delete using (auth.uid() = user_id);

-- comments
create policy "comments_public_read"  on public.comments for select using (true);
create policy "comments_auth_insert"  on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_owner_update" on public.comments for update using (auth.uid() = user_id or auth.uid() is not null);
create policy "comments_owner_delete" on public.comments for delete using (auth.uid() = user_id);

-- newsletter
create policy "newsletter_anyone_insert" on public.newsletter_subscribers for insert with check (true);
create policy "newsletter_auth_read"     on public.newsletter_subscribers for select using (auth.uid() is not null);

-- ============================================================
--  Realtime (enable for comments)
-- ============================================================
alter publication supabase_realtime add table public.comments;

-- ============================================================
--  Sample article (remove in production)
-- ============================================================
-- Uncomment to seed a sample article after you've signed up:
-- insert into public.articles (title, slug, excerpt, content, published, featured, read_time, published_at)
-- values (
--   'Welcome to TechPulse 🚀',
--   'welcome-to-techpulse',
--   'Your new home for the latest in technology — launches, reviews, and deep dives.',
--   '## Welcome to TechPulse\n\nThis is your first article. Edit it from the **Admin panel**.\n\n### What you can do\n- Read articles by category\n- Bookmark your favourites\n- Leave comments\n- Subscribe to the newsletter\n\nHappy reading!',
--   true,
--   true,
--   2,
--   now()
-- );
