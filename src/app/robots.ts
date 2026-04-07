import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kadath.fr'

const protectedPaths = ['/.env', '/.git', '/api/', '/customer/', '/manage/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'PetalBot'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: protectedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
