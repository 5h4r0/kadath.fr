import { ConfirmPasswordChangeForm } from '@/components/auth/ConfirmPasswordChangeForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ConfirmPasswordChangePage({ params }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/auth/login`)

  const role = user.app_metadata?.role as string | undefined
  const isAdmin = role === 'admin' || role === 'editor'
  const successRedirect = isAdmin ? `/${locale}/cms` : `/${locale}/customer/dashboard`

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <ConfirmPasswordChangeForm locale={locale} successRedirect={successRedirect} />
    </div>
  )
}
