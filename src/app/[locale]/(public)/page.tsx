import ContactSection from '@/components/contact/ContactSection'
import { DeliverablesSection } from '@/components/sections/DeliverablesSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { MethodologySection } from '@/components/sections/MethodologySection'
import { OffersSection } from '@/components/sections/OffersSection'
import { OptionsSection } from '@/components/sections/OptionsSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { SocialProofSection } from '@/components/sections/SocialProofSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { ValuePropSection } from '@/components/sections/ValuePropSection'
import { fetchHomepageSections } from '@/lib/sections/fetch-homepage'
import type {
  HeroContent,
  ProblemSolutionContent,
  SocialProofContent,
  ValuePropContent,
} from '@/types/page-sections'

// Vitrine ThinkTwice — Hero section
// Revalidation toutes les 60s (page semi-dynamique, cf. CLAUDE.md)
export const revalidate = 60

export default async function HomePage() {
  const sections = await fetchHomepageSections()

  const heroSection = sections.find((s) => s.type === 'hero')
  const valuePropSection = sections.find((s) => s.type === 'value_prop')
  const socialProofSection = sections.find((s) => s.type === 'social_proof')
  const problemSolutionSection = sections.find((s) => s.type === 'problem_solution')

  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {heroSection && <HeroSection content={heroSection.content as unknown as HeroContent} />}

      {/* ── VALUE PROP ─────────────────────────────────────────────────── */}
      {valuePropSection && (
        <ValuePropSection content={valuePropSection.content as unknown as ValuePropContent} />
      )}

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────── */}
      {socialProofSection && (
        <SocialProofSection content={socialProofSection.content as unknown as SocialProofContent} />
      )}
      {/* ── PROBLÈME / SOLUTION ────────────────────────────────────────── */}
      {problemSolutionSection && (
        <ProblemSolutionSection
          content={problemSolutionSection.content as unknown as ProblemSolutionContent}
        />
      )}
      {/* ── MÉTHODOLOGIE / POUR QUI ────────────────────────────────────── */}
      <MethodologySection />

      {/* ── CE QUE VOUS OBTENEZ ────────────────────────────────────────── */}
      <DeliverablesSection />

      {/* ── NOS OFFRES ─────────────────────────────────────────────────── */}
      <OffersSection />

      {/* ── OPTIONS / CTA PRINCIPAL ────────────────────────────────────── */}
      <OptionsSection />

      {/* ── QUI NOUS SOMMES ────────────────────────────────────────────── */}
      <TeamSection />

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contact" className="border-t border-[#444444]">
        <ContactSection />
      </section>
    </main>
  )
}
