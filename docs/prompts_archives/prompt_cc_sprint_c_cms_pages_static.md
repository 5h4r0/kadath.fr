# Sprint C — Seed `cms_pages` : about, mentions légales, CGU, confidentialité

## Contexte

Projet Next.js 15 / Supabase. La table `cms_pages` est opérationnelle. La route
publique `src/app/[locale]/(public)/[slug]/page.tsx` rend n'importe quelle page
publiée via `tiptapToHtml(page.sections)`. Le `SiteFooter` pointe vers :

- `/[locale]/mentions-legales`
- `/[locale]/conditions-utilisation`
- `/[locale]/politique-confidentialite`

Ces routes tombent actuellement en 404. La page `/[locale]/about` n'existe pas
non plus. Ce sprint crée les 4 entrées `cms_pages` avec leur contenu initial
seedé en TipTap JSON, et les publie.

---

## Structure TipTap JSON

`cms_pages.sections` est un document TipTap :
```json
{ "type": "doc", "content": [ …nodes… ] }
```

Nœuds supportés par `tiptapToHtml` :
- `{ "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "…" }] }`
- `{ "type": "paragraph", "content": [{ "type": "text", "text": "…" }] }`
- `{ "type": "paragraph", "content": [{ "type": "text", "text": "…", "marks": [{ "type": "bold" }] }] }`
- `{ "type": "bulletList", "content": [{ "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "…" }] }] }] }`

---

## 1. Migration SQL

**Fichier :** `supabase/migrations/20260418000024_seed_cms_pages_static.sql`

