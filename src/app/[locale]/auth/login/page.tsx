import AuthForm from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const host = (await headers()).get('host') ?? ''
  const isAdminDomain = host.startsWith('manage.')
  const defaultRedirect = isAdminDomain ? '/fr/cms' : '/fr/customer'

  if (user) {
    redirect(defaultRedirect)
  }

  const { redirect: redirectTo } = await searchParams
  return <AuthForm redirectTo={redirectTo ?? defaultRedirect} />
}
