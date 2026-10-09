# Audit kadath.fr — snapshot 2026-04-15 04h28

> Généré par claude.ai · Base : `kadath_fr_20260415_04_28.zip`

---

## 1. État général

Le projet est propre, bien structuré, cohérent avec l'architecture documentée. Stack Next.js 15 / Supabase / Firebase App Hosting / TypeScript opérationnelle. 21 migrations locales, formulaire contact en prod, CMS backoffice partiel livré.

**Résumé par zone :**

| Zone | État | Notes |
|------|------|-------|
| Vitrine `(public)` | ✅ Fonctionnel | Homepage câblée CMS, contact fonctionnel |
| Auth | ⚠️ Partiel | Login OK, setup-password et confirm-password-change sont des stubs vides |
| Backoffice `(admin)` | ⚠️ Partiel | CMS CRUD OK, clients/projets/factures en lecture seule, pas de CRUD |
| Espace client `(customer)` | ❌ Vide | Layout stub, zéro route implémentée |
| Middleware | ✅ Solide | Auth guard, domain routing, cookie merge OK |

---

## 2. Bugs / régressions identifiés

### 🔴 Critique

**[BUG-1] `tiptapToHtml` — absence de sanitisation DOMPurify côté lecture**
- Fichier : `src/app/[locale]/(public)/[slug]/page.tsx`
- Le commentaire Biome-ignore dit _"contenu sanitisé à l'insertion"_ mais `TipTapEditor` (`onBlur`) appelle `updatePage(pageId, { sections: e.getJSON() })` **sans DOMPurify** avant stockage. La sanitisation n'est donc pas appliquée à l'insertion — `dangerouslySetInnerHTML` expose un XSS potentiel si un admin malveillant ou une erreur insère du HTML brut.
- **Fix :** Appliquer `DOMPurify.sanitize` dans `updatePage` (action cms.ts) sur le champ `sections` avant le `.update()`.

**[BUG-2] `SectionEditor` — toggle visibility ne recharge pas l'état local**
- Fichier : `src/app/[locale]/(admin)/cms/[pageId]/sections/SectionEditor.tsx`
- `handleToggle` appelle `toggleSectionVisibility` mais le composant garde `section.is_visible` passé en prop comme état initial. Après toggle, le badge "visible/masqué" ne se met **pas** à jour sans `router.refresh()`.
- **Fix :** Ajouter `useRouter()` + `router.refresh()` après le toggle, ou gérer `is_visible` en state local.

**[BUG-3] `AdminLayout` — liens de navigation hardcodés `/fr/`**
- Fichier : `src/app/[locale]/(admin)/layout.tsx`
- `NAV` utilise `href: '/fr/cms'` etc. hardcodés. Si l'utilisateur est en `/en/`, les liens redirigent vers `/fr/`.
- **Fix :** Le layout reçoit déjà `children` mais pas `params`. Récupérer `locale` via `usePathname()` ou passer le locale dynamiquement.

### 🟡 Mineur

**[BUG-4] `manifest.ts` — tokens incohérents avec le design system**
- `background_color: '#1A1F2E'` et `theme_color: '#C5205D'` ne correspondent pas aux tokens `#333333` / `#26e1b0`. Vestige d'un design précédent.

**[BUG-5] `next.config.ts` — redirect cassée**
- La règle `redirects()` redirige `thinktwice.sokol.fr/:path*` vers `https://thinktwice.sokol.fr/:path*` — c'est une boucle infinie (même domaine). Probablement une copie accidentelle. À supprimer ou corriger vers `kadath.fr`.

**[BUG-6] `sitemap.ts` — TODO non implémenté**
- Les pages CMS publiées ne sont pas incluses dans le sitemap. Bloquant pour le SEO des pages CMS.

**[BUG-7] `opengraph-image.tsx` — runtime Edge non corrigé**
- Identifié dans TODOS.md, toujours en attente. `export const runtime = 'nodejs'` manquant → OG image ne fonctionne pas sur Firebase App Hosting.

**[BUG-8] `contact@kadath.fr` — mailbox manquante**
- Identifié dans TODOS.md. Emails Resend envoyés depuis `contact@kadath.fr` bounced.

---

## 3. Sécurité

### ✅ OK
- CSP complète (script-src, frame-src, connect-src, img-src)
- HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Cookies httpOnly via `@supabase/ssr`
- Service Role Key utilisée uniquement pour `contact_messages` (bypass RLS justifié)
- Ratelimit instancié dans le corps de la fonction (pas au niveau module) ✓
- RLS activé sur toutes les tables
- Signups admin/editor interdits publiquement

### ⚠️ Points d'attention

**[SEC-1] `AuthForm` — pas de rate limiting côté client**
- Le composant `AuthForm.tsx` appelle `supabase.auth.signInWithPassword` directement depuis le browser. Il n'y a pas de Server Action intermédiaire avec rate limiting. Supabase Auth a son propre rate limiting mais il est plus permissif (5 tentatives / 1h par défaut). À surveiller si les logs montrent du brute force.

