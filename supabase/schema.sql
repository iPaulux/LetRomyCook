-- Run this in your Supabase SQL editor

-- Dishes table
create table if not exists public.dishes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  category    text not null default 'Plat',
  rating      integer not null check (rating between 1 and 5),
  photo_url   text,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.dishes enable row level security;

create policy "Users manage their own dishes"
  on public.dishes for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage bucket for photos
insert into storage.buckets (id, name, public)
  values ('dish-photos', 'dish-photos', true)
  on conflict do nothing;

-- Storage policies
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
