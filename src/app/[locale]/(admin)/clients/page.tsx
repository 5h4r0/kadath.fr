import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, first_name, last_name, email, status, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Erreur lors du chargement des clients : {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Clients</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créé le</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-[#666666]">
                Aucun client
              </TableCell>
            </TableRow>
          )}
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="text-white">
                {[client.first_name, client.last_name].filter(Boolean).join(' ') || '—'}
              </TableCell>
              <TableCell className="text-[#cccccc]">{client.email}</TableCell>
              <TableCell>
                <StatusBadge status={client.status} />
              </TableCell>
              <TableCell className="text-[#999999]">
                {new Date(client.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  prospect: 'bg-[#2a2a2a] text-[#aaaaaa]',
  active: 'bg-[#1a3a2a] text-[#4caf82]',
  inactive: 'bg-[#2a2a2a] text-[#666666]',
  archived: 'bg-[#1a1a1a] text-[#555555]',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.inactive}`}
    >
      {status}
    </span>
  )
}
