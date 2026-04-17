import { ClientForm } from '@/components/admin/ClientForm'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function NewClientPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-1">
        <a href={`/${locale}/clients`} className="text-sm text-[#666666] hover:text-tt-accent">
          ← Clients
        </a>
        <h1 className="text-2xl font-light text-white">Nouveau client</h1>
      </div>
      <ClientForm locale={locale} />
    </div>
  )
}
