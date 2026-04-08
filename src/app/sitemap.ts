import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kadath.fr'

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
  // TODO: fetch published CMS pages from Supabase and include them
  return [...staticRoutes()]
}
