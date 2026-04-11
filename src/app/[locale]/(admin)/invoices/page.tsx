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

export default async function InvoicesPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select(
      'id, number, status, amount_ht, tva_rate, issued_at, due_at, project_id, projects(title, client_id, clients(first_name, last_name))',
    )
    .is('deleted_at', null)
    .order('issued_at', { ascending: false })

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Erreur lors du chargement des factures : {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Factures</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N°</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Projet</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Montant TTC</TableHead>
            <TableHead>Échéance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-[#666666]">
                Aucune facture
              </TableCell>
            </TableRow>
          )}
          {invoices?.map((invoice) => {
            const project = Array.isArray(invoice.projects) ? invoice.projects[0] : invoice.projects
            const client = project
              ? Array.isArray(project.clients)
                ? project.clients[0]
                : project.clients
              : null
            const clientName = client
              ? [client.first_name, client.last_name].filter(Boolean).join(' ')
              : '—'
            const ttc = Number(invoice.amount_ht) * (1 + Number(invoice.tva_rate) / 100)
            return (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-white">{invoice.number}</TableCell>
                <TableCell className="text-[#cccccc]">{clientName}</TableCell>
                <TableCell className="text-[#cccccc]">{project?.title ?? '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right text-white">
                  {ttc.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </TableCell>
                <TableCell className="text-[#999999]">
                  {invoice.due_at ? new Date(invoice.due_at).toLocaleDateString('fr-FR') : '—'}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-[#2a2a2a] text-[#aaaaaa]',
  sent: 'bg-[#1a2a3a] text-[#4a9fcf]',
  partial: 'bg-[#2a2010] text-[#c89030]',
  paid: 'bg-[#1a3a2a] text-[#4caf82]',
  overdue: 'bg-[#3a1a1a] text-[#cf4a4a]',
  cancelled: 'bg-[#1a1a1a] text-[#555555]',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-[#2a2a2a] text-[#aaaaaa]'}`}
    >
      {status}
    </span>
  )
}
