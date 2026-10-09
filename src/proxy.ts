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

// Le backoffice n'a qu'une seule adresse publique : https://kadath.fr/fr/manage.
// Les pages vivent toujours dans src/app/manage/ (hors du segment [locale]) :
// /fr/manage y est réécrit sans que l'URL change, ce qui évite de déplacer tout
// l'arbre de routes. Toute autre forme — sans langue, en /en, ou sur le domaine
// canonique thinktwice.sokol.fr — est renvoyée en 301 vers l'adresse unique.
const BACKOFFICE_DOMAINE = 'kadath.fr'
const BACKOFFICE_BASE = '/fr/manage'
const BACKOFFICE_CHEMIN = /^\/(?:(?:fr|en)\/)?manage(?:\/|$)/
// Cible POST du formulaire de connexion : jamais redirigée, une 301 sur un POST
// le transformerait en GET et la connexion échouerait silencieusement.
const BACKOFFICE_ENDPOINT_LOGIN = '/manage/login'

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

  // 3a. Backoffice — adresse unique, hors internationalisation, admin seulement
  if (BACKOFFICE_CHEMIN.test(pathname)) {
    if (pathname === BACKOFFICE_ENDPOINT_LOGIN) return withCookies(NextResponse.next())

    // '' pour la racine du backoffice, '/cms', '/clients/42'… ensuite.
    const suffixe = pathname.replace(/^\/(?:(?:fr|en)\/)?manage/, '')
    const hote = request.headers.get('host') ?? ''
    const surLeBonDomaine =
      hote === BACKOFFICE_DOMAINE ||
      hote === `www.${BACKOFFICE_DOMAINE}` ||
      hote.startsWith('localhost') ||
      hote.startsWith('127.0.0.1')

    if (!surLeBonDomaine) {
      return NextResponse.redirect(`https://${BACKOFFICE_DOMAINE}${BACKOFFICE_BASE}${suffixe}`, 301)
    }

    if (pathname !== BACKOFFICE_BASE && !pathname.startsWith(`${BACKOFFICE_BASE}/`)) {
      const cible = request.nextUrl.clone()
      cible.pathname = `${BACKOFFICE_BASE}${suffixe}`
      return NextResponse.redirect(cible, 301)
    }

    // Tout sauf la racine exige un rôle : la racine porte le formulaire.
    if (suffixe !== '') {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const role = user?.app_metadata?.role as string | undefined
      const isAuthorized = !!user && ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])
      if (!isAuthorized) {
        return withCookies(NextResponse.redirect(new URL(BACKOFFICE_BASE, request.url)))
      }
    }

    const reecriture = request.nextUrl.clone()
    reecriture.pathname = `/manage${suffixe}`
    return withCookies(NextResponse.rewrite(reecriture))
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
