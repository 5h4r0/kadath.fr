'use server'

import ContactConfirmation from '@/emails/ContactConfirmation'
import ContactNotification from '@/emails/ContactNotification'
import { ratelimit } from '@/lib/ratelimit'
import { resend } from '@/lib/resend'
import { verifyTurnstile } from '@/lib/turnstile'
import { contactSchema } from '@/lib/utils/schemas'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

type ContactResult = { success: true } | { success: false; error: string }

export async function sendContactMessage(formData: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: 'error_generic' }
  }

  const { name, email, subject, message, turnstile_token, locale } = parsed.data

  // Rate limit by IP
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') ?? 'unknown'
  const { success: rateLimitOk } = await ratelimit.limit(ip)
  if (!rateLimitOk) {
    return { success: false, error: 'error_rate_limit' }
  }

  // Verify Turnstile
  const turnstileOk = await verifyTurnstile(turnstile_token)
  if (!turnstileOk) {
    return { success: false, error: 'error_turnstile' }
  }

  // Insert into DB via service role (bypasses RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  )

  const { error: dbError } = await supabase.from('contact_messages').insert({
    name,
    email,
    subject,
    message,
    ip_address: ip,
    turnstile_verified: true,
  })

  if (dbError) {
    return { success: false, error: 'error_generic' }
  }

  // Send emails in parallel
  const notificationHtml = await render(ContactNotification({ name, email, subject, message }))
  const confirmationHtml = await render(ContactConfirmation({ name, locale }))

  await Promise.all([
    resend.emails.send({
      from: 'kadath.fr <contact@kadath.fr>',
      to: 'contact@kadath.fr',
      subject: `[Contact] ${subject}`,
      html: notificationHtml,
    }),
    resend.emails.send({
      from: 'kadath.fr <contact@kadath.fr>',
      to: email,
      subject: locale === 'fr' ? 'Votre message a bien été reçu' : 'Your message has been received',
      html: confirmationHtml,
    }),
  ])

  return { success: true }
}
