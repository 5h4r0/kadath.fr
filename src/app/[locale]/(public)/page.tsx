import ContactSection from '@/components/contact/ContactSection'
import { DeliverablesSection } from '@/components/sections/DeliverablesSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { MethodologySection } from '@/components/sections/MethodologySection'
import { OffersSection } from '@/components/sections/OffersSection'
import { OptionsSection } from '@/components/sections/OptionsSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { ReferencesSliderSection } from '@/components/sections/ReferencesSliderSection'
import { SocialProofSection } from '@/components/sections/SocialProofSection'
import { TeamSection } from '@/components/sections/TeamSection'
import { ValuePropSection } from '@/components/sections/ValuePropSection'
import {
  ContactContentSchema,
  DeliverablesContentSchema,
  HeroContentSchema,
  MethodologyContentSchema,
  OffersContentSchema,
  OptionsContentSchema,
  ProblemSolutionContentSchema,
  ReferencesSliderContentSchema,
  SocialProofContentSchema,
  TeamContentSchema,
  ValuePropContentSchema,
} from '@/lib/cms/schemas'
import { fetchHomepageSections } from '@/lib/sections/fetch-homepage'

// Vitrine ThinkTwice — Hero section
// Revalidation toutes les 60s (page semi-dynamique, cf. CLAUDE.md)
export const revalidate = 60

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const sections = await fetchHomepageSections()

  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {sections.map((section) => {
        const raw = section.content[locale] ?? section.content.fr
        switch (section.type) {
          case 'hero': {
            const p = HeroContentSchema.safeParse(raw)
            return p.success ? <HeroSection key={section.id} content={p.data} /> : null
          }
          case 'value_prop': {
            const p = ValuePropContentSchema.safeParse(raw)
            return p.success ? <ValuePropSection key={section.id} content={p.data} /> : null
          }
          case 'social_proof': {
            const p = SocialProofContentSchema.safeParse(raw)
            return p.success ? <SocialProofSection key={section.id} content={p.data} /> : null
          }
          case 'problem_solution': {
            const p = ProblemSolutionContentSchema.safeParse(raw)
            return p.success ? <ProblemSolutionSection key={section.id} content={p.data} /> : null
          }
          case 'methodology': {
            const p = MethodologyContentSchema.safeParse(raw)
            return p.success ? <MethodologySection key={section.id} content={p.data} /> : null
          }
          case 'deliverables': {
            const p = DeliverablesContentSchema.safeParse(raw)
            return p.success ? <DeliverablesSection key={section.id} content={p.data} /> : null
          }
          case 'offers': {
            const p = OffersContentSchema.safeParse(raw)
            return p.success ? <OffersSection key={section.id} content={p.data} /> : null
          }
          case 'options': {
            const p = OptionsContentSchema.safeParse(raw)
            return p.success ? <OptionsSection key={section.id} content={p.data} /> : null
          }
          case 'team': {
            const p = TeamContentSchema.safeParse(raw)
            return p.success ? <TeamSection key={section.id} content={p.data} /> : null
          }
          case 'references_slider': {
            const p = ReferencesSliderContentSchema.safeParse(raw)
            return p.success ? <ReferencesSliderSection key={section.id} /> : null
          }
          case 'contact': {
            const p = ContactContentSchema.safeParse(raw)
            return p.success ? (
              <section key={section.id} id="contact">
                <ContactSection content={p.data} />
              </section>
            ) : null
          }
          default:
            return null
        }
      })}
    </main>
  )
}
