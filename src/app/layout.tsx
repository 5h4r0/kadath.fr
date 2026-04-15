import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'thinktwice', template: '%s | thinktwice.sokol.fr' },
  description: 'Développeur web freelance — WordPress, Next.js, TypeScript, Express.js, React',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://thinktwice.sokol.fr'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
