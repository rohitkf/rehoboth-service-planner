-- ── Profiles table ───────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'volunteer' check (role in ('admin', 'volunteer')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'volunteer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Service plans table ───────────────────────────────────────────────────────
create table if not exists public.service_plans (
  id          uuid primary key default gen_random_uuid(),
  date        date not null unique,
  plan_data   jsonb not null default '{"blocks":[]}'::jsonb,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.service_plans enable row level security;

-- profiles: users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- service_plans: all authenticated users can SELECT
create policy "Authenticated users can view plans"
  on public.service_plans for select
  to authenticated
  using (true);

-- service_plans: only admins can INSERT/UPDATE/DELETE
create policy "Admins can insert plans"
  on public.service_plans for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update plans"
  on public.service_plans for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete plans"
  on public.service_plans for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── To promote a user to admin (run as Supabase service role) ────────────────
-- update public.profiles set role = 'admin' where email = 'your@email.com';
