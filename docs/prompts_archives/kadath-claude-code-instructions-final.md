# Instructions scaffold — kadath.fr
# VERSION FINALE
# À coller dans Claude Code depuis ~/claude_projects/kadath.fr

---

## CONTEXTE

Site portfolio freelance Next.js. Initialise le scaffold complet du projet selon ces specs.
Ne pas lancer pnpm install — juste créer les fichiers et la structure.
Ne pas mettre de contenu dans les pages — juste les shells.

---

## STACK

- Next.js 15+ App Router, TypeScript strict (pas de `any`)
- pnpm
- Tailwind CSS (vitrine publique)
- shadcn/ui (admin + espace client)
- Supabase SSR (`@supabase/ssr`)
- TipTap (éditeur CMS) + DOMPurify (sanitisation HTML avant stockage)
- Stripe
- Resend (emails transactionnels)
- react-pdf (génération PDF devis/factures)
- next-intl (i18n — fr + en, défaut fr)
- Cloudflare Turnstile (formulaire inscription client)
- Upstash Redis + @upstash/ratelimit (rate limiting)
- Zod (validation formulaires — Server Actions + client)
- Vitest + Testing Library (tests)
- @vercel/og (OG image dynamique)
- Biome (lint + format — remplace ESLint + Prettier)
- Husky + lint-staged (hooks pre-commit)
- Umami (analytics — instance externe Railway, script public uniquement)

---

## STRUCTURE DES DOSSIERS

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   │   ├── layout.tsx       → script Umami ici uniquement
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── (customer)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── setup-password/page.tsx
│   │   │   └── confirm-password-change/page.tsx
│   │   └── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx
│   ├── favicon.ico
│   ├── manifest.ts
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── cms/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── resend/
│   │   └── index.ts
│   ├── stripe/
│   │   └── index.ts
│   ├── ratelimit/
│   │   └── index.ts
│   └── utils/
│       ├── index.ts
│       └── schemas.ts
├── types/
│   └── supabase.ts
└── middleware.ts

messages/
├── fr.json
└── en.json

public/
└── fonts/
    └── README.md
```

---

## FICHIERS SUPABASE

### src/lib/supabase/server.ts
```ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}
```

### src/lib/supabase/client.ts
```ts
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!)
```

### src/lib/supabase/middleware.ts
```ts
import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  return supabaseResponse
}
```

---

## MIDDLEWARE.TS

```ts
// 1. next-intl middleware (locale routing /fr/, /en/)
// 2. Refresh session Supabase via lib/supabase/middleware.ts
// 3. Routing par domaine :
//    - kadath.fr/manage → vérifier rôle admin_users (admin | editor)
//      sinon redirect /[locale]/auth/login
//    - kadath.fr/[locale]/customer/* → vérifier auth client
//      sinon redirect /[locale]/auth/login
//    - kadath.fr/(public) → pas de protection
```

---

## NEXT.CONFIG.TS

```ts
// - images.remotePatterns : *.supabase.co + domaines externes
// - headers() : CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS
// - redirects() : www.kadath.fr → kadath.fr
// - CORS sur /api/* pour webhooks Stripe

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com",
      "frame-src https://js.stripe.com",
    ].join('; ')
  },
]
```

---

## FIREBASE.JSON

```json
{
  "hosting": {
    "public": ".next",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "/fonts/**",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ]
  }
}
```

---

## BIOME

### biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "error" },
      "suspicious": { "noExplicitAny": "error" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": { "quoteStyle": "single", "semicolons": "asNeeded" }
  }
}
```

### scripts package.json
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "type-check": "tsc --noEmit",
  "lint": "biome lint ./src",
  "format": "biome format --write ./src",
  "check": "biome check --apply ./src",
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

---

## HUSKY + LINT-STAGED

### .husky/pre-commit
```sh
pnpm type-check
pnpm lint-staged
```

