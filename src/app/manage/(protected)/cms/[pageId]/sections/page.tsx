import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SectionEditor } from './SectionEditor'

interface Props {
  params: Promise<{ pageId: string }>
}

export const dynamic = 'force-dynamic'

export default async function SectionsPage({ params }: Props) {
  const { pageId } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [pageResult, sectionsResult] = await Promise.all([
    supabase.from('cms_pages').select('id, slug, title').eq('id', pageId).single(),
    supabase
      .from('page_sections')
      .select('id, type, order_index, is_visible, content')
      .eq('page_id', pageId)
      .is('deleted_at', null)
      .order('order_index', { ascending: true }),
  ])

  if (pageResult.error || !pageResult.data) notFound()

  const page = pageResult.data
  const sections = sectionsResult.data ?? []

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link href="/manage/cms" className="text-sm text-[#666666] hover:text-tt-accent">
          ← Pages CMS
        </Link>
        <h1 className="text-2xl font-light text-white">{page.title}</h1>
        <p className="text-xs text-[#666666]">/{page.slug}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#666666]">
          Sections ({sections.length})
        </h2>

        {sections.length === 0 && (
          <p className="text-sm text-[#666666]">
            Aucune section. Exécuter{' '}
            <code className="font-mono text-[#aaaaaa]">seed-sections.sql</code> pour initialiser.
          </p>
        )}

        <div className="space-y-4">
          {sections.map((section) => (
            <SectionEditor key={section.id} section={section} />
          ))}
        </div>
      </section>
    </div>
  )
}
