'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface SetupPasswordFormProps {
  locale: string
}

export function SetupPasswordForm({ locale }: SetupPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError(null)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push(`/${locale}/customer/dashboard`)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <h2 className="text-xl font-semibold text-white">Créer votre mot de passe</h2>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Mot de passe
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-white">
          Confirmer le mot de passe
        </Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <Button className="w-full" size="lg" disabled={loading} onClick={handleSubmit}>
        {loading ? 'Enregistrement…' : 'Créer le mot de passe'}
      </Button>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}
    </div>
  )
}