La colonne `lang` sur `cms_pages` est `TEXT NOT NULL DEFAULT 'fr'`. Ces pages
sont rédigées en français — les versions EN seront créées ultérieurement via le
backoffice. Le slug suffit à router (`/[locale]/[slug]` → même slug quelle que
soit la locale, le contenu est en FR pour l'instant).

L'`author_id` existant dans la seed est `'501f1bd9-127e-4515-9434-269ce3ae8bb7'`
(admin ThinkTwice, cf. `seed.sql`). Utiliser ce même UUID.

La colonne `deleted_at` n'existe pas dans la migration 004 mais est référencée
dans `[slug]/page.tsx` (`.is('deleted_at', null)`). Vérifier si elle a été
ajoutée par la migration 017 (`soft_delete_cms_scheduling`) — si oui, l'inclure
normalement ; si non, retirer le filtre de la requête dans la page ou ajouter la
colonne. **Ne pas modifier `[slug]/page.tsx` dans ce sprint** — supposer que la
colonne existe (migration 017 l'ajoute probablement).

```sql
-- Migration 024 — Seed pages CMS statiques
-- Pages : about, mentions-legales, conditions-utilisation, politique-confidentialite

INSERT INTO cms_pages (
  id, author_id, slug, title, resume, template, lang,
  sections, galerie,
  meta_description,
  published, published_at,
  show_in_menu, menu_order, robots
) VALUES

-- ── À PROPOS ────────────────────────────────────────────────────────────────
(
  '00000020-0000-0000-0000-000000000002',
  '501f1bd9-127e-4515-9434-269ce3ae8bb7',
  'about',
  'À propos',
  'ThinkTwice — direction artistique et développement web sur mesure depuis 20 ans.',
  'default',
  'fr',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "À propos de ThinkTwice" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "ThinkTwice est une agence digitale à deux têtes : direction artistique et développement web, ensemble depuis le début." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Notre approche" }]
      },
      {
        "type": "bulletList",
        "content": [
          { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Un interlocuteur unique du brief au déploiement." }] }] },
          { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Code livré propre, testé, documenté." }] }] },
          { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Itérations courtes avec feedback régulier." }] }] },
          { "type": "listItem", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Pas de dépendances inutiles. Pas de complexité gratuite." }] }] }
        ]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Page en cours de rédaction." }]
      }
    ]
  }',
  '[]',
  'ThinkTwice — agence digitale. Direction artistique et développement web sur mesure.',
  true,
  now(),
  false,
  0,
  'index,follow'
),

-- ── MENTIONS LÉGALES ────────────────────────────────────────────────────────
(
  '00000020-0000-0000-0000-000000000003',
  '501f1bd9-127e-4515-9434-269ce3ae8bb7',
  'mentions-legales',
  'Mentions légales',
  NULL,
  'default',
  'fr',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Éditeur" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Steph Dev — Entrepreneur individuel" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "SIRET : 000 000 000 00000" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "75000 Paris, France" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "E-mail : thinktwice@kadath.fr" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Hébergement" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Google Cloud / Firebase App Hosting" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "8 rue de Londres, 75009 Paris" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Données personnelles" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Les données collectées via le formulaire de contact (nom, email, message) sont utilisées uniquement pour répondre à votre demande. Elles ne sont ni vendues, ni cédées à des tiers. Conformément au RGPD, vous disposez d''un droit d''accès, de rectification et de suppression. Pour l''exercer : thinktwice@kadath.fr" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Cookies" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Ce site utilise Umami, une solution d''analyse d''audience respectueuse de la vie privée, sans cookie de traçage tiers." }]
      }
    ]
  }',
  '[]',
  'Mentions légales de kadath.fr — éditeur, hébergement, données personnelles.',
  true,
  now(),
  false,
  0,
  'noindex,nofollow'
),

-- ── CONDITIONS D'UTILISATION ────────────────────────────────────────────────
(
  '00000020-0000-0000-0000-000000000004',
  '501f1bd9-127e-4515-9434-269ce3ae8bb7',
  'conditions-utilisation',
  'Conditions d''utilisation',
  NULL,
  'default',
  'fr',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Conditions d''utilisation" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "L''utilisation de ce site implique l''acceptation des présentes conditions." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Propriété intellectuelle" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "L''ensemble du contenu de ce site (textes, images, design) est la propriété exclusive de ThinkTwice et est protégé par le droit d''auteur. Toute reproduction sans autorisation est interdite." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Limitation de responsabilité" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "ThinkTwice ne saurait être tenu responsable des dommages directs ou indirects résultant de l''utilisation de ce site." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Droit applicable" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux français sont compétents." }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Page en cours de rédaction — contenu définitif à compléter." }]
      }
    ]
  }',
  '[]',
  'Conditions d''utilisation de kadath.fr.',
  true,
  now(),
  false,
  0,
  'noindex,nofollow'
),

-- ── POLITIQUE DE CONFIDENTIALITÉ ────────────────────────────────────────────
(
  '00000020-0000-0000-0000-000000000005',
  '501f1bd9-127e-4515-9434-269ce3ae8bb7',
  'politique-confidentialite',
  'Politique de confidentialité',
  NULL,
  'default',
  'fr',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Responsable du traitement" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "ThinkTwice — thinktwice@kadath.fr" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Données collectées" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Via le formulaire de contact : prénom, nom, email, sujet, message." }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Finalité : répondre à vos demandes. Base légale : intérêt légitime." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Durée de conservation" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Les messages sont conservés 3 ans à compter de la dernière interaction." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Vos droits" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Conformément au RGPD, vous disposez d''un droit d''accès, de rectification, de suppression et d''opposition. Pour l''exercer : thinktwice@kadath.fr" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Cookies et analytics" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Ce site utilise Umami Analytics en mode sans cookie (aucun identifiant persistant, aucune donnée personnelle transmise à des tiers)." }]
      },
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [{ "type": "text", "text": "Hébergement des données" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Les données sont hébergées sur Google Cloud Platform (Firebase App Hosting) et Supabase (PostgreSQL), avec stockage en Europe." }]
      }
    ]
  }',
  '[]',
  'Politique de confidentialité de kadath.fr — RGPD, données collectées, droits.',
  true,
  now(),
  false,
  0,
  'noindex,nofollow'
)

ON CONFLICT (slug) DO NOTHING;
```

---

## 2. Vérification `deleted_at` sur `cms_pages`

La route `[slug]/page.tsx` filtre `.is('deleted_at', null)`. Vérifier que la
colonne existe :

```sql
-- À exécuter dans le Studio pour vérifier
SELECT column_name FROM information_schema.columns
WHERE table_name = 'cms_pages' AND column_name = 'deleted_at';
```

Si la colonne **n'existe pas** (migration 017 ne l'aurait pas ajoutée), créer
une migration séparée :

```sql
-- supabase/migrations/20260418000025_cms_pages_deleted_at.sql
-- (uniquement si la colonne est absente — vérifier d'abord)
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
```

La migration 020 (`20260101000020_cms_pages_deleted_at.sql`) existe déjà dans
le repo — elle a probablement déjà ajouté cette colonne. Dans ce cas, ne pas
créer la migration 025.

---

## 3. Aucune modification de code frontend

La route `src/app/[locale]/(public)/[slug]/page.tsx` rend déjà correctement
les pages publiées. Les 4 nouvelles entrées seront servies automatiquement aux
URLs :

- `/fr/about`
- `/fr/mentions-legales`
- `/fr/conditions-utilisation`
- `/fr/politique-confidentialite`

**Aucun fichier `.tsx` à créer ou modifier dans ce sprint.**

---

## 4. Appliquer localement

```bash
# Appliquer la migration sans reset (data préservée)
supabase db push --local

# Ou si tu préfères via psql directement :
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres \
  -f supabase/migrations/20260418000024_seed_cms_pages_static.sql
```

**Ne pas faire `supabase db reset`** — cela détruirait la seed existante.

---

## Contraintes

- `tsc --noEmit` doit passer (aucun fichier TS modifié — devrait être trivial)
- Ne pas modifier `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`
- Ne pas modifier `[slug]/page.tsx`
- `ON CONFLICT (slug) DO NOTHING` — idempotent, safe à re-exécuter
- Les UUIDs `000...002` à `000...005` sont réservés pour ces pages statiques,
  cohérent avec `000...001` pour homepage

---

## Livrable attendu

| Fichier | Action |
|---|---|
| `supabase/migrations/20260418000024_seed_cms_pages_static.sql` | Nouveau |
| `supabase/migrations/20260418000025_cms_pages_deleted_at.sql` | Nouveau **seulement si** la colonne est absente |

Après application : les 4 URLs répondent 200 avec le contenu TipTap rendu.
