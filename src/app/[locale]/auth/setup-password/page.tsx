import { SetupPasswordForm } from '@/components/auth/SetupPasswordForm'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <SetupPasswordForm locale={locale} />
    </div>
  )
}
