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
  const [email, setEmail] = useState('')
  const [passwordVal, setPasswordVal] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAutoFill = (e: React.AnimationEvent<HTMLInputElement>) => {
    if (e.animationName === 'onAutoFillStart') {
      const input = e.currentTarget
      if (input.name === 'email') setEmail(input.value)
      if (input.name === 'password') setPasswordVal(input.value)
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
    console.log('[AuthForm] submit — email:', emailVal, 'password length:', passwordVal.length)
    setError(null)
    setLoading(true)
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onAnimationStart={handleAutoFill}
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
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            onAnimationStart={handleAutoFill}
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
