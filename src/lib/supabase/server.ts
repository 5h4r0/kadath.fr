import { type CookieOptionsWithName, createServerClient } from '@supabase/ssr'
import type { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl ?? '', supabaseKey ?? '', {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptionsWithName }[]) {
        try {
          for (const { name, value, options } of cookiesToSet)
            cookieStore.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === 'production',
            })
        } catch {}
      },
    },
  })
}
