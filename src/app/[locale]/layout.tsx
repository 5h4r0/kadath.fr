import { notFound } from 'next/navigation'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const locales = ['fr', 'en'] as const
type Locale = (typeof locales)[number]

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {process.env.NEXT_PUBLIC_COOKIEYES_ENABLED === 'true' && (
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/ef1fc7682b16315dca7139faf311fc93/script.js"
          strategy="afterInteractive"
        />
      )}
      {children}
    </NextIntlClientProvider>
  )
}
