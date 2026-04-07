import ContactForm from '@/components/contact/ContactForm'
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <main className="min-h-screen bg-tt-bg">
      <section className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="mb-3 font-bold text-3xl text-tt-accent tracking-tight">{t('title')}</h1>
        <p className="mb-10 text-[#cccccc]">{t('subtitle')}</p>
        <ContactForm />
      </section>
    </main>
  )
}
