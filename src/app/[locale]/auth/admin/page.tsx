import AuthForm from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  searchParams: Promise<{ redirect?: string }>
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.app_metadata?.role as string | undefined
  if (user && (role === 'admin' || role === 'editor')) {
    redirect('/fr')
  }

  const { redirect: redirectTo } = await searchParams
  return <AuthForm redirectTo={redirectTo ?? '/fr'} />
}
