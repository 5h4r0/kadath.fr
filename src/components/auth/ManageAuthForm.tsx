'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  error?: string
}

export function ManageAuthForm({ error: propError }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAutoFill = (e: React.AnimationEvent<HTMLInputElement>) => {
    if (e.animationName === 'onAutoFillStart') {
      const input = e.currentTarget
      if (input.name === 'email') setEmail(input.value)
      if (input.name === 'password') setPassword(input.value)
    }
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const emailVal = (form.elements.namedItem('email') as HTMLInputElement).value
    const passwordVal = (form.elements.namedItem('password') as HTMLInputElement).value
    if (!emailVal || !passwordVal) {
      setError('Veuillez remplir tous les champs.')
      setLoading(false)
      return
    }
    setError(null)
    setLoading(true)

    const res = await fetch('/manage/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailVal, password: passwordVal }),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg)
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
          onAnimationStart={handleAutoFill}
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
          onAnimationStart={handleAutoFill}
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