**[SEC-2] `updatePage` action CMS — pas de vérification de rôle**
- `src/app/actions/cms.ts` : `createPage`, `updatePage`, `deletePage` créent un client Supabase avec les cookies utilisateur mais ne vérifient pas explicitement que l'utilisateur est `admin` ou `editor` avant d'opérer. La protection repose sur RLS + le middleware. C'est acceptable mais une vérification explicite en début d'action serait défensive.

**[SEC-3] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` visible dans `apphosting.yaml`**
- C'est une clé publishable (anon key) — normal qu'elle soit publique. Mais le nom `PUBLISHABLE_DEFAULT_KEY` est inhabituel vs le nom canonique Supabase `ANON_KEY`. S'assurer que ce n'est pas une service role key exposée par erreur (à vérifier dans le dashboard Supabase).

---

## 4. Architecture & code quality

### ✅ Bonnes pratiques respectées
- `revalidate = 60` sur la homepage et les pages CMS publiques (pas `force-cache` pur)
- `force-dynamic` sur toutes les pages admin
- `SELECT *` absent partout — colonnes explicites systématiques
- Soft delete via `deleted_at` respecté
- Zod utilisé pour toute validation entrante
- Types inférés depuis Zod, pas de duplication
- `cookies()` await correct partout (Next.js 15 async cookies)
- `params` await correct (Next.js 15 async params)

### ⚠️ Points à améliorer

**[ARCH-1] `as unknown as HeroContent` — double cast non validé**
- `src/app/[locale]/(public)/page.tsx` : les casts `heroSection.content as unknown as HeroContent` ne valident pas le shape JSONB. Documenté en TODO (parser Zod), confirme le besoin.

**[ARCH-2] `fetchHomepageSections` — client Supabase avec cookies sur une page publique**
- La homepage utilise `createClient(cookieStore)` (client SSR avec session) pour fetch des données publiques. Pour du contenu public, un client avec la `anon key` sans cookies serait plus léger et éviterait de lire les cookies inutilement. Mineur mais à noter.

**[ARCH-3] `cmsPageSchema` dans `schemas.ts` — désynchronisé de l'usage réel**
- Le schema Zod `cmsPageSchema` a un champ `status: z.enum(['draft', 'published', 'archived'])` alors que `cms_pages` utilise `published: boolean`. Le schéma n'est pas utilisé dans les actions CMS actuelles — dead code pour l'instant.

**[ARCH-4] `SectionEditor` — JSON brut comme interface d'édition**
- Éditer le JSONB d'une section comme textarea JSON est fonctionnel mais risqué. Une validation Zod du content par type de section manque côté serveur. `updateSection` accepte `Record<string, unknown>` sans validation du shape.

**[ARCH-5] Pages admin clients/projets/factures — read-only, pas d'actions**
- Les 3 pages existent avec `SELECT` Supabase mais sans aucune action CRUD. État cohérent avec le backlog mais à ne pas oublier.

---

## 5. Migrations

23 fichiers de migration. Ordre cohérent 001→021 + 2 migrations de correction datées avril 2026.

**Point d'attention :** `20260412000020` et `20260412152739` sont numérotées hors séquence (`000020` déjà occupé par `20260101000020`). Si `supabase db push` est utilisé sur le remote, vérifier que l'ordre d'application est correct. Préférer des timestamps ISO séquentiels.

---

## 6. I18n

Messages `fr.json` et `en.json` présents. La clé `home` est utilisée mais non vérifiée ici — aucun bug i18n identifié dans le code source.

---

## 7. Dépendances

Pas de dépendances obsolètes ou conflictuelles identifiées. `next@^15.5.15` est récent. `@tiptap/react@^2.11.5` est stable.

`vitest` présent en devDep mais zéro fichier de test présent dans le snapshot (hors config). À surveiller.

---

## 8. Checklist sprint suivant (priorités)

### Bloquants prod
- [ ] **[BUG-7]** Ajouter `export const runtime = 'nodejs'` dans `opengraph-image.tsx`
- [ ] **[BUG-8]** Créer la mailbox `contact@kadath.fr` sur Ionos
- [ ] **[BUG-5]** Corriger ou supprimer la règle `redirects()` dans `next.config.ts`

### Sécurité
- [ ] **[BUG-1]** DOMPurify dans `updatePage` action avant stockage TipTap
- [ ] **[SEC-3]** Vérifier nature de `PUBLISHABLE_DEFAULT_KEY` dans le dashboard Supabase

### UX / fonctionnel
- [ ] **[BUG-2]** Fix toggle visibility dans `SectionEditor` (router.refresh)
- [ ] **[BUG-3]** Fix liens nav admin hardcodés `/fr/`
- [ ] **[BUG-4]** Corriger `manifest.ts` avec les vrais tokens
- [ ] **[BUG-6]** Implémenter les pages CMS dans `sitemap.ts`
- [ ] **[ARCH-1]** Parser Zod sur `content` des sections (déjà en TODO)
- [ ] Auth : implémenter `setup-password` et `confirm-password-change` (stubs vides)
- [ ] Espace client `(customer)` : zéro route — à planifier

---

*Audit réalisé sur 212 fichiers — snapshot complet du repo dev branch.*
