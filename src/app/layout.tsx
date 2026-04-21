import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'thinktwice', template: '%s | thinktwice.sokol.fr' },
  description:
    'Création et Développement web — WordPress — Apps Next.js, TypeScript, Express.js, ReactJS',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://thinktwice.sokol.fr'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
