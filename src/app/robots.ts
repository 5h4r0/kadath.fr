import type { MetadataRoute } from 'next'

// La barre finale est retirée : en production la variable en portait une,
// et le sitemap servait des URL en double barre (https://…//fr).
const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://thinktwice.sokol.fr').replace(
  /\/+$/,
  '',
)

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
