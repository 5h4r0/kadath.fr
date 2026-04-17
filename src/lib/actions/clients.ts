'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface ClientPayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  siret: string
  address: string
  activity: string
  description: string
  notes: string
  source: string
  status: string
  locale: string
}

function toDb(payload: ClientPayload) {
  return {
    first_name: payload.first_name || null,
    last_name: payload.last_name || null,
    email: payload.email,
    phone: payload.phone || null,
    siret: payload.siret || null,
    address: payload.address || null,
    activity: payload.activity || null,
    description: payload.description || null,
    notes: payload.notes || null,
    source: payload.source || null,
    status: payload.status,
  }
}

export async function createClientAction(
  payload: ClientPayload,
): Promise<{ error: string } | undefined> {
  if (!payload.email.trim()) return { error: 'Email requis.' }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('clients').insert(toDb(payload))

  if (error) return { error: error.message }

  revalidatePath(`/${payload.locale}/clients`)
  redirect(`/${payload.locale}/clients`)
}

export async function updateClientAction(
  id: string,
  payload: ClientPayload,
): Promise<{ error: string } | undefined> {
  if (!payload.email.trim()) return { error: 'Email requis.' }

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('clients').update(toDb(payload)).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/${payload.locale}/clients`)
  revalidatePath(`/${payload.locale}/clients/${id}`)
  redirect(`/${payload.locale}/clients/${id}`)
}

export async function archiveClientAction(
  id: string,
  locale: string,
): Promise<{ error: string } | undefined> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/${locale}/clients`)
  redirect(`/${locale}/clients`)
}
