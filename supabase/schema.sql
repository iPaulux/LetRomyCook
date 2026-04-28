-- Run this in your Supabase SQL editor (initial setup)

-- Dishes table
create table if not exists public.dishes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  author_name text,
  name        text not null,
  description text,
  category    text not null default 'Plat',
  rating      integer not null check (rating between 0 and 20),
  photo_url   text,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.dishes enable row level security;

-- All authenticated users can read all dishes (needed for "Tous les plats" tab)
create policy "Authenticated users can read all dishes"
  on public.dishes for select
  using (auth.role() = 'authenticated');

-- Users can only insert their own dishes
create policy "Users can insert own dishes"
  on public.dishes for insert
  with check (auth.uid() = user_id);

-- Users can only update their own dishes
create policy "Users can update own dishes"
  on public.dishes for update
  using (auth.uid() = user_id);

-- Users can only delete their own dishes
create policy "Users can delete own dishes"
  on public.dishes for delete
  using (auth.uid() = user_id);

-- Storage bucket for photos
insert into storage.buckets (id, name, public)
  values ('dish-photos', 'dish-photos', true)
  on conflict do nothing;

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'dish-photos' and auth.role() = 'authenticated');

create policy "Photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'dish-photos');

create policy "Users can update their own photos"
  on storage.objects for update
  using (bucket_id = 'dish-photos' and auth.role() = 'authenticated');

create policy "Users can delete their own photos"
  on storage.objects for delete
  using (bucket_id = 'dish-photos' and auth.role() = 'authenticated');
