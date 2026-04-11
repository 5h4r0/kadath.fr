import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CmsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: pages, error } = await supabase
    .from('cms_pages')
    .select('id, slug, title, template, published, updated_at')
    .order('menu_order', { ascending: true })

  if (error) {
    return (
      <p className="text-sm text-red-400">Erreur lors du chargement des pages : {error.message}</p>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Pages CMS</h1>

      <div className="space-y-2">
        {pages?.length === 0 && <p className="text-sm text-[#666666]">Aucune page.</p>}
        {pages?.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between rounded border border-[#333333] px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-white">{page.title}</p>
              <p className="text-xs text-[#666666]">
                /{page.slug} · {page.template}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                  page.published ? 'bg-[#1a3a2a] text-[#4caf82]' : 'bg-[#2a2a2a] text-[#aaaaaa]'
                }`}
              >
                {page.published ? 'publié' : 'brouillon'}
              </span>
              <Link
                href={`/${locale}/cms/${page.id}/sections`}
                className="text-sm text-[#666666] hover:text-tt-accent"
              >
                Sections →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
