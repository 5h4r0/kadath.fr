# Sprint — Auth flows : setup-password, confirm-password-change, login redirect

> Mis à jour : 2026-05-04

## Contexte

Projet Next.js 15 / Supabase / `@supabase/ssr`. Les pages `setup-password` et
`confirm-password-change` sont des stubs vides. La route callback Supabase
n'existe pas. Le `defaultRedirect` dans les pages login est hardcodé `/fr/`.

---

## 1. Créer la route callback Supabase

**Fichier :** `src/app/[locale]/auth/confirm/route.ts`

> ⚠️ Ce dossier contient déjà `src/app/[locale]/auth/confirm/page.tsx` (Client
> Component gérant le flux `inviteUserByEmail` via hash fragment). Les deux
> fichiers coexistent sans conflit — Next.js autorise `route.ts` + `page.tsx`
> dans le même segment. Ne pas supprimer `page.tsx`.

Route GET qui échange le `token_hash` Supabase, puis redirige selon le `type` :

```ts
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  const { searchParams } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') // 'invite' | 'recovery' | 'email'

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })

  if (error) {
    const url = new URL(`/${locale}/auth/login`, request.url)
    url.searchParams.set('error', 'link_expired')
    return NextResponse.redirect(url)
  }

  if (type === 'invite') {
    return NextResponse.redirect(new URL(`/${locale}/auth/setup-password`, request.url))
  }
  if (type === 'recovery') {
    return NextResponse.redirect(new URL(`/${locale}/auth/confirm-password-change`, request.url))
  }

  // Fallback
  return NextResponse.redirect(new URL(`/${locale}/customer/dashboard`, request.url))
}
```

---

## 2. Implémenter `setup-password`

**Fichier :** `src/app/[locale]/auth/setup-password/page.tsx`

Page Server Component qui vérifie qu'une session active existe (sinon redirect
login), puis rend un Client Component `SetupPasswordForm`.

```ts
import { SetupPasswordForm } from '@/components/auth/SetupPasswordForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SetupPasswordPage({ params }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <SetupPasswordForm locale={locale} />
    </div>
  )
}
```

**Fichier :** `src/components/auth/SetupPasswordForm.tsx`

Client Component. Règles :
- Deux champs : "Mot de passe" + "Confirmer le mot de passe"
- Validation côté client : min 8 caractères, les deux champs identiques
- Appel : `supabase.auth.updateUser({ password })`
- Succès → `router.push(`/${locale}/customer/dashboard`)`
- Erreur → message inline en rouge
- Style cohérent avec `AuthForm.tsx` : `bg-tt-bg`, `text-white`, `Label` +
  `Input` + `Button` de shadcn/ui, `w-full max-w-sm space-y-6`
- Titre : `"Créer votre mot de passe"` (h1 ou p selon ce qui est cohérent avec l'existant)

---

## 3. Implémenter `confirm-password-change`

**Fichier :** `src/app/[locale]/auth/confirm-password-change/page.tsx`

Même pattern que `setup-password` — vérifier session, sinon redirect login.

```ts
import { ConfirmPasswordChangeForm } from '@/components/auth/ConfirmPasswordChangeForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ConfirmPasswordChangePage({ params }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  // Destination post-changement selon le rôle
  const role = user.app_metadata?.role as string | undefined
  const isAdmin = role === 'admin' || role === 'editor'
  const successRedirect = isAdmin ? '/manage' : `/${locale}/customer/dashboard`

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <ConfirmPasswordChangeForm locale={locale} successRedirect={successRedirect} />
    </div>
  )
}
```

**Fichier :** `src/components/auth/ConfirmPasswordChangeForm.tsx`

Identique à `SetupPasswordForm` avec :
- Props : `{ locale: string; successRedirect: string }`
- Titre : `"Nouveau mot de passe"`
- `router.push(successRedirect)` au lieu de destination hardcodée

---

## 4. Fix `defaultRedirect` hardcodé

**Fichiers :** `src/app/[locale]/auth/login/page.tsx` et
`src/app/[locale]/auth/admin/page.tsx`

Les deux pages ont `defaultRedirect` hardcodé sur `/fr/`. Corriger pour lire
le `locale` depuis `params` :

```ts
// login/page.tsx
interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; error?: string }>
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  // ...
  const isAdminDomain = host.startsWith('manage.')
  const defaultRedirect = isAdminDomain ? '/manage' : `/${locale}/customer/dashboard`
  // ...
  const { redirect: redirectTo, error } = await searchParams
  return <AuthForm redirectTo={redirectTo ?? defaultRedirect} error={error} />
}
```

Même correction dans `admin/page.tsx` : `redirect('/manage')` et
`redirectTo ?? '/manage'`.

Également : passer `error?: string` à `AuthForm` pour afficher un message
si `?error=link_expired` est présent dans l'URL. Dans `AuthForm`, si
`error === 'link_expired'`, afficher :
`"Ce lien a expiré. Contactez votre administrateur."` en rouge sous le
formulaire, sans interaction requise.

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/proxy.ts`, `src/lib/supabase/client.ts`, ni `src/middleware.ts`
- Ne pas installer de nouvelles dépendances
- Utiliser uniquement les composants shadcn/ui déjà présents :
  `button`, `input`, `label`
- `supabase.auth.updateUser` est disponible côté client (session active après
  `verifyOtp` dans la route callback)
