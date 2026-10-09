'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function updateSection(id: string, content: Record<string, unknown>) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('page_sections')
    .update({ content })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) return { error: error.message }

  revalidatePath('/manage/cms', 'page')
  revalidatePath('/', 'layout')
  return { error: null }
}

export async function toggleSectionVisibility(id: string, visible: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('page_sections')
    .update({ is_visible: visible })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) return { error: error.message }

  revalidatePath('/manage/cms', 'page')
  revalidatePath('/', 'layout')
  return { error: null }
}
