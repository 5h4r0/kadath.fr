# TODOS

## ✅ DONE

### firebase.json — Supprimer le bloc `hosting` legacy
**Done:** 2026-04-07 — bloc `"hosting"` retiré, seul `"apphosting"` reste.

### favicon.ico
**Done:** 2026-04-07 — `src/app/favicon.ico` comme fichier de métadonnées Next.js App Router.

### Contact form — sprint complet
**Done:** 2026-04-07
- Migration `20260101000019_contact_messages.sql`
- `src/lib/turnstile/index.ts` — vérification Cloudflare Turnstile
- `src/app/actions/contact.ts` — Server Action (Zod → ratelimit → Turnstile → DB → Resend)
- `src/emails/ContactNotification.tsx` + `ContactConfirmation.tsx` (bilingue)
- `src/components/contact/ContactForm.tsx` — CC avec `@marsidev/react-turnstile`
- `src/app/[locale]/(public)/contact/page.tsx`
- Section `#contact` intégrée sur la homepage
- shadcn/ui components : `button`, `input`, `textarea`, `label`
- CSP mis à jour pour `challenges.cloudflare.com`

### Firebase App Hosting — secrets configurés
**Done:** 2026-04-07 — tous les secrets dans Secret Manager :
`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
`apphosting.yaml` mis à jour (vars publiques inline, secrets via référence).

---

## ⏳ PENDING

### contact@kadath.fr — mailbox / forwarding Ionos
**What:** Créer la boîte mail `contact@kadath.fr` sur Ionos, ou configurer un alias/forward vers une adresse existante.
**Why:** Les emails Resend envoyés depuis `contact@kadath.fr` bounced — mailbox inexistante.
**Depends on:** Accès panel Ionos.

### robots.ts — disallow bots agressifs et paths sensibles
**What:** ✅ Fait — AhrefsBot, SemrushBot, MJ12bot, DotBot, PetalBot disallowés. Paths `/.env`, `/.git`, `/api/` disallowés pour tous.
**Status:** Commité, push en attente.

### OG image runtime — Firebase App Hosting compatibility
**What:** Ajouter `export const runtime = 'nodejs'` dans `src/app/opengraph-image.tsx`.
**Why:** Firebase App Hosting = Cloud Run = Node.js. `opengraph-image.tsx` tourne en Edge Runtime par défaut. `@vercel/og` est compatible Node.js depuis v0.5 mais la déclaration de runtime doit être explicite.
**Pros:** OG images fonctionnelles sur Firebase App Hosting sans changer de package.
**Cons:** Aucun — changement d'une ligne.
**Context:** Identifié lors du /plan-eng-review Sprint 1. OG image déféré au Sprint 2. À faire avant d'implémenter `opengraph-image.tsx`.
**Depends on:** Sprint 2 (vitrine contenu finalisé).
