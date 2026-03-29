# REF.md — Référence technique kadath.fr
> Patterns, snippets et conventions à réutiliser systématiquement

---

## Supabase — Clients

```ts
// Server Component / Server Action
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const cookieStore = await cookies()
const supabase = createClient(cookieStore)

// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

---

## Supabase — Requêtes

```ts
// ✅ Toujours colonnes explicites — jamais SELECT *
const { data, error } = await supabase
  .from('clients')
  .select('id, first_name, last_name, email, status')
  .is('deleted_at', null)
  .order('created_at', { ascending: false })

// ✅ Soft delete
await supabase
  .from('clients')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', id)

// ✅ Full-text search — clients (admin)
const { data } = await supabase
  .from('clients')
  .select('id, first_name, last_name, email')
  .is('deleted_at', null)
  .textSearch('fts', query, { type: 'plain', config: 'simple' })

// ✅ Full-text search — pages CMS (front)
const { data } = await supabase
  .rpc('search_cms_pages', { query, lang: locale })

// ✅ Full-text search — devis / factures (admin)
const { data } = await supabase
  .from('quotes')
  .select('id, number, status, amount_ht')
  .textSearch('fts', query, { type: 'plain', config: 'simple' })
```

---

## Zod — Validation formulaires

```ts
// src/lib/utils/schemas.ts — schémas disponibles :
// contactSchema, passwordSchema, clientProfileSchema,
// quoteSchema, invoiceSchema, cmsPageSchema

import { contactSchema } from '@/lib/utils/schemas'

// Server Action
const result = contactSchema.safeParse(formData)
if (!result.success) return { error: result.error.flatten() }

// Inférer le type
type ContactInput = z.infer<typeof contactSchema>
```

---

## Server Actions — Pattern standard

```ts
'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { cmsPageSchema } from '@/lib/utils/schemas'

