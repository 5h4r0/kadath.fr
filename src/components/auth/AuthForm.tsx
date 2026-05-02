'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface AuthFormProps {
  redirectTo: string
  error?: string
}

export default function AuthForm({ redirectTo, error: propError }: AuthFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const emailVal = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    const passwordVal = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailVal,
      password: passwordVal,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <form className="w-full max-w-sm space-y-6" onSubmit={handleSignIn}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="vous@example.com"
            defaultValue=""
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            defaultValue=""
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        {propError === 'link_expired' && (
          <p className="text-center text-sm text-red-400">
            Ce lien a expiré. Contactez votre administrateur.
          </p>
        )}
      </form>
    </div>
  )
}
