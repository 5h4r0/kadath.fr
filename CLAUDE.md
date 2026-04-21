# CLAUDE.md
> Contexte rapide pour Claude Code — référence de session

---

## thinktwice Project Overview

**kadath.fr** est une plateforme fullstack Next.js 15 (App Router) — portfolio développeur freelance avec boutique et backoffice CMS.

### Zones

| Zone | URL | Description |
|---|---|---|
| Site vitrine | `kadath.fr` | Portfolio + boutique |
| Backoffice admin | `manage.kadath.fr` | CMS — pages, utilisateurs, factures |
| Espace client | `kadath.fr/[locale]/customer/` | Compte client — RUD |

### Documentation complète

| Fichier | Rôle |
|---|---|
| `docs/ARCH.md` | Architecture complète + rationale |
| `docs/REF.md` | Référence technique courte |

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
- "Use `src/types/supabase.ts` as the source of truth for schema context. Do not read `supabase/migrations/*.sql` unless explicitly asked for a schema change."
- **Supabase (PostgreSQL)** — toutes les données. RLS activé. Jamais `SELECT *`.
- Schéma `public` — 20 tables. Voir `docs/ARCH.md` pour le modèle complet.
- **Supabase Storage** — 4 buckets : `media` (public), `projects`, `attachments`, `documents` (privés, signed URLs 1h).
- Clients : `src/lib/supabase/client.ts` (browser) et `src/lib/supabase/server.ts` (SSR).
- Types générés : `src/types/supabase.ts` → `supabase gen types typescript --local > src/types/supabase.ts`
- Migrations : `supabase/migrations/` (001→019) — Seed : `supabase/seed.sql`
- Migration 019 : `contact_messages` (RLS activé, accès service role uniquement)
- Full-text search GIN sur `cms_pages` (fr+en), `clients`, `projects`, `quotes`, `invoices` (migration 015)

### Soft Delete

Jamais de `DELETE` en base — toujours `deleted_at TIMESTAMPTZ` (NULL = actif).
S'applique obligatoirement aux données financières (devis, factures, paiements).

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

### Formulaire de contact (fonctionnel en prod)

- Migration : `supabase/migrations/20260101000019_contact_messages.sql`
- Lib Turnstile : `src/lib/turnstile/index.ts`
- Server Action : `src/app/actions/contact.ts` (Zod → rate-limit → Turnstile → insert DB → emails)
- Composant : `src/components/contact/ContactForm.tsx` (CC, `@marsidev/react-turnstile`)
- Page : `src/app/[locale]/(public)/contact/page.tsx`
- Section `#contact` intégrée en bas de la homepage
- Emails : `src/emails/ContactNotification.tsx` + `ContactConfirmation.tsx` (bilingue fr/en)
- CSP : `challenges.cloudflare.com` ajouté dans `script-src` et `frame-src` (`next.config.ts`)

### Key Libraries

| Bibliothèque | Rôle |
|---|---|
| next-intl | i18n — fr + en |
| Zod | Validation schémas |
| Supabase (`@supabase/ssr`) | Auth + DB + Storage |
| Resend + React Email | Emails transactionnels |
| Stripe | Checkout + webhook signé |
| TipTap | Éditeur de contenu riche CMS |
| isomorphic-dompurify | Sanitisation HTML TipTap |
| react-pdf | Génération PDF devis/factures |
| @upstash/ratelimit | Rate limiting Redis |
| @marsidev/react-turnstile | Widget Cloudflare Turnstile (contact + inscription) |
| @react-email/render | Rendu HTML emails (requis explicitement pour Firebase build) |
| Cloudflare Turnstile | Anti-bot inscription + contact |
| Biome | Lint + format |
| Vitest + Testing Library | Tests |
| @vercel/og | OG image dynamique |
| Umami | Analytics (zone publique uniquement) |

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

## Règles de développement

- **Pas de `any`** en TypeScript
- **Pas de `SELECT *`** — colonnes explicites toujours
- Types inférés depuis Zod — pas de duplication manuelle
- Toujours travailler sur la branche `dev`
- Jamais commiter sur `main` directement
- DOMPurify sur tout HTML TipTap avant stockage
- Signups publics admin/editor interdits — invitation uniquement

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
main   → production
dev    → développement (branche de travail)
```

---

## Environment

```
.env.local   → dev local (gitignored)
```

Variables requises → voir `.env.local` (template avec clés vides versionné).

### Secrets Firebase App Hosting (Secret Manager)

| Secret | Usage |
|---|---|
| `RESEND_API_KEY` | Envoi emails transactionnels |
| `TURNSTILE_SECRET_KEY` | Vérification Cloudflare Turnstile côté serveur |
| `SUPABASE_SERVICE_ROLE_KEY` | Insert `contact_messages` (bypass RLS) |
| `UPSTASH_REDIS_REST_URL` | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting |

Upstash Redis : DB `kadath.fr` — région `eu-west-1`, free tier — rate limiting uniquement.

### État du projet (2026-04-21)

**Sprints livrés :**
- Contact form (2026-04-07) ✅
- Sprint 2 — Auth guard middleware + CMS homepage pipeline (2026-04-09) ✅
- Sprint auth flows — setup-password, confirm-password-change, route callback verifyOtp (2026-04-17) ✅
- Sprint B — i18n → CMS, 19 fichiers, 6 interfaces, 6 schémas Zod, page.tsx câblé (2026-04-18) ✅

**Bugs corrigés :**
- BUG-1 à BUG-7 ✅ (isomorphic-dompurify, useState, AdminLayout, manifest tokens, sokol redirect, sitemap, opengraph)
- BUG-8 `contact@kadath.fr` DNS Ionos ⏳ pending

**Pending / horizon :**
- Customer space — zéro route implémentée (prochain sprint)
- Parser Zod sur `heroSection.content` et autres sections CMS (double-cast `as unknown as` — TODO)
- 3 fonctions Supabase avec `search_path` mutable à corriger (migration 20260418000026)
- 2 migrations orphelines remote à investiguer (`20260328204743`, `20260328212411`)
- Avant `supabase db push` : activer Custom Access Token Hook dans Dashboard → Auth → Hooks
- `@dnd-kit` drag-and-drop `order_index` — différé
- TipTap editor pour `cms_pages.sections` — différé
- Login `?redirect=` param écrit mais ignoré — implémentation pending

- `robots.ts` : disallow bots agressifs ✅ fait — disallow attack paths (`/.env`, `/.git`, `/api/`) ✅ fait

---

## gstack

Use `/browse` from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Available skills: `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/review`, `/ship`, `/browse`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->