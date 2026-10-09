import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteButton } from './DeleteButton'
import { PageMetaFields } from './PageMetaFields'
import { PublishButton } from './PublishButton'
import { ResumeCmsField } from './ResumeCmsField'
import { TipTapEditor } from './TipTapEditor'

interface Props {
  params: Promise<{ pageId: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditCmsPage({ params }: Props) {
  const { pageId } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('id, slug, title, template, lang, robots, resume, sections, published, updated_at')
    .eq('id', pageId)
    .is('deleted_at', null)
    .single()

  if (error || !page) notFound()

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href="/manage/cms" className="text-sm text-[#666666] hover:text-tt-accent">
            ← Pages CMS
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#666666]">{page.lang}</span>
            <a
              href={`/${page.lang}/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#666666] hover:text-tt-accent"
            >
              Voir la page ↗
            </a>
          </div>
        </div>
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            page.published ? 'bg-[#1a3a2a] text-[#4caf82]' : 'bg-[#2a2a2a] text-[#aaaaaa]'
          }`}
        >
          {page.published ? 'publié' : 'brouillon'}
        </span>
      </div>

      {/* Informations */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#666666]">
          Informations
        </h2>
        <PageMetaFields
          pageId={pageId}
          initialTitle={page.title}
          initialSlug={page.slug}
          initialTemplate={page.template}
        />
      </section>

      {/* Résumé */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#666666]">Résumé</h2>
        <ResumeCmsField pageId={pageId} initialValue={page.resume ?? ''} />
      </section>

      {/* Éditeur de contenu */}
      <section className="space-y-2">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[#666666]">Contenu</h2>
        <TipTapEditor pageId={pageId} initialContent={page.sections} />
      </section>

      {/* Actions */}
      <section className="flex items-center gap-3 border-t border-[#333333] pt-6">
        <PublishButton pageId={pageId} published={page.published} />
        <DeleteButton pageId={pageId} />
      </section>
    </div>
  )
}
