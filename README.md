# LetRomyCook

Une app de notation des plats cuisinés par Romy — comme Letterboxd, mais pour la nourriture.

## Fonctionnalités

- Ajouter un plat avec photo, catégorie, note (1–5 ★) et description
- Grille de plats avec filtres par catégorie
- Vue détail, modification et suppression
- Statistiques (nombre de plats, note moyenne)
- Authentification par email + mot de passe (Supabase Auth)
- Photos stockées dans Supabase Storage
- PWA installable sur mobile et desktop (service worker, mode hors-ligne)

## Stack

- **React 19** + **Vite 8**
- **Supabase** — auth, base de données PostgreSQL, stockage photos
- **vite-plugin-pwa** — manifest + service worker Workbox
- **Netlify** — hébergement et déploiement continu

## Démarrage local

```bash
npm install
cp .env.example .env   # puis remplis les clés Supabase
npm run dev
```

## Variables d'environnement

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

À définir aussi dans **Netlify → Site configuration → Environment variables** avant de déployer.

## Base de données Supabase

Exécute le fichier `supabase/schema.sql` dans le SQL Editor de ton projet Supabase. Il crée :

- La table `dishes` avec Row Level Security (chaque utilisateur ne voit que ses plats)
- Le bucket de stockage `dish-photos` pour les photos

## Déploiement Netlify

Connecte le repo GitHub à Netlify. Le fichier `netlify.toml` configure automatiquement la commande de build et les redirections SPA.

## Structure du projet

```
src/
  components/
    AddEditModal.jsx   — formulaire d'ajout / modification
    AuthGate.jsx       — écran de connexion
    DishCard.jsx       — carte dans la grille
    DishDetail.jsx     — vue détail d'un plat
    DishGrid.jsx       — grille principale
    Header.jsx         — header sticky avec stats et filtres
    StarRating.jsx     — composant étoiles interactif
  hooks/
    useAuth.js         — gestion de la session Supabase
    useDishes.js       — CRUD plats + upload photos
  lib/
    supabase.js        — client Supabase
supabase/
  schema.sql           — schéma SQL à exécuter dans Supabase
```
