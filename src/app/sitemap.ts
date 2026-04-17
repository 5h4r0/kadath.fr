import { createClient } from '@/lib/supabase/server'
import type { MetadataRoute } from 'next'
import { cookies } from 'next/headers'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://thinktwice.sokol.fr'

const locales = ['fr', 'en'] as const

function staticRoutes(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  return routes.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })),
  )
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: pages } = await supabase
    .from('cms_pages')
    .select('slug, updated_at, lang')
    .eq('published', true)
    .is('deleted_at', null)

  const cmsRoutes: MetadataRoute.Sitemap = (pages ?? []).map((page) => ({
    url: `${baseUrl}/${page.lang}/${page.slug}`,
    lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes(), ...cmsRoutes]
}
