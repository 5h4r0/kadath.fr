# Sprint — Backoffice routing : segment `/manage`, suppression `[locale]` admin, env var

## Contexte

Projet Next.js 15 / Supabase / Firebase App Hosting. Le backoffice admin est
actuellement accessible via `manage.kadath.fr` en prod (détection par host dans
le middleware). En local, il n'existe pas de sous-domaine : tout tourne sur
`localhost:3000`. Ce sprint crée un segment de route `/manage` dédié au
backoffice, sans locale (FR uniquement), et supprime les anciennes routes admin
sous `[locale]`.

**Environnements :**
- PROD : `https://manage.kadath.fr/` → auth, `https://manage.kadath.fr/cms` → CMS
- LOCAL : `http://localhost:3000/manage` → auth, `http://localhost:3000/manage/cms` → CMS

---

## 1. Env var `NEXT_PUBLIC_MANAGE_URL`

**Fichier :** `.env.local` (à mettre à jour manuellement par le dev — CC ne
touche pas aux fichiers `.env`)

La variable `NEXT_PUBLIC_MANAGE_URL` existe déjà dans `.env.local` avec la
valeur prod. Mettre à jour pour le local.
(doublon vide) :

```dotenv
# Avant
NEXT_PUBLIC_MANAGE_URL=https://manage.kadath.fr

# Après
NEXT_PUBLIC_MANAGE_URL=http://localhost:3000/manage
# En prod Firebase Secret Manager : NEXT_PUBLIC_MANAGE_URL=https://manage.kadath.fr
```

Cette variable est utilisée pour les redirects post-logout et post-auth depuis
des contextes client (LogoutButton, etc.).

---

## 2. Créer le segment `src/app/manage/`

### 2a. Layout

**Fichier :** `src/app/manage/layout.tsx`

Layout minimal sans `[locale]`. Pas de `NextIntlClientProvider` — le backoffice
est FR uniquement. Réutiliser les fonts déjà définies dans le root layout
(`font-grotesk`, etc.) via les classes CSS existantes.

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ThinkTwice — Admin',
}

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

### 2b. Page racine — Auth / Redirect

**Fichier :** `src/app/manage/page.tsx`

Server Component. Vérifie la session :
- Si authentifié → `redirect('/manage/cms')`
- Si non authentifié → rend `<ManageAuthForm />`

```tsx
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ManageAuthForm } from '@/components/auth/ManageAuthForm'

export default async function ManagePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/manage/cms')

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <ManageAuthForm />
    </div>
  )
}
```

### 2c. Composant `ManageAuthForm`

**Fichier :** `src/components/auth/ManageAuthForm.tsx`

Client Component. Formulaire de login admin, sans locale dans les redirects.

Règles :
- Champs : email + mot de passe
- Appel : `supabase.auth.signInWithPassword({ email, password })`
- Succès → `window.location.href = '/manage/cms'` (pas `router.push` — évite
  le cache navigateur, cohérent avec `LogoutButton`)
- Erreur → message inline en rouge : `"Email ou mot de passe incorrect."`
- Si prop `error === 'link_expired'` → afficher
  `"Ce lien a expiré. Contactez votre administrateur."` en rouge sous le
  formulaire
- Style : `bg-tt-bg`, `text-white`, `w-full max-w-sm space-y-6`, composants
  shadcn/ui `Label` + `Input` + `Button` (variant default, size sm)
- Titre : `"Administration ThinkTwice"` (cohérent avec le style de `AuthForm.tsx`)
- Props : `{ error?: string }`

La page `manage/page.tsx` passe `error` depuis `searchParams` si présent :

```tsx
// manage/page.tsx — ajout searchParams
interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function ManagePage({ searchParams }: Props) {
  // ...
  const { error } = await searchParams
  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <ManageAuthForm error={error} />
    </div>
  )
}
```

---

## 3. Créer `src/app/manage/cms/`

**Fichier :** `src/app/manage/cms/page.tsx`

Stub protégé. Vérifie la session, sinon redirect `/manage`.

```tsx
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ManageCmsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/manage')

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg">
      <p className="text-white">CMS — à implémenter</p>
    </div>
  )
}
```

> Note : ce stub sera remplacé par le vrai layout CMS dans un sprint ultérieur.
> Ne pas y mettre de logique métier.

---

## 4. Mettre à jour le middleware

**Fichier :** `src/middleware.ts`

Ajouter la détection du segment `/manage` en plus de la détection par host
existante. Ne pas modifier le reste du middleware.

Remplacer la condition `isAdminDomain` existante par :

```ts
const isAdminDomain =
  host.startsWith('manage.') || pathname.startsWith('/manage')
```

Ajouter `/manage/cms` (et sous-routes) à la liste des routes protégées.
Exclure `/manage` lui-même (racine = page login, pas de protection).

Pattern de protection à ajouter/adapter :

```ts
const ADMIN_PROTECTED = /^\/manage\/(.+)/  // protège /manage/* mais pas /manage
```

Si l'utilisateur n'est pas authentifié et tente d'accéder à `/manage/*` →
redirect `/manage`.

---

## 5. Mettre à jour `LogoutButton`

**Fichier :** `src/components/auth/LogoutButton.tsx` (ou chemin existant)

Remplacer la destination hardcodée post-logout par `NEXT_PUBLIC_MANAGE_URL` :

```ts
await supabase.auth.signOut()
window.location.href = process.env.NEXT_PUBLIC_MANAGE_URL ?? '/manage'
```

---

## 6. Supprimer les anciennes routes admin

Supprimer les fichiers suivants (devenus obsolètes) :

- `src/app/[locale]/auth/admin/page.tsx`
- `src/app/[locale]/auth/admin/` (dossier entier si vide après)

Retirer du middleware toute référence à `isAdminDomain` basée sur le host seul
qui ciblait `[locale]/auth/admin` ou `[locale]/cms`. Ces routes
`[locale]/cms` n'existent pas encore — ne rien créer à leur place.

> `src/app/[locale]/auth/login/page.tsx` est conservé tel quel — c'est la
> page login des clients vitrine/customer, non concernée par ce sprint.

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/lib/supabase/server.ts`, `client.ts`
- Ne pas installer de nouvelles dépendances
- Utiliser uniquement les composants shadcn/ui déjà présents :
  `button`, `input`, `label`
- Pas de `next-intl` dans le segment `manage/` (pas de locale, pas de
  `useTranslations`, pas de `getTranslations`)
- `window.location.href` pour tous les redirects post-action côté client
  (pas `router.push`) — cohérent avec le `LogoutButton` existant
- Commits avec co-auteur :
  `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
