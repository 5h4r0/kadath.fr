# ARCH.md — Architecture kadath.fr
> Référence technique complète — décisions de conception et rationale
> Dernière mise à jour : 07/04/2026

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Domaines & DNS](#2-domaines--dns)
3. [Stack technique](#3-stack-technique)
4. [Structure des dossiers](#4-structure-des-dossiers)
5. [Architecture rendering](#5-architecture-rendering)
6. [Server vs Client Components](#6-server-vs-client-components)
7. [I18n](#7-i18n)
8. [Authentification & Sécurité](#8-authentification--sécurité)
9. [Modèle de données — 21 tables](#9-modèle-de-données--21-tables)
10. [Full-text search](#10-full-text-search)
11. [Storage Supabase](#11-storage-supabase)
12. [Backoffice manage.kadath.fr](#12-backoffice-managekadathfr)
13. [Espace client](#13-espace-client)
14. [Formulaire de contact](#14-formulaire-de-contact)
15. [Paiement Stripe](#15-paiement-stripe)
16. [PDF — react-pdf](#16-pdf--react-pdf)
17. [Emails — Resend](#17-emails--resend)
18. [Cache & Revalidation](#18-cache--revalidation)
19. [Rate Limiting](#19-rate-limiting)
20. [Logs & Monitoring](#20-logs--monitoring)
21. [Tests](#21-tests)
22. [Qualité code & CI/CD](#22-qualité-code--cicd)
23. [Environnements](#23-environnements)
24. [Coûts estimés](#24-coûts-estimés)
25. [Décisions écartées](#25-décisions-écartées)

---

## 1. Vue d'ensemble

**kadath.fr** — Portfolio développeur freelance Next.js 15 App Router.

### Fonctionnalités

- Site vitrine / portfolio (one-page + pages CMS)
- Backoffice admin `manage.kadath.fr` — CMS pages, gestion clients, devis, factures
- Espace client `kadath.fr/[locale]/customer/` — projets, devis, factures, messagerie

### Principe de soft delete

Jamais de `DELETE` sur les données financières. `deleted_at TIMESTAMPTZ` (NULL = actif).
S'applique à : `clients`, `projects`, `quotes`, `invoices`.

---

## 2. Domaines & DNS

```
https://kadath.fr              → site vitrine + espace client
https://www.kadath.fr          → redirect → kadath.fr
https://manage.kadath.fr       → backoffice admin
```

### Choix architecture domaines

- `manage.kadath.fr` — sous-domaine dédié : isolation sécurité, cookies httpOnly scopés séparément, `noindex` sur toutes les pages.
- `kadath.fr/[locale]/customer/` — sous-dossier : UX intégrée au site principal, `noindex` via metadata.

### SSL

Gratuit et automatique via Firebase App Hosting (Let's Encrypt). Renouvellement automatique.

### DNS Ionos

```
A     @       → IP Firebase App Hosting
TXT   @       → firebase-site-verification=...
CNAME www     → votre-app.web.app
CNAME manage  → votre-app.web.app
TXT   manage  → firebase-site-verification=...
```

> ⚠️ Supprimer tout SSL Ionos existant avant configuration Firebase.

---

## 3. Stack technique

### Framework & Langage

| Outil | Rôle |
|---|---|
| **Next.js 15** | Framework fullstack — App Router + Turbopack |
| **TypeScript** | Strict — pas de `any` |
| **React 19** | UI |

### Base de données & Auth

| Outil | Rôle |
|---|---|
| **Supabase** | PostgreSQL + Auth + Storage |
| **@supabase/ssr** | Client SSR avec cookies httpOnly |

### Hébergement

| Outil | Rôle |
|---|---|
| **Firebase App Hosting** | Hébergement Next.js SSR — conteneurisation automatique |

### Paiement

| Outil | Rôle |
|---|---|
| **Stripe** | Checkout + webhook signé |
| **@stripe/stripe-js** | Client CC |

### UI

| Outil | Rôle |
|---|---|
| **Tailwind CSS** | Site vitrine — design custom |
| **shadcn/ui** | Backoffice + espace client (Radix, copiés dans `src/components/ui/`) |
| **TipTap** | Éditeur contenu riche CMS |
| **isomorphic-dompurify** | Sanitisation HTML TipTap avant stockage |
| **lucide-react** | Icônes |

### Formulaires & Validation

| Outil | Rôle |
|---|---|
| **Zod** | Validation schémas — types inférés |
| **Cloudflare Turnstile** | Anti-bot inscription clients + formulaire contact |
| **@marsidev/react-turnstile** | Widget React Turnstile |

### Transactionnel

| Outil | Rôle |
|---|---|
| **Resend** | Emails transactionnels |
| **@react-email/render** | Rendu HTML emails (dépendance explicite requise pour Firebase build) |
| **@react-pdf/renderer** | Génération PDF devis/factures |

### Infrastructure

| Outil | Rôle |
|---|---|
| **@upstash/ratelimit + Redis** | Rate limiting (slidingWindow 5/10min) — DB `kadath.fr`, eu-west-1, free tier |
| **next-intl** | I18n — fr + en |
| **@vercel/og** | OG image dynamique (Edge) |
| **Umami** | Analytics (zone publique uniquement) |

### Qualité code

| Outil | Rôle |
|---|---|
| **Biome** | Lint + format (remplace ESLint + Prettier) |
| **Husky + lint-staged** | Pre-commit : type-check + Biome |
| **Vitest + Testing Library** | Tests unitaires + composants |

---

## 4. Structure des dossiers

```
kadath.fr/
├── .husky/pre-commit             → type-check + lint-staged
├── .env.local                    → variables d'env dev (gitignored)
├── docs/
│   ├── ARCH.md                   → ce fichier
│   └── REF.md                    → référence technique courte
├── messages/
│   ├── fr.json                   → traductions françaises
│   └── en.json                   → traductions anglaises
├── public/fonts/                 → Ferryman + Helvetica Condensed (.woff2)
├── scripts/
│   └── seed-auth.ts              → création comptes Supabase Auth (dev)
├── supabase/
│   ├── migrations/               → 001→015 (schéma complet)
│   └── seed.sql                  → données de test (dev uniquement)
├── src/
│   ├── app/
│   │   ├── globals.css           → variables CSS, @font-face, thèmes
│   │   ├── layout.tsx            → root layout
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        → NextIntlClientProvider
│   │   │   ├── (public)/         → vitrine — Umami ici uniquement
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── (admin)/          → noindex
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── (customer)/       → noindex
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── setup-password/
│   │   │       └── confirm-password-change/
│   │   ├── api/
│   │   │   ├── auth/session/route.ts
│   │   │   └── webhooks/stripe/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx   → @vercel/og
│   │   └── manifest.ts
│   ├── components/
│   │   ├── ui/                   → shadcn/ui (backoffice + customer)
│   │   └── cms/                  → composants TipTap
│   ├── i18n/
│   │   └── request.ts            → config next-intl
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         → browser client
│   │   │   ├── server.ts         → SSR client (cookies)
│   │   │   └── middleware.ts     → session refresh middleware
│   │   ├── resend/index.ts
│   │   ├── stripe/index.ts
│   │   ├── ratelimit/index.ts    → slidingWindow 5/10min
│   │   └── utils/
│   │       ├── index.ts          → cn() helper
│   │       └── schemas.ts        → schémas Zod
│   ├── middleware.ts             → next-intl + Supabase + routing domaine
│   └── types/
│       └── supabase.ts           → types DB générés
```

---

## 5. Architecture rendering

| Zone | Stratégie | Raison |
|---|---|---|
| Landing / vitrine | SC + `force-cache` | Contenu statique |
| Pages CMS publiées | SC + `revalidateTag` | Invalidation à la publication |
| Espace client | SC + `no-store` | Données personnelles temps réel |
| Admin backoffice | SC + `no-store` | Temps réel |
| Formulaires, panier | Client Component | Interactif |
| OG image | Edge Runtime | Génération dynamique rapide |

---

## 6. Server vs Client Components

| Besoin | SC | CC |
|---|---|---|
| Fetch Supabase / logique métier | ✅ | ❌ |
| `useState` / `useEffect` | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Formulaires interactifs (Zod) | ❌ | ✅ |
| Stripe Elements | ❌ | ✅ |

---

## 7. I18n

- Locales : `fr` (défaut), `en`
- Segment App Router : `src/app/[locale]/`
- Config : `src/i18n/request.ts`
- Messages : `messages/fr.json` + `messages/en.json`
- Clés : `common`, `nav`, `home`, `about`, `contact`, `legal`, `auth`, `admin`, `customer`, `cms`
- Middleware next-intl gère la détection et le routage des locales

---

## 8. Authentification & Sécurité

### Supabase Auth — méthodes

| Méthode | Utilisateurs |
|---|---|
| Email + password | Clients + Admin |
| Magic link | Clients |
| Google OAuth | Clients |
| GitHub OAuth | Clients |
| Invitation (`inviteUserByEmail`) | Admin, Editor uniquement |
| 2FA TOTP | Optionnel, tous |

### Flux inscription client

```
1. Formulaire → Cloudflare Turnstile → Supabase signUp()
2. Email confirmation (Resend)
3. Clic lien → compte activé
4. Page acceptation CGU + cookies → INSERT consents
5. Accès /[locale]/customer/
```

### Flux changement mot de passe

```
1. Demande espace client → email lien signé (Resend)
2. Clic → /[locale]/auth/confirm-password-change
3. Modification après confirmation uniquement
```

### Règles mot de passe

- min 10 / max 30 caractères
- 1 majuscule, 1 chiffre, 1 caractère spécial

### Session

`@supabase/ssr` — cookie httpOnly, `sameSite: strict`.
Middleware refresh session à chaque requête (`src/lib/supabase/middleware.ts`).

### Rôles

| Rôle | Table | Accès |
|---|---|---|
| `admin` | `admin_users.role` | Tout — manage.kadath.fr complet |
| `editor` | `admin_users.role` | CMS uniquement (pages, médias) |
| `client` | Supabase Auth | /[locale]/customer/ uniquement |

### Routing par domaine (middleware)

```
manage.kadath.fr      → vérifie admin_users (admin | editor)
kadath.fr/[locale]/customer/* → vérifie auth client
kadath.fr/(public)    → pas de protection
```

### Security Headers

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: (voir next.config.ts)
```

### RLS (Row Level Security)

Activé sur toutes les tables. Politiques :
- Admin : voit et modifie tout
- Editor : lecture + écriture CMS uniquement
- Client : voit uniquement ses propres données (via `auth_user_id = auth.uid()`)
- Public : lecture des pages CMS publiées, tags

---

## 9. Modèle de données — 21 tables

### Authentification / Profils

| Table | Description |
|---|---|
| `admin_users` | Backoffice users. `id` = `auth.users.id`. Rôles : `admin`, `editor` |
| `clients` | Clients freelance. `auth_user_id` nullable (compte espace client optionnel) |
| `consents` | CGU + cookies. Une ligne par version acceptée. IP + user-agent stockés |

### CMS

| Table | Description |
|---|---|
| `cms_pages` | Pages CMS. Sections TipTap JSON, galerie, SEO complet, workflow publish |
| `cms_page_revisions` | Historique versions. Max 5 par page (trigger `enforce_revision_limit`) |
| `pages_tags` | Jointure pages ↔ tags (M-N) |
| `pages_linked` | Pages liées M-N auto-référencée (menu de page) |
| `tags` | Tags CMS avec slug |

### Projets / Facturation

| Table | Description |
|---|---|
| `projects` | Missions freelance. `specifications_tiptap` pour le cahier des charges |
| `project_images` | Images projet (Storage URI ou URL externe, exclusif) |
| `quotes` | Devis. Numéro auto `DEVIS-{YYYY}-{NNNN}` |
| `quote_lines` | Lignes de devis |
| `invoices` | Factures. `quote_id` nullable (facturation directe possible) |
| `invoice_lines` | Lignes de facture |
| `payments` | Paiements (Stripe ou virement). `deposit`, `balance`, `full` |

### Messagerie

| Table | Description |
|---|---|
| `messages` | Messagerie par projet (admin ↔ client) |
| `attachments` | Pièces jointes messages (Storage URI ou URL externe) |
| `message_reads` | Statut de lecture M-N messages ↔ utilisateurs |

### Contact

| Table | Description |
|---|---|
| `contact_messages` | Messages formulaire public. `turnstile_verified`, `ip_address`, `read_at`. RLS : pas de SELECT public. Migration 20260101000019 |

### Paramètres / Numérotation

| Table | Description |
|---|---|
| `settings` | Clé/valeur : préfixes, TVA, infos légales, TJM |
| `numbering_counters` | Compteurs annuels devis/factures — reset automatique chaque année |

### Fonctions PostgreSQL

| Fonction | Rôle |
|---|---|
| `set_updated_at()` | Trigger — met à jour `updated_at` |
| `set_specifications_updated_at()` | Trigger — met à jour `specifications_updated_at` si contenu change |
| `enforce_revision_limit()` | Trigger — conserve 5 révisions max par page |
| `generate_document_number(p_doc_type)` | Génère numéro `PREFIX-YYYY-NNNN` (atomique) |
| `assign_quote_number()` | Trigger — numéro auto devis à l'INSERT |
| `assign_invoice_number()` | Trigger — numéro auto facture à l'INSERT |
| `search_cms_pages(query, lang)` | Full-text search pages publiées (fr/en) |

---

## 10. Full-text search

Index GIN sur colonnes `tsvector` GENERATED (migration 015) :

| Table | Config | Colonnes indexées |
|---|---|---|
| `cms_pages.fts_fr` | `french` | title, resume, meta_description |
| `cms_pages.fts_en` | `english` | title, resume, meta_description |
| `clients.fts` | `simple` | first_name, last_name, email, activity |
| `projects.fts` | `french` | title, description |
| `quotes.fts` | `simple` | number |
| `invoices.fts` | `simple` | number |

Usage :
```sql
-- Front public
SELECT * FROM search_cms_pages('développeur freelance', 'fr');

-- Admin
SELECT * FROM clients WHERE fts @@ plainto_tsquery('simple', 'marie dupont');
SELECT * FROM projects WHERE fts @@ plainto_tsquery('french', 'boutique');
SELECT * FROM quotes WHERE fts @@ plainto_tsquery('simple', 'DEVIS-2026');
```

---

## 11. Storage Supabase

| Bucket | Accès | Limit | Signed URL |
|---|---|---|---|
| `media` | Public | 5 MB | — |
| `projects` | Privé | 5 MB | 1h |
| `attachments` | Privé | 10 MB | 1h |
| `documents` | Privé | 10 MB | 1h |

### Conventions de nommage

```
media/{slug}/hero.webp
media/{slug}/galerie/{n}.webp
projects/{project_id}/{filename}
attachments/{message_id}/{filename}
documents/quote/{quote_id}.pdf
documents/invoice/{invoice_id}.pdf
```

### Génération Signed URL (Next.js)

```ts
const { data } = await supabase.storage
  .from('documents')
  .createSignedUrl(`invoice/${id}.pdf`, 3600)
```

---

## 12. Backoffice manage.kadath.fr

### Accès

- Admin : accès total
- Editor : CMS uniquement (pages, médias) — pas de facturation, pas de clients

### Fonctionnalités

| Section | Description |
|---|---|
| Dashboard | KPIs : CA mensuel, devis en attente, factures en retard |
| CMS / Pages | CRUD pages TipTap, workflow draft → published, révisions |
| Clients | CRUD clients, fiche détail, statut |
| Projets | CRUD projets, spécifications TipTap, images |
| Devis | Génération, envoi, suivi, PDF |
| Factures | Génération, envoi, suivi paiements, PDF |
| Paiements | Liste, reste à charge par facture |
| Messagerie | Messages par projet |
| Settings | Préfixes, TVA, TJM, infos légales |

### PDF (react-pdf)

Server Action → génération → upload `documents/` → signed URL 1h à la demande.

---

## 13. Espace client

### Accès

- Client authentifié uniquement (`auth_user_id = auth.uid()`)
- Inscription libre + confirmation email + Turnstile + CGU

### Fonctionnalités

| Section | Description |
|---|---|
| Mon profil | Lecture/écriture : first_name, last_name, phone, siret, address, activity |
| Projets | Lecture projets actifs |
| Devis | Lecture devis, téléchargement PDF (signed URL) |
| Factures | Lecture factures, téléchargement PDF, paiement Stripe |
| Messages | Messagerie par projet, pièces jointes |

---

## 14. Formulaire de contact

### Table `contact_messages`

Migration `20260101000019_contact_messages.sql` — RLS activé, pas de SELECT public.

```sql
id uuid primary key default gen_random_uuid()
name text not null
email text not null
subject text not null
message text not null
ip_address text
turnstile_verified boolean default false
sent_at timestamptz default now()
read_at timestamptz
```

### Pipeline

```
ContactForm (CC)
  → Server Action src/app/actions/contact.ts
      1. contactSchema.safeParse()        (Zod)
      2. ratelimit.limit(ip)              (Upstash Redis — 5 req/10 min)
      3. verifyTurnstile(token)           (Cloudflare Turnstile server-side)
      4. supabase.from('contact_messages').insert()  (service role)
      5. Promise.all([resend notification, resend confirmation])
  → { success: true } | { success: false; error: string }
```

### Turnstile

- Widget React : `@marsidev/react-turnstile`, `theme: 'dark'`
- Vérification serveur : `src/lib/turnstile/index.ts` — POST `challenges.cloudflare.com/turnstile/v0/siteverify`
- CSP : `challenges.cloudflare.com` dans `script-src` et `frame-src`

### Rate limiting

`Ratelimit` et `Redis` instanciés **à l'intérieur** du Server Action (pas au niveau module).
Raison : module-level init crashe le module entier si les env vars sont absentes au build time.

### Emails contact

| Template | Destinataire |
|---|---|
| `ContactNotification.tsx` | `contact@kadath.fr` — nom, email, sujet, message |
| `ContactConfirmation.tsx` | Expéditeur — accusé de réception bilingue fr/en |

Rendu : `@react-email/render` + `createElement()` (pas d'appel JSX direct en Server Action).

### shadcn/ui — exception vitrine

Les composants `button`, `input`, `textarea`, `label` de `src/components/ui/` sont utilisés dans le formulaire contact (vitrine) par exception, car la page contact est isolée et non-stylée ThinkTwice pure.
Tokens : `bg-tt-accent`, `text-[#333333]`, `bg-[#444444]`, `border-tt-accent`.

---

## 15. Paiement Stripe

```
CC → Server Action POST /api/checkout
   → stripe.checkout.sessions.create()
   → redirect Stripe Checkout
   → webhook /api/webhooks/stripe (signé STRIPE_WEBHOOK_SECRET)
   → INSERT payments + UPDATE invoices.status
```

- Tarif EU : 1.5% + 0.25€/transaction
- Jamais stocker les données de carte
- Webhook signé obligatoire

---

## 16. PDF — react-pdf

```ts
// Server Action
import { renderToBuffer } from '@react-pdf/renderer'

const buffer = await renderToBuffer(<InvoiceDocument invoice={data} />)
await supabase.storage
  .from('documents')
  .upload(`invoice/${id}.pdf`, buffer, { contentType: 'application/pdf', upsert: true })

const { data: url } = await supabase.storage
  .from('documents')
  .createSignedUrl(`invoice/${id}.pdf`, 3600)
```

---

## 17. Emails — Resend

| Email | Déclencheur |
|---|---|
| Confirmation inscription | Supabase Auth hook |
| CGU post-confirmation | Clic lien confirmation |
| Invitation admin/editor | `inviteUserByEmail()` |
| Magic link | Demande connexion |
| Changement mot de passe | Demande espace client |
| Nouveau message (admin ↔ client) | INSERT messages |
| Nouveau devis / facture | Changement statut sent |
| Facture en retard | Scheduled (cron) |
| Formulaire contact | Formulaire public → INSERT `contact_messages` → Resend notification + confirmation |

---

## 18. Cache & Revalidation

```ts
// Pages CMS — revalidation à la publication
revalidateTag('cms-pages')
revalidateTag(`cms-page-${slug}`)

// Fetch avec tag
fetch('/api/...', { next: { tags: ['cms-pages'] } })

// Stratégies par zone
'force-cache'      // vitrine statique
revalidate: 60     // catalogue (si ajouté)
'no-store'         // admin + customer (temps réel)
```

---

## 19. Rate Limiting

`src/lib/ratelimit/index.ts` — Upstash Redis, `slidingWindow(5, '10 m')`.

Appliqué sur :
- Formulaire contact
- Login
- Inscription
- Magic link
- Changement mot de passe

```ts
const { success } = await ratelimit.limit(ip)
if (!success) return { error: 'Trop de tentatives' }
```

> ⚠️ **Ne jamais instancier `Redis` ou `Ratelimit` au niveau module** — si les env vars sont absentes au build time, cela crashe le module entier avant le `try/catch`. Toujours instancier à l'intérieur du corps de la fonction.

---

## 20. Logs & Monitoring

- **Pino** — logs JSON structurés (dev : pino-pretty colorisé, prod : JSON brut)
- **Sentry** — erreurs runtime front + back (à configurer)

---

## 21. Tests

```
Vitest + Testing Library → unitaires, composants, Server Actions
```

Config : `vitest.config.ts` — jsdom + globals.

---

## 22. Qualité code & CI/CD

### Pipeline (GitHub Actions — à créer)

```
push dev    → Biome check + tsc --noEmit + Vitest
push main   → Biome + tsc + Vitest + deploy Firebase
PR → main   → Biome + tsc + Vitest (bloquant)
```

### Pre-commit (Husky)

```sh
pnpm type-check
pnpm lint-staged   # Biome sur *.ts *.tsx
```

### Règles

- Pas de `any` TypeScript
- Pas de `SELECT *`
- Types inférés depuis Zod
- DOMPurify sur tout HTML TipTap avant stockage
- Signups publics admin/editor interdits

---

## 23. Environnements

```
.env.local        → dev local (gitignored)
.env.production   → prod Firebase (gitignored)
```

Deux projets Firebase distincts : dev/test + prod.

Variables requises : voir `.env.local` (template versionné avec clés vides).

### Firebase App Hosting — secrets

Variables publiques (`NEXT_PUBLIC_*`) déclarées inline dans `apphosting.yaml`.
Secrets serveur dans Google Cloud Secret Manager, référencés par nom dans `apphosting.yaml` :

| Secret | Rôle |
|---|---|
| `RESEND_API_KEY` | Emails transactionnels |
| `TURNSTILE_SECRET_KEY` | Vérification Turnstile server-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Accès Supabase service role |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |

> ⚠️ Utiliser `printf 'valeur'` (pas `echo`) pour stocker les secrets — `echo` ajoute un `\n` qui corrompt les URLs Upstash.

---

## 24. Coûts estimés

| Service | Coût |
|---|---|
| Supabase Free | 0€/mois |
| Firebase Blaze dev | ~0–5€/mois |
| Firebase Blaze prod | ~5–20€/mois |
| Upstash Redis | 0€ (free tier) |
| SSL | 0€ (Firebase) |
| Stripe | 1.5% + 0.25€/transaction |
| Resend | 0€ (free tier : 3000 emails/mois) |

---

## 25. Décisions écartées

| Technologie | Raison |
|---|---|
| **Firebase Auth / Firestore** | Remplacés par Supabase (PostgreSQL + Auth unifiés) |
| **Express** | Route Handlers Next.js suffisent |
| **Redux** | Supabase + Context API suffisent |
| **ISR** | Cache granulaire SC + revalidateTag plus précis |
| **Docker** | Firebase App Hosting conteneurise automatiquement |
| **localStorage pour auth** | Vulnérable XSS — cookies httpOnly |
| **ESLint + Prettier** | Remplacés par Biome (plus rapide, un seul outil) |
| **Winston** | Remplacé par Pino |
| **Lexical** | Remplacé par TipTap |
| **Tailwind pur pour backoffice** | shadcn/ui préféré (accessibilité Radix) |
| **Jest** | Remplacé par Vitest |
| **next-safe-action** | Retiré — Zod + Server Actions natifs suffisent |
