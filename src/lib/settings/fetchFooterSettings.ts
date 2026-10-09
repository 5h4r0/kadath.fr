import { createClient } from '@supabase/supabase-js'

export interface FooterLegalLink {
  id: string
  zone: 'legal' | 'nav'
  order_index: number
  slug: string
  title: string
}

export interface FooterSettings {
  copyright: { fr: string; en: string }
  legalLinks: FooterLegalLink[]
  navLinks: FooterLegalLink[]
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
  )

  const [{ data: settingsData }, { data: linksData }] = await Promise.all([
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['footer_copyright_fr', 'footer_copyright_en']),
    supabase
      .from('footer_legal_links')
      .select('id, zone, order_index, cms_pages(slug, title)')
      .order('zone')
      .order('order_index'),
  ])

  const get = (key: string) => settingsData?.find((r) => r.key === key)?.value ?? null

  const rawFr = get('footer_copyright_fr')
  const rawEn = get('footer_copyright_en')

  const allLinks: FooterLegalLink[] = (linksData ?? []).map((row) => {
    const page = Array.isArray(row.cms_pages) ? row.cms_pages[0] : row.cms_pages
    return {
      id: row.id,
      zone: row.zone as 'legal' | 'nav',
      order_index: row.order_index,
      slug: page?.slug ?? '',
      title: page?.title ?? '',
    }
  })

  return {
    copyright: {
      fr: rawFr ? (JSON.parse(rawFr) as string) : '',
      en: rawEn ? (JSON.parse(rawEn) as string) : '',
    },
    legalLinks: allLinks.filter((l) => l.zone === 'legal'),
    navLinks: allLinks.filter((l) => l.zone === 'nav'),
  }
}
