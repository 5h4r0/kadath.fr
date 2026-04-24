import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ManageAuthForm } from '@/components/auth/ManageAuthForm'
import { createClient } from '@/lib/supabase/server'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function ManagePage({ searchParams }: Props) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/manage/cms')

  const { error } = await searchParams
  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg px-4">
      <ManageAuthForm error={error} />
    </div>
  )
}
