-- LUMA - Supabase Schema
-- این کد را در SQL Editor داشبورد Supabase اجرا کنید.

-- 1. پروفایل‌ها
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. پروفایل تولد
create table if not exists public.birth_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  year integer,
  month integer,
  day integer,
  mother_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. تاریخچه تاروت
create table if not exists public.tarot_readings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text,
  cards jsonb,
  interpretation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. کارت روزانه
create table if not exists public.daily_draws (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date_str text not null,
  card_id integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date_str)
);

-- 5. چارت‌های ذخیره شده
create table if not exists public.saved_charts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  input_data jsonb,
  result_data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. تنظیمات کاربر
create table if not exists public.user_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  theme text default 'dark',
  language text default 'fa',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- فعال‌سازی RLS
alter table public.profiles enable row level security;
alter table public.birth_profiles enable row level security;
alter table public.tarot_readings enable row level security;
alter table public.daily_draws enable row level security;
alter table public.saved_charts enable row level security;
alter table public.user_preferences enable row level security;

-- سیاست‌های امنیتی (RLS)
drop policy if exists "Users own profiles" on public.profiles;
create policy "Users own profiles" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users own birth" on public.birth_profiles;
create policy "Users own birth" on public.birth_profiles for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users own readings" on public.tarot_readings;
create policy "Users own readings" on public.tarot_readings for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users own daily" on public.daily_draws;
create policy "Users own daily" on public.daily_draws for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users own charts" on public.saved_charts;
create policy "Users own charts" on public.saved_charts for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users own prefs" on public.user_preferences;
create policy "Users own prefs" on public.user_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- دادن دسترسی (Grants)
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;

-- تریگر ساخت خودکار پروفایل هنگام ثبت‌نام
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'username');
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();