### lint-staged dans package.json
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["biome check --apply"]
  }
}
```

---

## AUTHENTIFICATION

- Email + password, magic link, Google OAuth, GitHub OAuth
- Inscription client libre + confirmation email obligatoire + Cloudflare Turnstile
- Editors/admins : invitation uniquement via `inviteUserByEmail()`
- 2FA optionnel (TOTP)

### Règles mot de passe
- 10 min / 30 max, 1 majuscule, 1 chiffre, 1 caractère spécial

### Flux post-inscription client
1. Inscription → email confirmation (Resend)
2. Clic lien → compte activé
3. Page acceptation CGU + cookies
4. Accès `/customer/`

### Changement mot de passe
1. Demande espace client → email lien signé (Resend)
2. Clic → `/auth/confirm-password-change`
3. Modification après confirmation uniquement

---

## RÔLES

| Rôle | Accès |
|---|---|
| `admin` | Tout — kadath.fr/manage complet |
| `editor` | CMS uniquement |
| `client` | /customer/ uniquement |

---

## VALIDATION — ZOD

Schémas dans `src/lib/utils/schemas.ts` :
- `contactSchema` — email, message (min 10, max 2000)
- `passwordSchema` — min 10, max 30, majuscule, chiffre, spécial
- `clientProfileSchema` — first_name, last_name, email, phone, siret, address, activity
- `quoteSchema` / `invoiceSchema`
- `cmsPageSchema`

```ts
const result = schema.safeParse(formData)
if (!result.success) return { error: result.error.flatten() }
```

---

## SANITISATION — DOMSPURIFY

TipTap → HTML riche → sanitiser avant stockage :

```ts
import DOMPurify from 'isomorphic-dompurify'
const clean = DOMPurify.sanitize(tiptapHtml)
```

Sur : `sections`, `specifications_tiptap`, tout champ TipTap.

---

## RATE LIMITING — UPSTASH REDIS

```ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
})
```

Sur : contact, login, inscription, magic link, changement mot de passe.

---

## EMAILS — RESEND

- Invitation admin/editor
- Confirmation inscription client
- CGU post-confirmation
- Magic link
- Changement mot de passe
- Nouveau message (admin ↔ client)
- Nouveau devis / nouvelle facture
- Facture en retard
- Formulaire contact → Resend direct, pas de DB

---

## ANALYTICS — UMAMI

Dans `(public)/layout.tsx` uniquement :
```tsx
<script
  defer
  src={process.env.NEXT_PUBLIC_UMAMI_URL + '/script.js'}
  data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
