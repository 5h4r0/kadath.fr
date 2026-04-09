export type SectionType =
  | 'hero'
  | 'value_prop'
  | 'social_proof'
  | 'problem_solution'
  | 'services'
  | 'contact'
  | 'custom'

export interface PageSection {
  id: string
  page_id: string
  type: SectionType
  order_index: number
  is_visible: boolean
  content: Record<string, unknown> // JSONB — typé par section ci-dessous
}

// Content shapes par type
export interface HeroContent {
  tagline_top: string
  tagline_main: string
  tagline_sub: string
  logo_alt: string
}

export interface ValuePropContent {
  headline: string
  subheadline: string
  cta_primary: { label: string; href: string }
  cta_secondary: { label: string; href: string }
}

export interface SocialProofContent {
  stat_label: string // ex: "+20 ans d'expérience"
  testimonials?: { name: string; role: string; quote: string }[]
}

export interface ProblemSolutionContent {
  problem_headline: string
  problem_body: string
  solution_headline: string
  solution_body: string
}
