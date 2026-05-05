-- =========================================
-- Her Clinic — initial schema
-- Paste the entire file into the Supabase SQL editor and run.
-- =========================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================================
-- Enums
-- =========================================
do $$ begin
  create type user_role as enum ('admin','viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('new','contacted','archived');
exception when duplicate_object then null; end $$;

-- =========================================
-- profiles (1:1 with auth.users)
-- =========================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  role        user_role not null default 'viewer',
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- =========================================
-- contact_submissions
-- =========================================
create table if not exists public.contact_submissions (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  email        text not null,
  phone        text,
  service      text,
  message      text,
  locale       text not null default 'en',
  status       submission_status not null default 'new',
  notes        text,
  ip_hash      text,
  user_agent   text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_submissions_created_at on public.contact_submissions(created_at desc);
create index if not exists idx_submissions_status on public.contact_submissions(status);

-- =========================================
-- page_visits
-- =========================================
create table if not exists public.page_visits (
  id            uuid primary key default uuid_generate_v4(),
  path          text not null,
  locale        text,
  referrer      text,
  user_agent    text,
  country       text,
  device        text,
  session_hash  text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_visits_created_at on public.page_visits(created_at desc);
create index if not exists idx_visits_path on public.page_visits(path);
create index if not exists idx_visits_session on public.page_visits(session_hash);

-- =========================================
-- before_after_cases
-- =========================================
create table if not exists public.before_after_cases (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  title_en        text not null,
  title_ar        text not null,
  description_en  text,
  description_ar  text,
  before_url      text,
  after_url       text,
  position        int not null default 0,
  published       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_cases_position on public.before_after_cases(position);

-- =========================================
-- services
-- =========================================
create table if not exists public.services (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  icon            text,
  title_en        text not null,
  title_ar        text not null,
  description_en  text,
  description_ar  text,
  position        int not null default 0,
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =========================================
-- testimonials
-- =========================================
create table if not exists public.testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role_en     text,
  role_ar     text,
  quote_en    text not null,
  quote_ar    text not null,
  rating      int not null default 5 check (rating between 1 and 5),
  position    int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =========================================
-- site_settings (key/value)
-- =========================================
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_cases_touch on public.before_after_cases;
create trigger trg_cases_touch before update on public.before_after_cases
  for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_services_touch on public.services;
create trigger trg_services_touch before update on public.services
  for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_testimonials_touch on public.testimonials;
create trigger trg_testimonials_touch before update on public.testimonials
  for each row execute procedure public.touch_updated_at();

drop trigger if exists trg_settings_touch on public.site_settings;
create trigger trg_settings_touch before update on public.site_settings
  for each row execute procedure public.touch_updated_at();

-- =========================================
-- Storage buckets
-- =========================================
insert into storage.buckets (id, name, public)
  values ('branding','branding', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('cases','cases', true)
  on conflict (id) do nothing;

-- =========================================
-- RLS
-- =========================================
alter table public.profiles            enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.page_visits         enable row level security;
alter table public.before_after_cases  enable row level security;
alter table public.services            enable row level security;
alter table public.testimonials        enable row level security;
alter table public.site_settings       enable row level security;

-- profiles
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- contact_submissions
drop policy if exists submissions_anon_insert on public.contact_submissions;
create policy submissions_anon_insert on public.contact_submissions
  for insert to anon, authenticated with check (true);

drop policy if exists submissions_admin_read on public.contact_submissions;
create policy submissions_admin_read on public.contact_submissions
  for select using (public.is_admin());

drop policy if exists submissions_admin_modify on public.contact_submissions;
create policy submissions_admin_modify on public.contact_submissions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists submissions_admin_delete on public.contact_submissions;
create policy submissions_admin_delete on public.contact_submissions
  for delete using (public.is_admin());

-- page_visits
drop policy if exists visits_anon_insert on public.page_visits;
create policy visits_anon_insert on public.page_visits
  for insert to anon, authenticated with check (true);

drop policy if exists visits_admin_read on public.page_visits;
create policy visits_admin_read on public.page_visits
  for select using (public.is_admin());

drop policy if exists visits_admin_delete on public.page_visits;
create policy visits_admin_delete on public.page_visits
  for delete using (public.is_admin());

-- cases / services / testimonials
drop policy if exists cases_public_read on public.before_after_cases;
create policy cases_public_read on public.before_after_cases
  for select using (published = true or public.is_admin());

drop policy if exists cases_admin_write on public.before_after_cases;
create policy cases_admin_write on public.before_after_cases
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
  for select using (published = true or public.is_admin());

drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
  for select using (published = true or public.is_admin());

drop policy if exists testimonials_admin_write on public.testimonials;
create policy testimonials_admin_write on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- site_settings: anyone reads, admin writes
drop policy if exists settings_public_read on public.site_settings;
create policy settings_public_read on public.site_settings
  for select using (true);

drop policy if exists settings_admin_write on public.site_settings;
create policy settings_admin_write on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage policies
drop policy if exists branding_public_read on storage.objects;
create policy branding_public_read on storage.objects
  for select using (bucket_id = 'branding');

drop policy if exists branding_admin_write on storage.objects;
create policy branding_admin_write on storage.objects
  for insert with check (bucket_id = 'branding' and public.is_admin());

drop policy if exists branding_admin_update on storage.objects;
create policy branding_admin_update on storage.objects
  for update using (bucket_id = 'branding' and public.is_admin());

drop policy if exists branding_admin_delete on storage.objects;
create policy branding_admin_delete on storage.objects
  for delete using (bucket_id = 'branding' and public.is_admin());

drop policy if exists cases_obj_public_read on storage.objects;
create policy cases_obj_public_read on storage.objects
  for select using (bucket_id = 'cases');

drop policy if exists cases_obj_admin_write on storage.objects;
create policy cases_obj_admin_write on storage.objects
  for insert with check (bucket_id = 'cases' and public.is_admin());

drop policy if exists cases_obj_admin_update on storage.objects;
create policy cases_obj_admin_update on storage.objects
  for update using (bucket_id = 'cases' and public.is_admin());

drop policy if exists cases_obj_admin_delete on storage.objects;
create policy cases_obj_admin_delete on storage.objects
  for delete using (bucket_id = 'cases' and public.is_admin());
