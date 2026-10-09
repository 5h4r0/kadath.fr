import type { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  const { searchParams } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') // 'invite' | 'recovery' | 'email'

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
  }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as EmailOtpType,
  })

  if (error) {
    const url = new URL(`/${locale}/auth/login`, request.url)
    url.searchParams.set('error', 'link_expired')
    return NextResponse.redirect(url)
  }

  if (type === 'invite') {
    return NextResponse.redirect(new URL(`/${locale}/auth/setup-password`, request.url))
  }
  if (type === 'recovery') {
    return NextResponse.redirect(new URL(`/${locale}/auth/confirm-password-change`, request.url))
  }

  return NextResponse.redirect(new URL(`/${locale}/customer/dashboard`, request.url))
}
