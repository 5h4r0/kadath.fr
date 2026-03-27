# CLAUDE.md
> Contexte rapide pour Claude Code — référence de session

---

## Project Overview

**kadath.fr** est une plateforme fullstack Next.js 15 (App Router) — portfolio développeur freelance avec boutique et backoffice CMS.

### Zones

| Zone | URL | Description |
|---|---|---|
| Site vitrine | `kadath.fr` | Portfolio + boutique |
| Backoffice admin | `manage.kadath.fr` | CMS — pages, utilisateurs, factures |
| Espace client | `kadath.fr/customer/` | Compte client — RUD |

### Projet lié

**ticketing-store** — repo séparé, démo e-commerce parc fictif Z0mbie Z0ne.
Présenté sur kadath.fr via lien vers instance déployée.

### Documentation complète

| Fichier | Rôle |
|---|---|
| `docs/ARCH.md` | Architecture complète + rationale |
| `docs/REF.md` | Référence technique courte |

---

## Commands

```bash
pnpm dev              # dev server (Turbopack)
pnpm build            # production build
pnpm test             # Jest unit + component tests
pnpm test:e2e         # Playwright E2E tests
pnpm biome check src  # lint + format check (CI)
pnpm biome format src # auto-format
```

Pre-commit : Husky exécute Biome automatiquement sur les fichiers stagés.

---

## Architecture

### Route Groups (`src/app/`)

| Group | Path | Cache |
|---|---|---|
| `(site)` | `/`, `/boutique/[slug]`, `/about`, etc. | SC + `force-cache` ou `revalidate: 60` |
| `(customer)` | `/customer/profil`, `/customer/commandes/[id]` | SC + `no-store` |
| `(admin)` | `/manage/dashboard`, `/manage/produits`, etc. | SC + `no-store` |
| API routes | `/api/auth/session`, `/api/webhooks/stripe`, etc. | — |

### Server vs Client Components

- **SC** — fetch DB, logique métier, affichage. Zéro JS envoyé au client.
- **CC** — UI interactive uniquement : panier (Zustand), formulaires, Stripe Elements.
- Cache granulaire par fetch : `force-cache` / `revalidate: 60` / `no-store`. Pas d'ISR.

### Auth Flow

```
Client → Firebase Auth login
       → POST /api/auth/session { idToken }
Server → verifyIdToken (Firebase Admin SDK)
       → createSessionCookie (httpOnly, 5j, sameSite: strict)
```

Rôles via Firebase Custom Claims `{ role: "admin" }`.
`middleware.ts` protège `/manage` et `/customer`.

### Data Layer

- **Supabase (PostgreSQL)** — toutes les données. RLS activé. Jamais `SELECT *`.
- **Schéma `public`** — toutes les données kadath.fr.
- **Firebase Cloud Storage** — images, documents.
- Clients : `src/lib/supabase/client.ts` (anon key, CC) et `src/lib/supabase/server.ts` (service role, SC).

### Soft Delete

Jamais de `DELETE` en base — toujours `deleted_at TIMESTAMPTZ` (NULL = actif).

### Forms & Validation

**next-safe-action** + **Zod** — types inférés depuis les schémas. Pas de duplication manuelle.

### UI Strategy

- **Site vitrine / portfolio** → Tailwind pur — design custom
- **Backoffice + espace client** → shadcn/ui — composants Radix accessibles, personnalisés Tailwind
- shadcn/ui n'est pas une dépendance externe — composants copiés dans `src/components/ui/`

### Key Libraries

| Bibliothèque | Rôle |
|---|---|
| Zustand | État panier (`src/store/cart.ts`) |
| Pino | Logs JSON structurés |
| Resend + React Email | Emails transactionnels |
| Stripe | Checkout + webhook signé |
| Biome | Lint + format |
| Sentry | Erreurs runtime front + back |
| shadcn/ui | Composants UI backoffice + espace client |
| TipTap | Éditeur de contenu riche — CMS manage.kadath.fr |

---

## Stack Decisions (ne pas revisiter sans raison forte)

- **Biome** — pas ESLint + Prettier
- **PNPM** — pas npm/yarn
- **Supabase PostgreSQL** — pas Firestore
- **Firebase App Hosting** — conteneurisation automatique
- **Next.js Route Handlers** — pas Express
- **Zustand + Context API** — pas Redux
- **Monolithe modulaire** — pas microservices
- **Cookies httpOnly** — pas localStorage
- **Soft delete** partout — `deleted_at TIMESTAMPTZ`
- **shadcn/ui** pour backoffice + espace client — Tailwind pur pour vitrine
- **TipTap** — pas Lexical
- **ticketing-store** — repo séparé, pas intégré à kadath.fr

---

## Règles de développement

- **Pas de `if {}` dans le code** → ternaires, opérateurs logiques, `.map / .filter / .reduce`
- **Pas de `any`** en TypeScript
- **Pas de `SELECT *`** — colonnes explicites toujours
- Types inférés depuis Zod — pas de duplication manuelle
- Toujours travailler sur la branche `develop`
- Jamais commiter sur `main` directement

---

## Convention commits

| Type | Emoji | Description |
|---|---|---|
| `feat` | ✨ | Nouvelle fonctionnalité |
| `fix` | 🐛 | Correction de bug |
| `wip` | 🚧 | Work in progress |
| `docs` | 📚 | Documentation |
| `style` | 💎 | Formatage sans impact logique |
| `refactor` | 📦 | Refactoring |
| `perf` | 🚀 | Performance |
| `test` | 🚨 | Tests |
| `build` | 🛠 | Build / dépendances |
| `ci` | ⚙️ | CI/CD |
| `chore` | ♻️ | Tâches diverses |
| `revert` | 🗑 | Annulation commit |

---

## Branches Git

```
main        → production
develop     → développement (branche de travail)
feature/*   → nouvelles fonctionnalités
fix/*       → corrections de bugs
```

---

## gstack

Use `/browse` from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/review`, `/ship`, `/browse`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`

---

## Environment

```
.env.local       → dev local
.env.test        → tests
.env.production  → Firebase prod
```

Deux projets Firebase séparés : dev/test et prod.