/>
```

---

## SEO

- `app/sitemap.ts` — pages CMS publiées
- `app/robots.ts` — dynamique
- `app/opengraph-image.tsx` — @vercel/og
- `robots: noindex, nofollow` sur (admin) et (customer)
- `app/favicon.ico` + `app/manifest.ts`

---

## PAGES LÉGALES (RGPD — obligatoires France)

- `/mentions-legales`
- `/politique-de-confidentialite`
- `/conditions-generales-utilisation`

En pages CMS (slug fixe) ou statiques.

---

## CHARTE GRAPHIQUE

### globals.css
```css
:root {
  --color-primary:        #C5205D;
  --color-primary-hover:  #AD1A17;
  --color-accent:         #53BBAD;
  --color-surface-dark:   #425566;
  --color-surface-light:  #7A97AA;
  --color-bg-light:       #F8F8F8;
  --color-bg-dark:        #1A1F2E;
  --color-text-primary:   #1A1F2E;
  --color-text-secondary: #425566;
  --color-white:          #FFFFFF;
}
```

### Thèmes : `theme-light` (défaut) / `theme-dark` / `theme-accessible`
Cookie SSR (`theme`) + localStorage.

### @font-face
```css
@font-face { font-family: 'Ferryman'; font-weight: 100; font-display: swap; src: url('/fonts/ferryman_thn.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 200; font-display: swap; src: url('/fonts/ferryman_xtrlght.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 300; font-display: swap; src: url('/fonts/ferryman_lght.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 400; font-display: swap; src: url('/fonts/ferryman_mdm.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 600; font-display: swap; src: url('/fonts/ferryman_smbld.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 700; font-display: swap; src: url('/fonts/ferryman_bld.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 800; font-display: swap; src: url('/fonts/ferryman_xtrbld.woff2') format('woff2'); }
@font-face { font-family: 'Ferryman'; font-weight: 900; font-display: swap; src: url('/fonts/ferryman_blck.woff2') format('woff2'); }
@font-face { font-family: 'Helvetica Condensed'; font-weight: 300; font-display: swap; src: url('/fonts/helvetica_condensed_light.woff2') format('woff2'); }
@font-face { font-family: 'Helvetica Condensed'; font-weight: 400; font-display: swap; src: url('/fonts/helvetica_condensed.woff2') format('woff2'); }
@font-face { font-family: 'Helvetica Condensed'; font-weight: 900; font-display: swap; src: url('/fonts/helvetica_condensed_black.woff2') format('woff2'); }
```

### tailwind.config.ts
```ts
fontFamily: {
  ferryman:  ['Ferryman', 'serif'],
  condensed: ['Helvetica Condensed', 'Arial Narrow', 'sans-serif'],
}
```

---

## STORAGE SUPABASE

| Bucket | Accès | Signed URL |
|---|---|---|
| `media` | Public | — |
| `projects` | Privé | 1h |
| `attachments` | Privé | 1h |
| `documents` | Privé | 1h |

Nommage : `media/{slug}/hero.webp` — `projects/{id}/file` — `attachments/{msg_id}/file` — `documents/quote/{id}.pdf`

---

## PDF — REACT-PDF

Server Action → génération → stockage `documents/` → signed URL 1h à la demande.

---

## CACHE CMS

`revalidateTag` Next.js — invalider à chaque publication/modification CMS.

---

## I18N — NEXT-INTL

- `fr` (défaut), `en`
- `[locale]` segment App Router
- `messages/fr.json` + `messages/en.json`
- Clés : `common`, `nav`, `auth`, `admin`, `customer`, `cms`

---

## NUMÉROTATION

Format : `{PREFIX}-{YYYY}-{NNNN}` — géré via trigger PostgreSQL.

---

## .ENV.LOCAL

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_APP_URL=https://kadath.fr
NEXT_PUBLIC_MANAGE_URL=https://kadath.fr/manage
```

---

## .GITIGNORE

```
.env*.local
.env
/.next
/out
/node_modules
/.supabase
/supabase/.temp
firebase-debug.log
.DS_Store
*.tsbuildinfo
```

---

## TESTS — VITEST

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
})
```

---

## COMMANDES

```bash
pnpm dev                    # localhost:3000
pnpm build
pnpm type-check
pnpm check                  # Biome
pnpm test

git checkout dev
git push origin dev         # jamais main directement

supabase start              # Docker auto
supabase stop
supabase db push
supabase db diff
supabase gen types typescript --local > src/types/supabase.ts

pnpm build && firebase deploy --only hosting

npx skills add supabase/agent-skills   # une fois
```

---

## RÈGLES

✅ TOUJOURS :
- Branche `dev`
- TypeScript strict — pas de `any`
- Charte graphique
- Husky vérifie automatiquement avant commit
- Mobile-first
- Soft delete données financières
- DOMPurify sur tout HTML TipTap
- Zod sur tous les formulaires

❌ JAMAIS :
- signUp public editors/admins
- Commiter sur `main`
- Supprimer données financières
- Stocker données de paiement
- Stocker HTML TipTap non sanitisé

---

## CHECKLIST PRÉ-DÉPLOIEMENT

- [ ] Mobile : 375px, 414px, 768px
- [ ] Desktop : 1280px, 1920px
- [ ] `pnpm build` sans erreur
- [ ] `pnpm type-check` sans erreur
- [ ] `pnpm check` sans erreur
- [ ] `pnpm test` sans erreur
- [ ] Lighthouse > 90
- [ ] Variables d'env prod configurées dans Firebase

---

## APRÈS LE SCAFFOLD

```
Génère CLAUDE.md, README.md, ARCH.md et REF.md
à partir des fichiers créés et des décisions techniques du projet.
```

---

## NE PAS FAIRE

- Ne pas lancer `pnpm install`
- Shells uniquement dans les pages
- Ne pas copier les .woff2 — créer `public/fonts/README.md`
- Ne pas configurer shadcn/ui — dépendance dans package.json uniquement
