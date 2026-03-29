import { createClient } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

const locales = ['fr', 'en'] as const
const defaultLocale = 'fr'

const intlMiddleware = createMiddleware({ locales, defaultLocale })

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const isAdminDomain = hostname.startsWith('manage.')

  // 1. Refresh Supabase session
  const supabaseResponse = createClient(request)

  // 2. Apply next-intl locale routing
  const intlResponse = intlMiddleware(request)

  const pathname = request.nextUrl.pathname

  // 3. Domain-based route protection
  if (isAdminDomain) {
    // TODO: verify admin_users role (admin | editor) from Supabase session
    // Redirect to login if unauthenticated or unauthorized
    return intlResponse
  }

  // Protect /[locale]/customer/* routes
  const customerPattern = /^\/(?:fr|en)\/customer(?:\/|$)/
  if (customerPattern.test(pathname)) {
    // TODO: verify authenticated client session from Supabase
    // Redirect to /[locale]/auth/login if unauthenticated
    return intlResponse
  }

  // Merge Supabase cookies into the intl response
  for (const { name, value } of supabaseResponse.cookies.getAll()) {
    intlResponse.cookies.set(name, value)
  }

  return intlResponse
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
}
