import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const isDev = process.env.NODE_ENV === 'development'
const supabaseConnectSrc = isDev
  ? 'https://*.supabase.co http://localhost:54321 ws://localhost:54321 http://127.0.0.1:54321 ws://127.0.0.1:54321 http://172.20.37.255:54321 ws://172.20.37.255:54321'
  : 'https://*.supabase.co'

const cspHeader = {
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://cdn-cookieyes.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://cdn-cookieyes.com",
    "font-src 'self'",
    `connect-src 'self' ${supabaseConnectSrc} https://api.stripe.com https://cdn-cookieyes.com https://log.cookieyes.com`,
    'frame-src https://js.stripe.com https://challenges.cloudflare.com https://sokol.fr',
  ].join('; '),
}

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  ...(isDev ? [] : [cspHeader]),
]

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer', 'isomorphic-dompurify', 'jsdom'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*.@(js|css)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
