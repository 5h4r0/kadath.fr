import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PagesList } from './PagesList'

export const dynamic = 'force-dynamic'

export default async function CmsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: pages, error } = await supabase
    .from('cms_pages')
    .select('id, slug, title, template, lang, published, updated_at, created_at')
    .is('deleted_at', null)
    .order('menu_order', { ascending: true })

  if (error) {
    return (
      <p className="text-sm text-red-400">Erreur lors du chargement des pages : {error.message}</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light text-white">Pages CMS</h1>
        <Link
          href="/manage/cms/new"
          className="rounded-sm bg-tt-accent px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
        >
          + Nouvelle page
        </Link>
      </div>

      <PagesList pages={pages ?? []} />
    </div>
  )
}
