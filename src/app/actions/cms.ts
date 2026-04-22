'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPage(data: {
  title: string
  slug: string
  template: string
  lang: string
  robots: string
  locale: string
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: page, error } = await supabase
    .from('cms_pages')
    .insert({
      title: data.title,
      slug: data.slug,
      template: data.template,
      lang: data.lang,
      robots: data.robots,
      author_id: user?.id ?? null,
      published: false,
      sections: [],
      galerie: [],
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath('/[locale]/(admin)/cms', 'page')
  redirect(`/${data.locale}/cms/${page.id}/edit`)
}

export async function updatePage(
  id: string,
  data: {
    title?: string
    slug?: string
    sections?: unknown
    published?: boolean
    robots?: string
    resume?: string
  },
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('cms_pages').update(data).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/[locale]/(admin)/cms', 'page')
  return { error: null }
}

export async function deletePage(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('cms_pages')
    .update({ deleted_at: new Date().toISOString(), published: false })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/[locale]/(admin)/cms', 'page')
  return { error: null }
}
