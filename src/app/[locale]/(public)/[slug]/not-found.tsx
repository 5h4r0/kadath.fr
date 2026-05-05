import Link from 'next/link'
import { HeroSection } from '@/components/sections/HeroSection'

export default function NotFound() {
  return (
    <div className="bg-tt-bg font-grotesk text-white">
      <HeroSection
        content={{
          tagline_top: '',
          tagline_main: '',
          tagline_sub: '',
          logo_alt: 'thinktwice',
        }}
      />
      <main>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <p className="mb-2 text-8xl font-light text-tt-accent">404</p>
          <h1 className="mb-6 text-2xl font-light">Page introuvable</h1>
          <p className="mb-10 text-white/50">Cette page n&apos;existe pas ou a été supprimée.</p>
          <Link href="/fr" className="text-tt-accent hover:opacity-70 transition-opacity">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  )
}
