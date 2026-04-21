'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthFormProps {
  redirectTo: string
  error?: string
}

export default function AuthForm({ redirectTo, error: propError }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setError(null)
    setLoading(true)
    console.log('handleSignIn called', { email, password: password.length })

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button className="w-full" size="lg" disabled={loading} onClick={handleSignIn}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>

        {error && <p className="text-center text-sm text-red-400">{error}</p>}
        {propError === 'link_expired' && (
          <p className="text-center text-sm text-red-400">
            Ce lien a expiré. Contactez votre administrateur.
          </p>
        )}
      </div>
    </div>
  )
}
