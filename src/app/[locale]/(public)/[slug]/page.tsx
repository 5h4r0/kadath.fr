import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { tiptapToHtml } from '@/lib/tiptap/tiptapToHtml'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export const revalidate = 60

export default async function CmsPublicPage({ params }: Props) {
  const { slug } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: page, error } = await supabase
    .from('cms_pages')
    .select('id, title, resume, sections, robots, published')
    .eq('slug', slug)
    .eq('published', true)
    .is('deleted_at', null)
    .single()

  if (error || !page) notFound()

  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-6 text-3xl font-light text-white">{page.title}</h1>
        {page.resume && <p className="mb-10 text-lg font-light text-[#aaaaaa]">{page.resume}</p>}
        {page.sections && typeof page.sections === 'object' && (
          <div
            className="prose prose-invert prose-sm max-w-none"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu TipTap sanitisé à l'insertion
            dangerouslySetInnerHTML={{ __html: tiptapToHtml(page.sections) }}
          />
        )}
      </div>
    </main>
  )
}
