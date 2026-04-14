'use client'

import { sendContactMessage } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Turnstile } from '@marsidev/react-turnstile'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface ContactFormProps {
  /** Focus automatique sur first_name à l'arrivée ou via ancre #contact. */
  autoFocus?: boolean
}

export default function ContactForm({ autoFocus }: ContactFormProps) {
  const t = useTranslations('contact.form')
  const locale = useLocale() as 'fr' | 'en'

  const [status, setStatus] = useState<Status>('idle')
  const [errorKey, setErrorKey] = useState<string>('error_generic')
  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const firstNameRef = useRef<HTMLInputElement>(null)

  // Focus first_name sur prop autoFocus (page /contact) ou ancre #contact (homepage)
  useEffect(() => {
    const doFocus = () => firstNameRef.current?.focus()

    if (autoFocus) {
      doFocus()
      return
    }

    if (typeof window !== 'undefined' && window.location.hash === '#contact') {
      doFocus()
    }

    const handleHashChange = () => {
      if (window.location.hash === '#contact') doFocus()
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [autoFocus])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return

    setStatus('loading')

    const formData = new FormData(e.currentTarget)
    const payload = {
      first_name: formData.get('first_name'),
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      turnstile_token: turnstileToken,
      locale,
    }

    const result = await sendContactMessage(payload)

    if (result.success) {
      setStatus('success')
      formRef.current?.reset()
    } else {
      setErrorKey(result.error ?? 'error_generic')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-md border border-tt-accent bg-[#3a3a3a] p-6 text-tt-accent">
        {t('success')}
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Ligne 1 : Prénom + Nom */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="first_name">{t('first_name')}</Label>
          <Input
            ref={firstNameRef}
            id="first_name"
            name="first_name"
            type="text"
            placeholder={t('placeholder_first_name')}
            required
            minLength={2}
            maxLength={100}
            disabled={status === 'loading'}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t('name')}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t('placeholder_name')}
            required
            minLength={2}
            maxLength={100}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Ligne 2 : E-mail */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('placeholder_email')}
          required
          disabled={status === 'loading'}
        />
      </div>

      {/* Ligne 3 : Sujet */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">{t('subject')}</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          placeholder={t('placeholder_subject')}
          required
          minLength={2}
          maxLength={200}
          disabled={status === 'loading'}
        />
      </div>

      {/* Ligne 4 : Message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">{t('message')}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t('placeholder_message')}
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          disabled={status === 'loading'}
        />
      </div>

      <span className="block text-right text-xs text-tt-accent">{t('required_fields')}</span>

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''}
        options={{ theme: 'dark' }}
        onSuccess={setTurnstileToken}
        onError={() => setTurnstileToken('')}
        onExpire={() => setTurnstileToken('')}
      />

      {status === 'error' && (
        <p className="text-sm text-red-400">{t(errorKey as Parameters<typeof t>[0])}</p>
      )}

      {/* Ligne 5 : Bouton + champs obligatoires */}
      <div className="flex items-center justify-between">
        <Button type="submit" disabled={status === 'loading' || !turnstileToken}>
          {status === 'loading' ? t('sending') : t('submit')}
        </Button>
      </div>
    </form>
  )
}
