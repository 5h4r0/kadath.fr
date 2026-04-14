import ContactSection from '@/components/contact/ContactSection'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title') }
}

export default async function ContactPage() {
  return (
    <main className="min-h-screen bg-tt-bg font-grotesk text-white">
      <ContactSection headingLevel="h1" autoFocus />
    </main>
  )
}
