export type SectionType =
  | 'hero'
  | 'value_prop'
  | 'social_proof'
  | 'problem_solution'
  | 'methodology'
  | 'deliverables'
  | 'offers'
  | 'options'
  | 'team'
  | 'references_slider'
  | 'contact'
  | 'services'
  | 'custom'

export interface PageSection {
  id: string
  page_id: string
  type: SectionType
  order_index: number
  is_visible: boolean
  content: Record<string, Record<string, unknown>> // { fr: {...}, en: {...} }
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

export interface MethodologyContent {
  title: string
  steps: { title: string; desc: string }[]
  target_title: string
  target_intro: string
  target_items: string[]
}

export interface DeliverablesContent {
  title: string
  items: {
    key: string
    title: string
    bullets: string[]
  }[]
}

export interface OffersContent {
  title: string
  intro: string
  cta_label: string
  for_who_label: string
  content_label: string
  offers: {
    slug: string
    name: string
    price: string
    tagline: string
    pitch: string
    for_who: string[]
    content: string[]
  }[]
}

export interface OptionsContent {
  title: string
  items: string[]
  cta_label: string
}

export interface TeamContent {
  title: string
  members: {
    key: string
    name: string
    img: string
    linkedin: string
    bios: string[]
  }[]
}

export type ReferencesSliderContent = Record<string, never>

export interface ContactContent {
  heading: string
  offices: {
    city: string
    address_1: string
    address_2: string
  }[]
  email_label: string
  email: string
  contacts: {
    label: string
    phone: string
    phone_href: string
  }[]
  form_heading: string
  form_heading_txt: string
}
