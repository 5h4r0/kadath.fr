import { cookies } from 'next/headers'
import { FooterLinksEditor } from '@/components/manage/FooterLinksEditor'
import { createClient } from '@/lib/supabase/server'

export default async function FooterLinksPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [{ data: links }, { data: pages }] = await Promise.all([
    supabase
      .from('footer_legal_links')
      .select('id, zone, order_index, cms_pages(slug, title)')
      .order('zone')
      .order('order_index'),
    supabase.from('cms_pages').select('id, slug, title').order('title'),
  ])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-white">Footer — liens</h1>
      <FooterLinksEditor links={links ?? []} pages={pages ?? []} />
    </div>
  )
}
