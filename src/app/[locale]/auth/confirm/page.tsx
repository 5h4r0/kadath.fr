'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthConfirmPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params.locale as string) ?? 'fr'

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const urlParams = new URLSearchParams(hash)

    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')
    const type = urlParams.get('type')

    if (!accessToken || !refreshToken) {
      router.replace(`/${locale}/auth/login`)
      return
    }

    const supabase = createClient()

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .then(({ error }) => {
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
