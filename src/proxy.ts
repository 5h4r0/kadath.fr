import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createClient } from '@/lib/supabase/middleware'

const locales = ['fr', 'en'] as const
const defaultLocale = 'fr'

const intlMiddleware = createIntlMiddleware({ locales, defaultLocale })

const ADMIN_ROLES = ['admin', 'editor'] as const
const CUSTOMER_PATTERN = /^\/(?:fr|en)\/customer(?:\/|$)/
const AUTH_PATTERN = /^\/(?:fr|en)\/auth(?:\/|$)/
const ADMIN_PATH_PATTERN = /^\/(?:fr|en)\/(?:cms|clients|invoices|projects)(?:\/|$)/
const MANAGE_PROTECTED = /^\/manage\/.+/

function extractLocale(pathname: string): string {
  const match = pathname.match(/^\/(fr|en)(?:\/|$)/)
  return match ? match[1] : defaultLocale
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminDomain = process.env.FORCE_ADMIN_HOST === 'true' || pathname.startsWith('/manage')

  // 1. Init Supabase client (refreshes session via cookie setAll)
  const { supabase, response: supabaseResponse } = createClient(request)

  // Helper: merge Supabase session cookies into a response
  const withCookies = (res: NextResponse) => {
    for (const { name, value } of supabaseResponse.cookies.getAll()) {
      res.cookies.set(name, value)
    }
    return res
  }

  // 3a. Handle /manage segment — bypass intl, admin-only
  if (pathname.startsWith('/manage')) {
    if (MANAGE_PROTECTED.test(pathname)) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log('user:', user?.id, 'role:', user?.app_metadata?.role) // ← ici

      const role = user?.app_metadata?.role as string | undefined
      const isAuthorized = !!user && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])
      if (!isAuthorized) {
        return withCookies(NextResponse.redirect(new URL('/manage', request.url)))
      }
    }
    return withCookies(NextResponse.next())
  }

  // 2. Apply next-intl locale routing (only for non-/manage routes)
  const intlResponse = intlMiddleware(request)

  // 3. Block admin paths on non-manage hostnames
  if (!isAdminDomain && ADMIN_PATH_PATTERN.test(pathname)) {
    const locale = extractLocale(pathname)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // 4. Admin domain guard — require admin or editor role
  if (isAdminDomain && ADMIN_PATH_PATTERN.test(pathname)) {
    if (pathname.startsWith('/manage')) return withCookies(NextResponse.next())

    // Auth routes on admin domain are always public
    if (!AUTH_PATTERN.test(pathname)) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const role = user?.app_metadata?.role as string | undefined
      const isAuthorized = !!user && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])

      if (!isAuthorized) {
        return withCookies(NextResponse.redirect(new URL('/manage', request.url)))
      }
    }

    return withCookies(intlResponse)
  }

  // 5. Customer routes guard — require any authenticated session
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

  // 6. Public routes — merge cookies and proceed
  return withCookies(intlResponse)
}

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
}
