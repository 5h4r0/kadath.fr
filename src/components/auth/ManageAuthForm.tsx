'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface Props {
  error?: string
}

export function ManageAuthForm({ error: propError }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    window.location.href = '/manage/cms'
  }

  return (
    <form className="w-full max-w-sm space-y-6" onSubmit={handleSignIn}>
      <h1 className="text-lg font-medium text-white">Administration ThinkTwice</h1>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
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
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <Button type="submit" className="w-full" size="sm" disabled={loading}>
        {loading ? 'Connexion…' : 'Se connecter'}
      </Button>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      {propError === 'link_expired' && (
        <p className="text-center text-sm text-red-400">
          Ce lien a expiré. Contactez votre administrateur.
        </p>
      )}
    </form>
  )
}