export async function updatePage(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const result = cmsPageSchema.safeParse(raw)
  if (!result.success) return { error: result.error.flatten() }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('cms_pages')
    .update({ ...result.data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidateTag('cms-pages')
  revalidateTag(`cms-page-${result.data.slug}`)

  return { success: true }
}
```

---

## TipTap — Sanitisation DOMPurify

```ts
// ⚠️ Obligatoire avant tout stockage HTML TipTap en DB
import DOMPurify from 'isomorphic-dompurify'

const clean = DOMPurify.sanitize(tiptapHtml)

// Dans une Server Action ou avant INSERT/UPDATE
await supabase.from('cms_pages').update({
  sections: JSON.stringify(
    sections.map(s => ({ ...s, content_tiptap: DOMPurify.sanitize(s.content_tiptap) }))
  )
})
```

---

## Cache & revalidateTag

```ts
// Fetch avec tag (Server Component)
const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/pages`, {
  next: { tags: ['cms-pages'] },
})

// Ou avec Supabase directement + tag manuel via unstable_cache
import { unstable_cache } from 'next/cache'

const getCmsPage = unstable_cache(
  async (slug: string) => {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data } = await supabase
      .from('cms_pages')
      .select('id, slug, title, resume, sections, published_at')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    return data
  },
  ['cms-page'],
  { tags: ['cms-pages'] }
)

// Invalider après publication
revalidateTag('cms-pages')
revalidateTag(`cms-page-${slug}`)
```

---

## Rate Limiting — Upstash

```ts
import { ratelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

export async function contactAction(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') ?? 'anonymous'

  const { success } = await ratelimit.limit(ip)
  if (!success) return { error: 'Trop de tentatives. Réessayez dans 10 minutes.' }

  // ... suite du traitement
}
```

---

## Emails — Resend

```ts
import { resend } from '@/lib/resend'

await resend.emails.send({
  from: 'kadath.fr <no-reply@kadath.fr>',
  to: [client.email],
  subject: 'Nouvelle facture disponible',
  react: InvoiceEmail({ invoice, url: signedUrl }),
})
```

---

## Storage — Signed URLs

```ts
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const cookieStore = await cookies()
const supabase = createClient(cookieStore)

// Génération signed URL (1h)
const { data, error } = await supabase.storage
  .from('documents')
  .createSignedUrl(`invoice/${invoiceId}.pdf`, 3600)

// Upload (Server Action)
const { error } = await supabase.storage
  .from('documents')
  .upload(`invoice/${invoiceId}.pdf`, pdfBuffer, {
    contentType: 'application/pdf',
    upsert: true,
  })
```

### Conventions de nommage Storage

```
media/{slug}/hero.webp
media/{slug}/galerie/{n}.webp
projects/{project_id}/{filename}
attachments/{message_id}/{filename}
documents/quote/{quote_id}.pdf
documents/invoice/{invoice_id}.pdf
```

---

## PDF — react-pdf

```ts
'use server'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoiceDocument } from '@/components/pdf/InvoiceDocument'

export async function generateInvoicePdf(invoiceId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, number, amount_ht, tva_rate, issued_at, due_at, invoice_lines(*)')
    .eq('id', invoiceId)
    .single()

  if (!invoice) return { error: 'Facture introuvable' }

  const buffer = await renderToBuffer(<InvoiceDocument invoice={invoice} />)

  await supabase.storage
    .from('documents')
    .upload(`invoice/${invoiceId}.pdf`, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  const { data } = await supabase.storage
    .from('documents')
    .createSignedUrl(`invoice/${invoiceId}.pdf`, 3600)

  return { url: data?.signedUrl }
}
```

---

## Numérotation — Devis / Factures

La numérotation est automatique via trigger PostgreSQL (`assign_quote_number`, `assign_invoice_number`).
Format : `PREFIX-YYYY-NNNN` (ex: `DEVIS-2026-0001`, `FACT-2026-0042`).

```ts
// Insérer sans préciser number — le trigger l'assigne automatiquement
const { data } = await supabase
  .from('quotes')
  .insert({
    project_id,
    amount_ht,
    tva_rate: 20,
    issued_at: new Date().toISOString().split('T')[0],
    status: 'draft',
  })
  .select('id, number')
  .single()

// data.number = 'DEVIS-2026-0043'
```

---

## Révisions CMS

```ts
// Sauvegarder une révision avant modification
await supabase.from('cms_page_revisions').insert({
  page_id: id,
  author_id: adminId,
  label: 'Avant refonte hero',
  snapshot: currentPageData,  // objet JS complet de la ligne cms_pages
})
// Le trigger enforce_revision_limit() conserve automatiquement max 5 révisions
```

---

## Auth — Vérification rôle (Server Component)

```ts
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/fr/auth/login')

  const { data: admin } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!admin) redirect('/fr/auth/login')

  return <Dashboard role={admin.role} />
}
```

---

## Consentements CGU

```ts
// À enregistrer après clic confirmation email
await supabase.from('consents').insert([
  { user_id, type: 'terms',   version: '2026-03', ip_address: ip, user_agent: ua },
  { user_id, type: 'cookies', version: '2026-03', ip_address: ip, user_agent: ua },
])
```

---

## Thèmes UI

Cookie SSR `theme` + `localStorage`.

```ts
// Appliquer le thème sur <html>
// Valeurs : 'theme-light' | 'theme-dark' | 'theme-accessible'
<html lang={locale} className={theme}>
```

---

## Commandes utiles

```bash
pnpm dev                          # localhost:3000
pnpm type-check                   # tsc --noEmit
pnpm check                        # Biome lint + format
pnpm test                         # Vitest

# Supabase
supabase gen types typescript --local > src/types/supabase.ts
supabase db push                  # appliquer les migrations locales
supabase db diff                  # voir les changements de schéma

# Seed (dev uniquement)
pnpm dlx tsx --env-file=.env.local scripts/seed-auth.ts
# Puis appliquer supabase/seed.sql via MCP ou supabase db reset

# Deploy
pnpm build && firebase deploy --only hosting
```
