import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import ContactSection from '@/components/contact/ContactSection'
import { ContactContentSchema } from '@/lib/cms/schemas'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { title: locale === 'en' ? 'Contact' : 'Contact' }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
  )

  const { data } = await supabase
    .from('page_sections')
    .select('content')
    .eq('type', 'contact')
    .is('deleted_at', null)
    .single()

  const rawContent = data?.content?.[locale] ?? data?.content?.fr
  const parsed = ContactContentSchema.safeParse(rawContent)

  if (!parsed.success) notFound()

  return (
    <main className="min-h-screen bg-tt-bg font-grotesk text-white">
      <ContactSection content={parsed.data} headingLevel="h1" autoFocus />
    </main>
  )
}
