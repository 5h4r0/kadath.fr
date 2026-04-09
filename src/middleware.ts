import { createClient } from '@/lib/supabase/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

const locales = ['fr', 'en'] as const
const defaultLocale = 'fr'

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale })

const ADMIN_ROLES = ['admin', 'editor'] as const
const CUSTOMER_PATTERN = /^\/(?:fr|en)\/customer(?:\/|$)/
const AUTH_PATTERN = /^\/(?:fr|en)\/auth(?:\/|$)/

function extractLocale(pathname: string): string {
  const match = pathname.match(/^\/(fr|en)(?:\/|$)/)
  return match ? match[1] : defaultLocale
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? ''
  const isAdminDomain = hostname.startsWith('manage.')
  const pathname = request.nextUrl.pathname

  // 1. Init Supabase client (refreshes session via cookie setAll)
  const { supabase, response: supabaseResponse } = createClient(request)

  // 2. Apply next-intl locale routing
  const intlResponse = intlMiddleware(request)

  // Helper: merge Supabase session cookies into a response
  const withCookies = (res: NextResponse) => {
    for (const { name, value } of supabaseResponse.cookies.getAll()) {
      res.cookies.set(name, value)
    }
    return res
  }

  // 3. Admin domain guard — require admin or editor role
  if (isAdminDomain) {
    // Auth routes on admin domain are always public
    if (!AUTH_PATTERN.test(pathname)) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const role = user?.app_metadata?.role as string | undefined
      const isAuthorized = !!user && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])

      if (!isAuthorized) {
        const locale = extractLocale(pathname)
        const loginUrl = new URL(`/${locale}/auth/admin`, request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    return withCookies(intlResponse)
  }

  // 4. Customer routes guard — require any authenticated session
  if (CUSTOMER_PATTERN.test(pathname)) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      const locale = extractLocale(pathname)
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 5. Public routes — merge cookies and proceed
  return withCookies(intlResponse)
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
}
