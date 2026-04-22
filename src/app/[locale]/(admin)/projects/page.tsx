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

export default async function ProjectsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, status, start_date, end_date, client_id, clients(first_name, last_name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <p className="text-sm text-red-400">
        Erreur lors du chargement des projets : {error.message}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-light text-white">Projets</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-[#666666]">
                Aucun projet
              </TableCell>
            </TableRow>
          )}
          {projects?.map((project) => {
            const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
            const clientName = client
              ? [client.first_name, client.last_name].filter(Boolean).join(' ')
              : '—'
            return (
              <TableRow key={project.id}>
                <TableCell className="text-white">{project.title}</TableCell>
                <TableCell className="text-[#cccccc]">{clientName}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-[#999999]">
                  {project.start_date
                    ? new Date(project.start_date).toLocaleDateString('fr-FR')
                    : '—'}
                </TableCell>
                <TableCell className="text-[#999999]">
                  {project.end_date ? new Date(project.end_date).toLocaleDateString('fr-FR') : '—'}
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
  active: 'bg-[#1a3a2a] text-[#4caf82]',
  on_hold: 'bg-[#2a2010] text-[#c89030]',
  completed: 'bg-[#1a3a2a] text-[#4caf82]',
  cancelled: 'bg-[#1a1a1a] text-[#555555]',
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
