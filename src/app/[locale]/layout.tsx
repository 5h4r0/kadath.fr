import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Source_Sans_3, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200'],
  variable: '--font-source-sans-3',
  display: 'swap',
})

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
    <html lang={locale} className={`${spaceGrotesk.variable} ${sourceSans3.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
