import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ redirect?: string; error?: string }>
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const host = (await headers()).get('host') ?? ''
  const isAdminDomain = host.startsWith('manage.')
  // const defaultRedirect = isAdminDomain ? `/${locale}/cms` : `/${locale}/customer/dashboard`
  const defaultRedirect = isAdminDomain ? `/${locale}/cms` : `/${locale}`

  if (user) {
    redirect(defaultRedirect)
  }

  const { redirect: redirectTo, error } = await searchParams
  return <AuthForm redirectTo={redirectTo ?? defaultRedirect} error={error} />
}
