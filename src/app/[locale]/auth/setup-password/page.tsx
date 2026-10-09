import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SetupPasswordForm } from '@/components/auth/SetupPasswordForm'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SetupPasswordPage({ params }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  const role = user.app_metadata?.role as string | undefined
  const successRedirect =
    role === 'admin' || role === 'editor' ? `/${locale}/cms` : `/${locale}/customer/dashboard`

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <SetupPasswordForm successRedirect={successRedirect} />
    </div>
  )
}
