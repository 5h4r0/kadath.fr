import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kadath.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // TODO: fetch published CMS pages from Supabase and include them
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]
}
