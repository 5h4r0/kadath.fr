# ARCH.md — Architecture kadath.fr
> Référence technique complète — toutes les décisions de conception et leur rationale

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Domaines & DNS](#2-domaines--dns)
3. [Stack technique](#3-stack-technique)
4. [Architecture rendering](#4-architecture-rendering)
5. [Server Components vs Client Components](#5-server-components-vs-client-components)
6. [Authentification & Sécurité](#6-authentification--sécurité)
7. [API & Server Actions](#7-api--server-actions)
8. [Base de données Supabase](#8-base-de-données-supabase)
9. [Backoffice manage.kadath.fr](#9-backoffice-managekadathfr)
10. [Paiement Stripe](#10-paiement-stripe)
11. [Logs & Monitoring](#11-logs--monitoring)
12. [Emails](#12-emails)
13. [Tests](#13-tests)
14. [Qualité code & CI/CD](#14-qualité-code--cicd)
15. [Environnements](#15-environnements)
16. [Coûts estimés](#16-coûts-estimés)
17. [Structure des dossiers](#17-structure-des-dossiers)
18. [Décisions écartées](#18-décisions-écartées)
19. [Prochaines étapes](#19-prochaines-étapes)

---

## 1. Vue d'ensemble

### Fonctionnalités

- 1 landing page (one page + formulaire contact)
- 5 pages statiques
- Backoffice admin `manage.kadath.fr` — CMS pages + CRUD utilisateurs, factures, paiements
- Espace client `kadath.fr/customer/` — RUD (soft delete)
- Lien vers démo ticketing-store (repo séparé)

### Principe de soft delete

Jamais de `DELETE` en base. `deleted_at TIMESTAMPTZ` (NULL = actif) sur toutes les tables.

### Projet lié

**ticketing-store** — repo indépendant `github.com/5h4r0/ticketing-store`.
Démo parc d'attractions fictif Z0mbie Z0ne, livrable clé en main pour clients.
Présenté sur kadath.fr via lien vers instance déployée.

---

## 2. Domaines & DNS

### Architecture domaines

```
https://kadath.fr              → site vitrine + portfolio
https://www.kadath.fr          → redirect → kadath.fr
https://manage.kadath.fr       → backoffice admin CMS (isolé)
https://kadath.fr/customer/    → espace client (intégré)
```

### Choix backoffice : sous-domaine

`manage.kadath.fr` — isolation sécurité : cookies httpOnly scopés séparément.

### Choix espace client : sous-dossier

`kadath.fr/customer/` — UX intégrée au site principal.

### SSL

Gratuit et automatique via Firebase (Let's Encrypt). Renouvellement automatique.

### Configuration DNS Ionos

```
A     @       199.36.158.100
TXT   @       firebase-site-verification=xxxxx
CNAME www     votre-app.web.app
CNAME manage  votre-app.web.app
TXT   manage  firebase-site-verification=xxxxx
```

> ⚠️ Supprimer tout SSL Ionos existant avant configuration Firebase.

### SEO espaces privés

```ts
export const metadata = { robots: "noindex, nofollow" };
// app/(admin)/layout.tsx + app/(customer)/layout.tsx
```

---

## 3. Stack technique

### Framework & Langage

| Outil | Rôle | Note |
|---|---|---|
| **Next.js 15** | Framework fullstack | App Router + Turbopack |
| **TypeScript** | Langage | Strict |
| **React** | UI | Inclus dans Next.js |

### Base de données

| Outil | Rôle |
|---|---|
| **Supabase** | BaaS — PostgreSQL hébergé |
| **supabase-js** | Client JS |

### Hébergement / Auth / Storage

| Outil | Rôle | Note |
|---|---|---|
| **Firebase App Hosting** | Hébergement Next.js SSR | Plan Blaze requis |
| **Firebase Authentication** | Auth utilisateurs | JWT + cookies httpOnly + Custom Claims |
| **Firebase Cloud Storage** | Images, documents | |

### Paiement

| Outil | Rôle |
|---|---|
| **Stripe** | Paiement en ligne |
| **stripe-js** | Client Stripe (CC) |

### UI / State Management

| Outil | Rôle | Note |
|---|---|---|
| **Zustand** | État panier client | `src/store/cart.ts` |
| **Context API** | Session utilisateur | Natif React |
| **shadcn/ui** | Composants UI backoffice + espace client | Radix + Tailwind — copiés dans `src/components/ui/` |
| **TipTap** | Éditeur de contenu riche | CMS `manage.kadath.fr` |

**UI Strategy :**
- Site vitrine → Tailwind pur (design custom)
- Backoffice + espace client → shadcn/ui (accessibilité Radix, personnalisable)

### Logs / Monitoring

| Outil | Rôle |
|---|---|
| **Pino** | Logs JSON structurés |
| **Sentry** | Erreurs runtime front + back |

### Emails

| Outil | Rôle |
|---|---|
| **Resend** | Envoi transactionnel |
| **React Email** | Templates React |

### Validation

| Outil | Rôle |
|---|---|
| **Zod** | Validation schémas |
| **next-safe-action** | Server Actions typées + validées |

### Qualité code

| Outil | Rôle |
|---|---|
| **Biome** | Lint + format (remplace ESLint + Prettier) |
| **Husky + lint-staged** | Pre-commit Biome |
| **GitHub Actions** | CI/CD |

### Tests

| Outil | Rôle |
|---|---|
| **Jest + RTL** | Tests unitaires + composants |
| **Playwright** | Tests E2E |

---

## 4. Architecture rendering

| Zone | Stratégie | Raison |
|---|---|---|
| Landing / vitrine | SC + `force-cache` | Contenu statique |
| Catalogue produits | SC + `revalidate: 60` | Change peu |
| Fiche produit | SC + `revalidate: 60` | Change peu |
| Espace client | SC + `no-store` | Données personnelles |
| Admin backoffice | SC + `no-store` | Temps réel |
| Panier / interactions | Client Component | Interactif |

---

## 5. Server Components vs Client Components

| Besoin | SC | CC |
|---|---|---|
| Fetch DB / API | ✅ | ❌ |
| Logique métier | ✅ | ❌ |
| `useState` / `useEffect` | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| Formulaires interactifs | ❌ | ✅ |

---

## 6. Authentification & Sécurité

### Flux

```
1. Client → Firebase Auth login
2. Firebase → ID Token (JWT)
3. Client → POST /api/auth/session { idToken }
4. Serveur → verifyIdToken
5. Serveur → createSessionCookie (httpOnly, 5j, sameSite=strict)
```

### Rôles

```ts
await adminAuth.setCustomUserClaims(uid, { role: "admin" });
```

### Middleware

```ts
const PROTECTED_PATHS = ["/manage", "/customer"];

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const isProtected = PROTECTED_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));
  return isProtected && !session
    ? NextResponse.redirect(new URL("/", req.url))
    : NextResponse.next();
}
```

### Headers sécurité

```ts
{ key: "X-Frame-Options", value: "DENY" }
{ key: "X-Content-Type-Options", value: "nosniff" }
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
```

---

## 7. API & Server Actions

```
src/app/api/
├── auth/session/route.ts
├── products/route.ts
├── orders/route.ts
├── admin/route.ts
└── webhooks/stripe/route.ts
```

Types inférés depuis Zod — pas de duplication manuelle.

---

## 8. Base de données Supabase

### Bonnes pratiques

```ts
// ✅ Select explicite
supabase.from("products").select("id, name, price")

// ✅ Soft delete
supabase.from("products")
  .update({ deleted_at: new Date().toISOString() })
  .eq("id", id)
```

### Modèle de données `public`

> ⚠️ À concevoir — voir section 9 pour manage.kadath.fr

Tables prévues : `users`, `pages`, `products`, `orders`, `orders_lines`, `invoices`, `payments`.

### Index à créer

`user_id`, `status`, `created_at`, `deleted_at` sur les tables principales.

---

## 9. Backoffice manage.kadath.fr

### Fonctionnalités

- CMS pages — création, édition (TipTap), archivage
- CRUD utilisateurs — coordonnées, informations
- Gestion factures — génération, suivi
- Gestion paiements — liste, reste à charge
- CRUD produits boutique

### Modèle de données

> ⚠️ À concevoir entièrement — prochaine étape prioritaire

Entités identifiées :
- `pages` — contenu CMS (titre, slug, body TipTap JSON, statut, auteur)
- `users` — profils clients (coordonnées, firebase_uid)
- `invoices` — factures (montant, statut, pdf_url)
- `payments` — paiements (montant, date, méthode, invoice_id)
- `products` — produits boutique

### UI

shadcn/ui + TipTap pour l'éditeur de contenu.

---

## 10. Paiement Stripe

```
CC → POST /api/checkout { items }
   → stripe.checkout.sessions.create()
   → redirect Stripe Checkout
   → webhook /api/webhooks/stripe (signé)
   → update order status Supabase
```

Tarif EU : 1.5% + 0.25€/transaction.

---

## 11. Logs & Monitoring

```ts
export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
```

---

## 12. Emails

Cas d'usage : confirmation commande, notifications admin, réinitialisation mot de passe.

---

## 13. Tests

```
Jest + RTL  → unitaires, composants, API routes
Playwright  → parcours client, auth, admin, checkout
```

---

## 14. Qualité code & CI/CD

### Pipeline

```
push develop   → Biome + tsc + Jest + Playwright
push main      → Biome + tsc + Jest + Playwright + deploy Firebase
PR sur main    → Biome + tsc + Jest (bloquant)
```

### Règles

- Pas de `if {}` → ternaires, `.map / .filter / .reduce`
- Pas de `any` TypeScript
- Pas de `SELECT *`
- Types inférés depuis Zod
- Branche `develop` toujours

---

## 15. Environnements

```
.env.local.example    → template versionné
.env.local            → dev (gitignored)
.env.test             → tests (gitignored)
.env.production       → prod Firebase (gitignored)
```

Deux projets Firebase : dev/test + prod.

---

## 16. Coûts estimés

| Service | Coût |
|---|---|
| Supabase Free | 0€/mois |
| Firebase Blaze dev | ~0–5€/mois |
| Firebase Blaze prod | ~5–20€/mois |
| SSL | 0€ |
| Stripe | 1.5% + 0.25€/transaction |

---

## 17. Structure des dossiers

```
kadath.fr/
├── .github/workflows/ci.yml
├── .husky/pre-commit
├── docs/
│   ├── ARCH.md
│   └── REF.md
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   ├── boutique/[slug]/
│   │   │   ├── contact/
│   │   │   └── legal/
│   │   ├── (customer)/
│   │   │   ├── layout.tsx        → noindex
│   │   │   └── customer/
│   │   │       ├── profil/
│   │   │       └── commandes/[id]/
│   │   ├── (admin)/
│   │   │   ├── layout.tsx        → noindex
│   │   │   └── manage/
│   │   │       ├── dashboard/
│   │   │       ├── pages/
│   │   │       ├── produits/
│   │   │       ├── clients/
│   │   │       ├── factures/
│   │   │       └── paiements/
│   │   └── api/
│   │       ├── auth/session/route.ts
│   │       ├── products/route.ts
│   │       ├── orders/route.ts
│   │       ├── admin/route.ts
│   │       └── webhooks/stripe/route.ts
│   ├── components/
│   │   ├── ui/                   → shadcn/ui (backoffice + customer)
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── admin/
│   │   └── customer/
│   ├── lib/
│   │   ├── firebase/client.ts
│   │   ├── firebase/admin.ts
│   │   ├── supabase/client.ts
│   │   ├── supabase/server.ts
│   │   ├── stripe/
│   │   ├── email/
│   │   ├── logger/index.ts
│   │   └── safe-action/index.ts
│   ├── store/cart.ts
│   ├── schemas/
│   ├── emails/
│   └── __tests__/
├── middleware.ts
├── next.config.ts
├── tsconfig.json
├── biome.json
└── .env.local.example
```

---

## 18. Décisions écartées

| Technologie | Raison |
|---|---|
| **Express** | Route Handlers Next.js suffisent |
| **Redux** | Zustand + Context API suffisent |
| **ISR** | Cache granulaire SC plus précis |
| **Docker** | Firebase App Hosting conteneurise automatiquement |
| **Firestore** | Supabase PostgreSQL préféré |
| **localStorage pour auth** | Vulnérable XSS — cookies httpOnly |
| **ESLint + Prettier** | Remplacés par Biome |
| **Winston** | Remplacé par Pino |
| **Lexical** | Remplacé par TipTap |
| **Tailwind pur pour backoffice** | shadcn/ui préféré (accessibilité Radix) |
| **ticketing intégré à kadath.fr** | Repo séparé — livrable indépendant pour clients |

---

## 19. Prochaines étapes

- [x] Stack décidée
- [x] UI strategy décidée (Tailwind + shadcn/ui + TipTap)
- [x] ticketing-store séparé en repo indépendant
- [ ] Concevoir modèle de données `manage.kadath.fr`
- [ ] Créer migrations Supabase schéma `public`
- [ ] Configurer RLS
- [ ] Scaffold projet Next.js
- [ ] Configurer Firebase (dev + prod)
- [ ] Configurer DNS Ionos
- [ ] CI/CD GitHub Actions
- [ ] Stripe + Resend + Sentry

---

*Dernière mise à jour : 21/03/2026*
