'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function addFooterLink(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const cms_page_id = formData.get('cms_page_id') as string
  const zone = formData.get('zone') as string
  const order_index = parseInt(formData.get('order_index') as string, 10) || 0

  await supabase.from('footer_legal_links').insert({ cms_page_id, zone, order_index })

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout')
}

export async function removeFooterLink(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.from('footer_legal_links').delete().eq('id', id)

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout')
}

export async function updateFooterLinkOrder(id: string, order_index: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.from('footer_legal_links').update({ order_index }).eq('id', id)

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout')
}
