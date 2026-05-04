import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/admin/LogoutButton'
import { createClient } from '@/lib/supabase/server'

const NAV = [
  { label: 'CMS', href: '/manage/cms' },
  { label: 'Clients', href: '/manage/clients' },
  { label: 'Projets', href: '/manage/projects' },
  { label: 'Factures', href: '/manage/invoices' },
]

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/manage')

  return (
    <div className="flex min-h-screen bg-tt-bg font-grotesk text-white">
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
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  )
}
