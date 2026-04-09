import { HOMEPAGE_FALLBACK } from '@/lib/homepage-fallback'
import { createClient } from '@/lib/supabase/server'
import type { PageSection } from '@/types/page-sections'
import { cookies } from 'next/headers'

export async function fetchHomepageSections(): Promise<PageSection[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    // .single() throw PGRST116 si 0 ou >1 lignes — catchée ci-dessous → fallback
    const { data, error } = await supabase
      .from('cms_pages')
      .select('id, page_sections(id, page_id, type, order_index, is_visible, content)')
      .eq('slug', 'homepage')
      .single()

    if (error || !data?.page_sections?.length) {
      return HOMEPAGE_FALLBACK
    }

    // Cast manuel : le contenu JSONB n'est pas encore validé par les types générés Supabase.
    // À remplacer par une validation Zod lors de l'implémentation du CMS admin.
    return (data.page_sections as PageSection[]).sort((a, b) => a.order_index - b.order_index)
  } catch (err) {
    // Supabase injoignable OU PGRST116 (pas de row 'homepage') → fallback statique
    console.error('[fetchHomepageSections] fallback activé:', err)
    return HOMEPAGE_FALLBACK
  }
}
