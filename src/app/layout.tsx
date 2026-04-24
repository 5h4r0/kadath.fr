import type { Metadata } from 'next'
import { Source_Sans_3, Space_Grotesk } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

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

const helveticaCondensed = localFont({
  src: [
    { path: './fonts/helvetica_condensed_light.woff2', weight: '300' },
    { path: './fonts/helvetica_condensed.woff2', weight: '400' },
    { path: './fonts/helvetica_condensed_black.woff2', weight: '900' },
  ],
  variable: '--font-helvetica-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'thinktwice', template: '%s | thinktwice.sokol.fr' },
  description:
    'Création et Développement web — WordPress — Apps Next.js, TypeScript, Express.js, ReactJS',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://thinktwice.sokol.fr'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} ${sourceSans3.variable} ${helveticaCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
