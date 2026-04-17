import AuthForm from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; error?: string }>
}

export default async function AdminLoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.app_metadata?.role as string | undefined
  if (user && (role === 'admin' || role === 'editor')) {
    redirect(`/${locale}/cms`)
  }

  const { redirect: redirectTo, error } = await searchParams
  return <AuthForm redirectTo={redirectTo ?? `/${locale}/cms`} error={error} />
}
