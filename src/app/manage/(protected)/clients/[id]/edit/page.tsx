import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ClientForm } from '@/components/admin/ClientForm'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditClientPage({ params }: Props) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('clients')
    .select(
      'id, first_name, last_name, email, phone, siret, address, activity, description, notes, source, status',
    )
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-1">
        <a href={`/manage/clients/${id}`} className="text-sm text-[#666666] hover:text-tt-accent">
          ← Fiche client
        </a>
        <h1 className="text-2xl font-light text-white">Modifier le client</h1>
      </div>
      <ClientForm initial={data} />
    </div>
  )
}
