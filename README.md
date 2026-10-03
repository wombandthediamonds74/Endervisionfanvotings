# Endervisionfanvotings
README.md
# Endervision Fan Voting

Une page de vote style VMA avec :
- une liste d’artistes
- un système de vote de 1 à 3 points
- une page admin protégée par mot de passe
- stockage des votes en local et prêt pour Supabase

## Mot de passe admin

`Streamhades032726`

## Fichiers

- `index.html` : page publique de vote
- `style.css` : style VMA
- `app.js` : logique de vote
- `admin.html` : page d'administration
- `admin.js` : vérification du mot de passe et affichage des résultats

## Artistes

- Artriana 🇩🇪
- Womb 🇮🇹
- Stats (Spilled) 🇵🇱
- Yourfavflopsender 🇺🇸
- Princess Glambur 🇫🇷
- Billoga 🇪🇸
- Ariclocksurfavs 🇮🇱
- Bigacie Floprams 🇬🇧

## Supabase (optionnel)

Pour ajouter une vraie base de données Supabase :

1. Créez un projet Supabase.
2. Dans SQL Editor, exécutez :

```sql
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  artist_name text not null,
  points integer not null check (points >= 1 and points <= 3),
  created_at timestamptz not null default now()
);

alter table public.votes enable row level security;

create policy "Allow inserts"
on public.votes
for insert
with check (true);

create policy "Allow reads"
on public.votes
for select
using (true);