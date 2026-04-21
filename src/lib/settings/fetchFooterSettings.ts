import { createClient } from '@supabase/supabase-js'

export interface FooterLegalLink {
  label_fr: string
  label_en: string
  href_fr: string
  href_en: string
}

export interface FooterSettings {
  copyright: { fr: string; en: string }
  legalLinks: FooterLegalLink[]
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
  )

  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['footer_copyright_fr', 'footer_copyright_en', 'footer_legal_links'])

  const get = (key: string) => data?.find((r) => r.key === key)?.value ?? null

  const rawLinks = get('footer_legal_links')
  const parsedLinks: unknown = rawLinks ? JSON.parse(rawLinks) : []

  const rawFr = get('footer_copyright_fr')
  const rawEn = get('footer_copyright_en')

  return {
    copyright: {
      fr: rawFr ? (JSON.parse(rawFr) as string) : '',
      en: rawEn ? (JSON.parse(rawEn) as string) : '',
    },
    legalLinks: Array.isArray(parsedLinks) ? (parsedLinks as FooterLegalLink[]) : [],
  }
}
