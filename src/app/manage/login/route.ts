import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: 'Email ou mot de passe incorrect.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
