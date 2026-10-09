# Fix — Boucle redirect `/manage`

> Créé : 2026-05-04

## Problème

`src/app/manage/layout.tsx` contient un guard auth qui redirige vers `/manage`
si pas de session. Ce layout wrappant aussi `src/app/manage/page.tsx` (la page
login), la redirection boucle indéfiniment.

---

## Solution : route group `(protected)`

Déplacer toutes les routes protégées sous
`src/app/manage/(protected)/` avec son propre layout contenant le guard +
sidebar. La page login `src/app/manage/page.tsx` reste à la racine et n'est
plus wrappée par le guard.

---

## Structure cible

```
src/app/manage/
├── layout.tsx                        ← metadata uniquement, pas de guard
├── page.tsx                          ← login, inchangé
├── login/
│   └── route.ts                      ← inchangé
└── (protected)/
    ├── layout.tsx                    ← guard auth + sidebar (nouveau)
    ├── cms/
    │   ├── page.tsx
    │   ├── PagesList.tsx
    │   ├── new/
    │   │   └── page.tsx
    │   └── [pageId]/
    │       ├── edit/
    │       │   ├── page.tsx
    │       │   ├── PageMetaFields.tsx
    │       │   ├── DeleteButton.tsx
    │       │   ├── PublishButton.tsx
    │       │   ├── ResumeCmsField.tsx
    │       │   └── TipTapEditor.tsx
    │       └── sections/
    │           ├── page.tsx
    │           └── SectionEditor.tsx
    ├── clients/
    │   ├── page.tsx
    │   ├── new/
    │   │   └── page.tsx
    │   └── [id]/
    │       ├── page.tsx
    │       └── edit/
    │           └── page.tsx
    ├── projects/
    │   └── page.tsx
    └── invoices/
        └── page.tsx
```

---

## Opérations

### 1. Vider `src/app/manage/layout.tsx`

Retirer le guard auth et la sidebar — garder uniquement les metadata :

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ThinkTwice — Admin',
  robots: 'noindex, nofollow',
}

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

### 2. Créer `src/app/manage/(protected)/layout.tsx`

Déplacer ici le guard auth + sidebar (contenu actuel de
`src/app/manage/layout.tsx`) :

```ts
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/admin/LogoutButton'

const NAV = [
  { label: 'CMS',      href: '/manage/cms' },
  { label: 'Clients',  href: '/manage/clients' },
  { label: 'Projets',  href: '/manage/projects' },
  { label: 'Factures', href: '/manage/invoices' },
]

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

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
```

### 3. Déplacer les routes protégées

Déplacer les dossiers suivants de `src/app/manage/` vers
`src/app/manage/(protected)/` :

```bash
mv src/app/manage/cms        src/app/manage/(protected)/cms
mv src/app/manage/clients    src/app/manage/(protected)/clients
mv src/app/manage/projects   src/app/manage/(protected)/projects
mv src/app/manage/invoices   src/app/manage/(protected)/invoices
```

Les URLs `/manage/cms`, `/manage/clients`, etc. restent identiques — le route
group `(protected)` n'apparaît pas dans l'URL.

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/app/manage/page.tsx`, `src/app/manage/login/route.ts`,
  `src/proxy.ts`, ni `src/lib/supabase/server.ts`
- Ne pas installer de nouvelles dépendances
- Les URLs `/manage/cms`, `/manage/clients`, `/manage/projects`,
  `/manage/invoices` doivent rester identiques après la migration
