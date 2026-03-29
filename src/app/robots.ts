import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kadath.fr'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/customer/', '/manage/'] }],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
