-- Migration v2 — à exécuter si la table dishes existe déjà

-- 1. Ajouter la colonne author_name
alter table public.dishes
  add column if not exists author_name text;

-- 2. Mettre à jour la contrainte de rating (1-5 → 0-20)
alter table public.dishes
  drop constraint if exists dishes_rating_check;
alter table public.dishes
  add constraint dishes_rating_check check (rating between 0 and 20);

-- 3. Remplacer la politique RLS globale par des politiques séparées
drop policy if exists "Users manage their own dishes" on public.dishes;

create policy "Authenticated users can read all dishes"
  on public.dishes for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own dishes"
  on public.dishes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own dishes"
  on public.dishes for update
  using (auth.uid() = user_id);

create policy "Users can delete own dishes"
  on public.dishes for delete
  using (auth.uid() = user_id);
