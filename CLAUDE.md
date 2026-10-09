# CLAUDE.md
> Contexte rapide pour Claude Code — référence de session

---

## thinktwice Project Overview

**kadath.fr** est une plateforme fullstack Next.js 15 (App Router) — portfolio développeur freelance avec boutique et backoffice CMS.

### Zones

| Zone             | URL                            | Description                         |
|------------------|--------------------------------|-------------------------------------|
| Site vitrine     | `kadath.fr`                    | Portfolio + boutique                |
| Backoffice admin | `kadath.fr/manage`             | CMS — pages, utilisateurs, factures |
| Espace client    | `kadath.fr/[locale]/customer/` | Compte client — RUD                 |

### Documentation complète

| Fichier        | Rôle                                                                    |
|----------------|-------------------------------------------------------------------------|
| `docs/ARCH.md` | Architecture complète + rationale                                       |
| `docs/REF.md`  | Référence technique : patterns, inventaires, secrets, historique livré  |

Les conventions communes à tous les projets Node/TypeScript (interdiction de
`any` et de `SELECT *`, Zod sur les entrants, suppression douce, convention de
commit avec emoji) sont dans le `CLAUDE.md` global, pas répétées ici.

---

## Commands

```bash
pnpm dev              # dev server (localhost:3000)
pnpm build            # production build
pnpm type-check       # TypeScript check
pnpm test             # Vitest unit + component tests
pnpm check            # Biome lint + format check (CI)
pnpm format           # Biome auto-format
```

Pre-commit : Husky exécute `pnpm type-check` + `pnpm lint-staged` (Biome) automatiquement.

---

## Architecture

### Route Groups (`src/app/[locale]/`)

| Group | Path | Cache |
|---|---|---|
| `(public)` | `/`, boutique, about, contact, legal | SC + `force-cache` ou `revalidate: 60` |
| `(customer)` | `/customer/profil`, `/customer/commandes/[id]` | SC + `no-store` |
| `(admin)` | `/manage/dashboard`, `/manage/produits`, etc. | SC + `no-store` |
| `auth/` | `/auth/login`, `/auth/setup-password`, etc. | — |
| API routes | `/api/auth/session`, `/api/webhooks/stripe`, etc. | — |

### I18n

- `fr` (défaut), `en` — segment `[locale]` App Router
- Config : `src/i18n/request.ts`
- Messages : `messages/fr.json` + `messages/en.json`
- Clés : `common`, `nav`, `auth`, `admin`, `customer`, `cms`, `home`, `about`, `contact`, `legal`

### Server vs Client Components

- **SC** — fetch DB, logique métier, affichage. Zéro JS envoyé au client.
- **CC** — UI interactive uniquement : panier (Zustand), formulaires, Stripe Elements.
- Cache granulaire par fetch : `force-cache` / `revalidate: 60` / `no-store`.

### Auth Flow (Supabase)

```
Email+password / magic link / Google OAuth / GitHub OAuth
→ Supabase Auth
→ Session cookie httpOnly (SSR via @supabase/ssr)
→ Middleware refresh session
```

- Inscription client libre + confirmation email (Resend) + Cloudflare Turnstile
- Admin/Editor : invitation uniquement via `inviteUserByEmail()`
- 2FA optionnel (TOTP)

### Data Layer

- **`src/types/supabase.ts` est la source de vérité du schéma.** Ne pas lire
  `supabase/migrations/*.sql` sauf demande explicite de changement de schéma.
- **Supabase (PostgreSQL)** — toutes les données. RLS activé.
- Schéma `public` — 20 tables. Voir `docs/ARCH.md` pour le modèle complet.
- **Supabase Storage** — 4 buckets : `media` (public), `projects`, `attachments`, `documents` (privés, signed URLs 1h).
- Clients : `src/lib/supabase/client.ts` (browser) et `src/lib/supabase/server.ts` (SSR).
- Types générés : `supabase gen types typescript --local > src/types/supabase.ts`
- Migrations : `supabase/migrations/` (001→019) — Seed : `supabase/seed.sql`
- Full-text search GIN sur `cms_pages` (fr+en), `clients`, `projects`, `quotes`, `invoices` (migration 015)

### Soft Delete

Jamais de `DELETE` en base — toujours `deleted_at TIMESTAMPTZ` (NULL = actif).
**Obligatoire sur les données financières** (devis, factures, paiements).

### Forms & Validation

**Zod** — schémas dans `src/lib/utils/schemas.ts`.
```ts
const result = schema.safeParse(formData)
if (!result.success) return { error: result.error.flatten() }
```

