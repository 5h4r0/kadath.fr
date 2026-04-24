import type { Metadata } from 'next'
import Link from 'next/link'
import { LogoutButton } from '@/components/admin/LogoutButton'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const NAV = [
    { label: 'CMS', href: `/${locale}/cms` },
    { label: 'Clients', href: `/${locale}/clients` },
    { label: 'Projets', href: `/${locale}/projects` },
    { label: 'Factures', href: `/${locale}/invoices` },
  ]

  return (
    <div className="flex min-h-screen bg-tt-bg font-grotesk text-white">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col justify-between border-r border-[#333333] px-4 py-8">
        <div>
          <span className="mb-8 px-2 text-xs font-medium uppercase tracking-widest text-[#666666]">
            Backoffice
          </span>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-sm px-2 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#2a2a2a] hover:text-tt-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="pb-2">
          <LogoutButton locale={locale} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  )
}
