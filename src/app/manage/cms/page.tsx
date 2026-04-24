import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ManageCmsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/manage')

  return (
    <div className="flex min-h-screen items-center justify-center bg-tt-bg">
      <p className="text-white">CMS — à implémenter</p>
    </div>
  )
}