### Sanitisation TipTap

```ts
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(tiptapHtml)
```
Obligatoire sur tout champ HTML riche avant stockage en DB.

### UI Strategy

- **Site vitrine / portfolio** → Tailwind pur — design custom ThinkTwice (**Space Grotesk** + **Source Sans 3** via `next/font/google`). Helvetica Condensed disponible en woff2 dans `public/fonts/` pour élément ui & formulaires.
- **Backoffice + espace client** → shadcn/ui — composants Radix accessibles, personnalisés Tailwind
- shadcn/ui n'est pas une dépendance externe — composants copiés dans `src/components/ui/`
- Composants existants : `button`, `input`, `textarea`, `label` — stylés avec tokens `tt-bg` / `tt-accent`
- **Exception formulaire contact** : shadcn/ui utilisé sur la vitrine pour ce formulaire (cohérence Radix/CVA déjà en place)

### Rate Limiting

`src/lib/ratelimit/index.ts` — Upstash Redis, slidingWindow 5 req / 10 min.
Sur : contact, login, inscription, magic link, changement mot de passe.

⚠️ **Ne pas importer `ratelimit` au niveau module dans un server action** — instancier `Redis` et `Ratelimit` à l'intérieur de la fonction pour que les erreurs d'init soient catchées.

Le formulaire de contact est fonctionnel en prod ; ses fichiers et son pipeline
sont inventoriés dans `docs/REF.md`.

---

## Stack Decisions (ne pas revisiter sans raison forte)

- **Biome** — pas ESLint + Prettier
- **PNPM** — pas npm/yarn
- **Supabase** — auth + PostgreSQL + Storage (pas Firebase Auth/Firestore/Storage)
- **Firebase App Hosting** — conteneurisation automatique (Cloud Run, eu-west4)
  - Secrets dans Google Cloud Secret Manager via `firebase apphosting:secrets:set`
  - `apphosting.yaml` : vars publiques en clair, secrets via référence Secret Manager
  - ⚠️ Toujours utiliser `printf` (pas `echo`) pour créer les secrets — `echo` ajoute un `\n`
- **next-intl** — i18n App Router
- **Vitest** — pas Jest
- **Monolithe modulaire** — pas microservices
- **Cookies httpOnly** — pas localStorage
- **Soft delete** partout sur données financières
- **shadcn/ui** pour backoffice + espace client — Tailwind pur pour vitrine
- **TipTap** — pas Lexical

---

## Règles de développement (propres à ce projet)

- **Toujours travailler sur la branche `dev`** — jamais commiter sur `main` directement (`main` = production)
- DOMPurify sur tout HTML TipTap avant stockage
- Signups publics admin/editor interdits — invitation uniquement
- Types inférés depuis Zod — pas de duplication manuelle

---

## Environment

```
.env.local   → dev local (gitignored)
```

Variables requises → voir `.env.local` (template avec clés vides versionné).
Les cinq secrets Firebase App Hosting et la config Upstash sont listés dans
`docs/REF.md`.

### Pending / horizon

- **CookieYes — identifiant à confirmer à la reprise du projet.** Le code
  utilise `ef1fc7682b16315dca7139faf311fc93` (repris de l'ancien code en dur,
  désormais dans `NEXT_PUBLIC_COOKIEYES_ID`). Un autre identifiant circule :
  `ca075d3de3f57eedb013bec0e6988855`. Vérifier dans le tableau de bord
  CookieYes lequel correspond à kadath.fr avant la prochaine mise en ligne de
  la bannière — avec le mauvais, elle chargera les réglages d'un autre site.

> Dernière revue : 2026-04-21. **À réviser** : six mois d'écart avec la date du jour.

- Customer space — zéro route implémentée (prochain sprint)
- Parser Zod sur `heroSection.content` et autres sections CMS (double-cast `as unknown as` — TODO)
- 3 fonctions Supabase avec `search_path` mutable à corriger (migration 20260418000026)
- 2 migrations orphelines remote à investiguer (`20260328204743`, `20260328212411`)
- Avant `supabase db push` : activer Custom Access Token Hook dans Dashboard → Auth → Hooks
- `@dnd-kit` drag-and-drop `order_index` — différé
- TipTap editor pour `cms_pages.sections` — différé
- Login `?redirect=` param écrit mais ignoré — implémentation pending
- BUG-8 `contact@kadath.fr` bounce — mailbox non créée sur Ionos, forwarding à configurer
