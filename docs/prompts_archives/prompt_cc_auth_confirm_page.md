# Fix — Auth confirm : gérer le hash fragment des invites Supabase

## Contexte

La route `src/app/[locale]/auth/confirm/route.ts` (déjà créée) gère le flow
PKCE via `token_hash` en query param. Elle fonctionne pour les flows `recovery`.

Mais `inviteUserByEmail` de Supabase utilise le flow implicite : le token arrive
dans le **hash fragment** de l'URL (`#access_token=...&type=invite`), jamais
envoyé au serveur. La route GET ne le voit donc jamais.

Il faut une **page client** à la même route qui intercepte ce cas.

---

## Ce qu'il faut créer

**Fichier :** `src/app/[locale]/auth/confirm/page.tsx`

Client Component qui :

1. Lit `window.location.hash` au mount
2. Parse les paramètres du hash (`access_token`, `refresh_token`, `type`)
3. Si `type === 'invite'` et tokens présents :
   - Appelle `supabase.auth.setSession({ access_token, refresh_token })`
   - Redirige vers `/${locale}/auth/setup-password`
4. Si `type === 'recovery'` et tokens présents :
   - Appelle `supabase.auth.setSession({ access_token, refresh_token })`
   - Redirige vers `/${locale}/auth/confirm-password-change`
5. Si hash vide ou `type` absent → redirige vers `/${locale}/auth/login`
6. Pendant le traitement → afficher un état de chargement neutre

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthConfirmPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? 'fr'

  useEffect(() => {
    const hash = window.location.hash.slice(1) // retirer le #
    const urlParams = new URLSearchParams(hash)

    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    const type = urlParams.get('type')

    if (!accessToken || !refreshToken) {
      router.replace(`/${locale}/auth/login`)
      return
    }

    const supabase = createClient()

    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then(({ error }) => {
      if (error) {
        router.replace(`/${locale}/auth/login?error=link_expired`)
        return
      }

      if (type === 'invite') {
        router.replace(`/${locale}/auth/setup-password`)
      } else if (type === 'recovery') {
        router.replace(`/${locale}/auth/confirm-password-change`)
      } else {
        router.replace(`/${locale}/customer/dashboard`)
      }
    })
  }, [locale, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg">
      <p className="text-sm text-white/50">Vérification en cours…</p>
    </div>
  )
}
```

---

## Contraintes

- Ne pas modifier `confirm/route.ts` — elle reste active pour les flows PKCE
  (les deux fichiers coexistent : `route.ts` pour GET serveur, `page.tsx` pour
  le rendu client)
- Ne pas modifier `src/lib/supabase/client.ts` ni `server.ts`
- Ne pas installer de nouvelles dépendances
- `tsc --noEmit` doit passer sans erreur
