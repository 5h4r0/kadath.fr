import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: Props) {
  const { locale, id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Client + projects en parallèle
  const [clientResult, projectsResult] = await Promise.all([
    supabase
      .from('clients')
      .select(
        'id, first_name, last_name, email, phone, siret, address, activity, description, notes, source, status, created_at',
      )
      .eq('id', id)
      .single(),
    supabase
      .from('projects')
      .select('id, name, status, created_at')
      .eq('client_id', id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false }),
  ])

  if (clientResult.error || !clientResult.data) notFound()

  const client = clientResult.data
  const projects = projectsResult.data ?? []

  // Factures via project_id (invoices n'ont pas de client_id direct)
  const projectIds = projects.map((p) => p.id)
  const { data: invoices } =
    projectIds.length > 0
      ? await supabase
          .from('invoices')
          .select('id, number, status, amount_ht, tva_rate, due_at, issued_at')
          .in('project_id', projectIds)
          .is('deleted_at', null)
          .order('issued_at', { ascending: false })
      : { data: [] }

  const fullName = [client.first_name, client.last_name].filter(Boolean).join(' ') || client.email

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href={`/${locale}/clients`} className="text-sm text-[#666666] hover:text-tt-accent">
            ← Clients
          </Link>
          <h1 className="text-2xl font-light text-white">{fullName}</h1>
        </div>
        <StatusBadge status={client.status} />
      </div>

      {/* Informations */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#666666]">
          Informations
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <InfoRow label="Email" value={client.email} />
          <InfoRow label="Téléphone" value={client.phone} />
          <InfoRow label="SIRET" value={client.siret} />
          <InfoRow label="Adresse" value={client.address} />
          <InfoRow label="Activité" value={client.activity} />
          <InfoRow label="Source" value={client.source} />
          <InfoRow
            label="Créé le"
            value={new Date(client.created_at).toLocaleDateString('fr-FR')}
          />
        </dl>
        {client.notes && (
          <div className="mt-4 rounded-sm border border-[#333333] p-4">
            <p className="text-xs font-medium uppercase tracking-widest text-[#666666]">Notes</p>
            <p className="mt-2 text-sm text-[#cccccc]">{client.notes}</p>
          </div>
        )}
      </section>

      {/* Projets */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#666666]">
          Projets ({projects.length})
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-[#666666]">
                  Aucun projet
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="text-white">{project.name}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-[#999999]">
                  {new Date(project.created_at).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Factures */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium uppercase tracking-widest text-[#666666]">
          Factures ({invoices?.length ?? 0})
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Montant TTC</TableHead>
              <TableHead>Échéance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(!invoices || invoices.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-[#666666]">
                  Aucune facture
                </TableCell>
              </TableRow>
            )}
            {invoices?.map((invoice) => {
              const ttc = Number(invoice.amount_ht) * (1 + Number(invoice.tva_rate) / 100)
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-white">{invoice.number}</TableCell>
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
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-[#666666]">{label}</dt>
      <dd className="text-sm text-[#cccccc]">{value || '—'}</dd>
    </div>
  )
}

const STATUS_STYLES: Record<string, string> = {
  // clients
  prospect: 'bg-[#2a2a2a] text-[#aaaaaa]',
  active: 'bg-[#1a3a2a] text-[#4caf82]',
  inactive: 'bg-[#2a2a2a] text-[#666666]',
  archived: 'bg-[#1a1a1a] text-[#555555]',
  // projects
  draft: 'bg-[#2a2a2a] text-[#aaaaaa]',
  on_hold: 'bg-[#2a2010] text-[#c89030]',
  completed: 'bg-[#1a3a2a] text-[#4caf82]',
  cancelled: 'bg-[#1a1a1a] text-[#555555]',
  // invoices
  sent: 'bg-[#1a2a3a] text-[#4a9fcf]',
  partial: 'bg-[#2a2010] text-[#c89030]',
  paid: 'bg-[#1a3a2a] text-[#4caf82]',
  overdue: 'bg-[#3a1a1a] text-[#cf4a4a]',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-[#2a2a2a] text-[#aaaaaa]'}`}
    >
      {status}
    </span>
  )
}
