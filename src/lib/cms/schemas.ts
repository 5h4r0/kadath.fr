import { z } from 'zod'

export const HeroContentSchema = z.object({
  tagline_top: z.string(),
  tagline_main: z.string(),
  tagline_sub: z.string(),
  logo_alt: z.string(),
})

export const ValuePropContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta_primary: z.object({ label: z.string(), href: z.string() }),
  cta_secondary: z.object({ label: z.string(), href: z.string() }),
})

export const SocialProofContentSchema = z.object({
  stat_label: z.string(),
  testimonials: z
    .array(z.object({ name: z.string(), role: z.string(), quote: z.string() }))
    .optional(),
})

export const ProblemSolutionContentSchema = z.object({
  problem_headline: z.string(),
  problem_body: z.string(),
  solution_headline: z.string(),
  solution_body: z.string(),
})

export const MethodologyContentSchema = z.object({
  title: z.string(),
  steps: z.array(z.object({ title: z.string(), desc: z.string() })),
  target_title: z.string(),
  target_intro: z.string(),
  target_items: z.array(z.string()),
})

export const DeliverablesContentSchema = z.object({
  title: z.string(),
  items: z.array(
    z.object({
      key: z.string(),
      title: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
})

export const OffersContentSchema = z.object({
  title: z.string(),
  intro: z.string(),
  cta_label: z.string(),
  for_who_label: z.string(),
  content_label: z.string(),
  offers: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      price: z.string(),
      tagline: z.string(),
      pitch: z.string(),
      for_who: z.array(z.string()),
      content: z.array(z.string()),
    }),
  ),
})

export const OptionsContentSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
  cta_label: z.string(),
})

export const TeamContentSchema = z.object({
  title: z.string(),
  members: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      img: z.string(),
      linkedin: z.string(),
      bios: z.array(z.string()),
    }),
  ),
})

export const ContactContentSchema = z.object({
  heading: z.string(),
  offices: z.array(
    z.object({
      city: z.string(),
      address_1: z.string(),
      address_2: z.string(),
    }),
  ),
  email_label: z.string(),
  email: z.string(),
  contacts: z.array(
    z.object({
      label: z.string(),
      phone: z.string(),
      phone_href: z.string(),
    }),
  ),
  form_heading: z.string(),
  form_heading_txt: z.string(),
})

export const ReferencesSliderContentSchema = z.object({})
export type ReferencesSliderContent = z.infer<typeof ReferencesSliderContentSchema>

export type HeroContent = z.infer<typeof HeroContentSchema>
export type ValuePropContent = z.infer<typeof ValuePropContentSchema>
export type SocialProofContent = z.infer<typeof SocialProofContentSchema>
export type ProblemSolutionContent = z.infer<typeof ProblemSolutionContentSchema>
export type MethodologyContent = z.infer<typeof MethodologyContentSchema>
export type DeliverablesContent = z.infer<typeof DeliverablesContentSchema>
export type OffersContent = z.infer<typeof OffersContentSchema>
export type OptionsContent = z.infer<typeof OptionsContentSchema>
export type TeamContent = z.infer<typeof TeamContentSchema>
export type ContactContent = z.infer<typeof ContactContentSchema>
