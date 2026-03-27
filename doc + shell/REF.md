# REF.md — Référence technique kadath.fr
> Condensé technique — consultation rapide en développement

---

## Domaines

```
https://kadath.fr              → site vitrine + portfolio
https://www.kadath.fr          → redirect → kadath.fr
https://manage.kadath.fr       → backoffice admin CMS
https://kadath.fr/customer/    → espace client
```

SSL : gratuit + automatique via Firebase (Let's Encrypt).

---

## Stack

| Outil | Rôle |
|---|---|
| Next.js 15 | Framework fullstack — App Router + Turbopack |
| TypeScript | Strict par défaut |
| Supabase | PostgreSQL BaaS — schéma `public` |
| Firebase App Hosting | Hébergement SSR — plan Blaze |
| Firebase Auth | JWT + cookies httpOnly + Custom Claims |
| Firebase Cloud Storage | Images, documents |
| Stripe | Paiement — Route Handlers + webhook signé |
| Zustand | État panier client |
| shadcn/ui | Composants UI backoffice + espace client |
| TipTap | Éditeur riche CMS |
| Pino | Logs JSON structurés |
| Sentry | Erreurs runtime |
| Resend + React Email | Emails transactionnels |
| Zod + next-safe-action | Validation + Server Actions typées |
| Biome | Lint + format |
| Husky + lint-staged | Pre-commit Biome |
| Jest + RTL | Tests unitaires + composants |
| Playwright | Tests E2E |
| PNPM | Package manager |

---

## Commandes

```bash
pnpm dev              # dev (Turbopack)
pnpm build            # production
pnpm test             # Jest
pnpm test:e2e         # Playwright
pnpm biome check src  # lint (CI)
pnpm biome format src # format

# Supabase local
supabase start        # émule Auth + DB + Storage
supabase stop
supabase db diff
supabase db push
```

---

## Stratégie de cache par zone

| Zone | Stratégie |
|---|---|
| Landing / vitrine | SC + `force-cache` |
| Catalogue / fiche produit | SC + `revalidate: 60` |
| Espace client | SC + `no-store` |
| Admin backoffice | SC + `no-store` |
| Panier / interactions | Client Component |

---

## Auth — Flux

```
Client → Firebase Auth login
       → POST /api/auth/session { idToken }
Server → verifyIdToken (Admin SDK)
       → createSessionCookie (httpOnly, 5j, sameSite: strict)
```

Rôles : Firebase Custom Claims `{ role: "admin" }`.

---

## Supabase — Règles

```ts
// ✅ Toujours explicite
supabase.from("products").select("id, name, price")

// ✅ Soft delete
supabase.from("products")
  .update({ deleted_at: new Date().toISOString() })
  .eq("id", id)
```

Clients :
- `src/lib/supabase/client.ts` → anon key (CC)
- `src/lib/supabase/server.ts` → service role (SC, API)

---

## Variables d'environnement

```bash
NEXT_PUBLIC_APP_URL=

# Firebase client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
```

---

## DNS Ionos

```
A     @       199.36.158.100
TXT   @       firebase-site-verification=xxxxx
CNAME www     votre-app.web.app
CNAME manage  votre-app.web.app
TXT   manage  firebase-site-verification=xxxxx
```

---

## Coûts estimés

| Service | Coût |
|---|---|
| Supabase Free | 0€/mois |
| Firebase Blaze dev | ~0–5€/mois |
| Firebase Blaze prod | ~5–20€/mois |
| SSL | 0€ (auto) |
| Stripe | 1.5% + 0.25€/transaction |
