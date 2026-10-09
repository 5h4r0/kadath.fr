import { ClientForm } from '@/components/admin/ClientForm'

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-1">
        <a href="/manage/clients" className="text-sm text-[#666666] hover:text-tt-accent">
          ← Clients
        </a>
        <h1 className="text-2xl font-light text-white">Nouveau client</h1>
      </div>
      <ClientForm />
    </div>
  )
}
