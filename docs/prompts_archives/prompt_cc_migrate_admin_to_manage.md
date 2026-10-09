# Sprint — Migration `(admin)` → `src/app/manage/`

> Créé : 2026-05-04

## Objectif

Supprimer `src/app/[locale]/(admin)/` et migrer toutes ses routes sous
`src/app/manage/`, sans `[locale]`. Le backoffice est accessible uniquement
sur `manage.kadath.fr` — pas de i18n côté admin.

---

## Contexte technique

- Client Supabase server-side : `@/lib/supabase/server` — c'est l'import
  correct, **ne pas le modifier**
- `src/proxy.ts` est le middleware Next.js (next-intl + guards) — **ne pas
  le modifier**
- `src/app/manage/layout.tsx` existe déjà (layout vide avec metadata)
- `src/app/manage/page.tsx` existe déjà (login/redirect, fonctionnel)
- `src/app/manage/login/route.ts` existe déjà (POST auth, fonctionnel)
- `src/app/manage/cms/page.tsx` existe déjà mais est un **stub** — à remplacer
- Les Server Actions dans `src/app/actions/cms.ts`, `src/app/actions/sections.ts`
  et `src/lib/actions/clients.ts` utilisent des chemins avec `locale` dans
  `revalidatePath` et `redirect` — à corriger

---

## Structure cible

```
src/app/manage/
├── layout.tsx              ← enrichir (sidebar + guard auth)
├── page.tsx                ← existant, ne pas toucher
├── login/
│   └── route.ts            ← existant, ne pas toucher
├── cms/
│   ├── page.tsx            ← remplacer le stub
│   ├── new/
│   │   └── page.tsx        ← nouveau
│   └── [pageId]/
│       ├── edit/
│       │   ├── page.tsx
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

## 1. Enrichir `src/app/manage/layout.tsx`

Remplacer le layout vide par le layout sidebar complet. Guard auth inclus :
vérifier `getUser()`, si pas de session → `redirect('/manage')`.

```ts
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/admin/LogoutButton'

export const metadata: Metadata = {
  title: 'ThinkTwice — Admin',
  robots: 'noindex, nofollow',
}

const NAV = [
  { label: 'CMS',      href: '/manage/cms' },
  { label: 'Clients',  href: '/manage/clients' },
  { label: 'Projets',  href: '/manage/projects' },
  { label: 'Factures', href: '/manage/invoices' },
]

export default async function ManageLayout({ children }: { children: React.ReactNode }) {
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

> Le guard dans `src/app/manage/layout.tsx` protège toutes les sous-routes —
> inutile de répéter `getUser()` dans chaque page de la section manage.
> Exception : `src/app/manage/page.tsx` gère lui-même son redirect (loggé →
> `/manage/cms`) — ne pas le modifier.

---

## 2. Migrer les routes CMS

### `src/app/manage/cms/page.tsx` (remplacer le stub)

Copier le contenu de `src/app/[locale]/(admin)/cms/page.tsx` avec :
- Supprimer `{ params }` et `const { locale } = await params`
- Remplacer tous les `href={`/${locale}/cms/...`}` par `href="/manage/cms/..."`
- Conserver `export const dynamic = 'force-dynamic'`

### `src/app/manage/cms/new/page.tsx`

Copier `src/app/[locale]/(admin)/cms/new/page.tsx` avec :
- Supprimer la lecture de `locale` via `useParams()` — utiliser `'fr'` comme
  valeur fixe pour le champ `lang` par défaut
- Remplacer tous les liens et `router.back()` vers `/${locale}/cms` par
  `/manage/cms`
- L'action `createPage` reçoit `locale` dans ses data — passer `'fr'` en dur
  (la redirection post-création sera corrigée dans l'action, section 5)

### `src/app/manage/cms/[pageId]/edit/page.tsx`

Copier `src/app/[locale]/(admin)/cms/[pageId]/edit/page.tsx` avec :
- Supprimer `locale` des params (garder uniquement `pageId`)
- Lien retour : `/manage/cms`
- Lien "Voir la page" : `/${page.lang}/${page.slug}` — utiliser `page.lang`
  pour construire l'URL vitrine (seul endroit où la locale reste pertinente)
- Importer `DeleteButton`, `PublishButton`, `ResumeCmsField`, `TipTapEditor`
  depuis le même dossier (les copier aussi, voir ci-dessous)

### `src/app/manage/cms/[pageId]/edit/DeleteButton.tsx`
### `src/app/manage/cms/[pageId]/edit/PublishButton.tsx`
### `src/app/manage/cms/[pageId]/edit/ResumeCmsField.tsx`
### `src/app/manage/cms/[pageId]/edit/TipTapEditor.tsx`

Copier depuis `src/app/[locale]/(admin)/cms/[pageId]/edit/` avec :
- Dans `src/app/manage/cms/[pageId]/edit/DeleteButton.tsx` : remplacer le
  redirect post-delete par `/manage/cms`
- Les autres fichiers n'ont probablement pas de références locale — vérifier
  et corriger si présent

### `src/app/manage/cms/[pageId]/sections/page.tsx`

Copier `src/app/[locale]/(admin)/cms/[pageId]/sections/page.tsx` avec :
- Supprimer `locale` des params (garder `pageId`)
- Lien retour : `/manage/cms`

### `src/app/manage/cms/[pageId]/sections/SectionEditor.tsx`

Copier `src/app/[locale]/(admin)/cms/[pageId]/sections/SectionEditor.tsx`
sans modification (vérifier l'absence de référence locale).

---

## 3. Migrer les routes Clients

### `src/app/manage/clients/page.tsx`

Copier `src/app/[locale]/(admin)/clients/page.tsx` avec :
- Supprimer `{ params }` et `const { locale } = await params`
- Remplacer `href={`/${locale}/clients/...`}` par `href="/manage/clients/..."`

### `src/app/manage/clients/new/page.tsx`

Copier `src/app/[locale]/(admin)/clients/new/page.tsx` avec :
- Supprimer `{ params }` et lecture locale
- Passer `locale="fr"` à `ClientForm` (prop requise, voir section 6)
- Lien retour : `/manage/clients`

### `src/app/manage/clients/[id]/page.tsx`

Copier `src/app/[locale]/(admin)/clients/[id]/page.tsx` avec :
- Supprimer `locale` des params (garder `id`)
- Tous les liens avec `locale` → `/manage/...`

### `src/app/manage/clients/[id]/edit/page.tsx`

Copier `src/app/[locale]/(admin)/clients/[id]/edit/page.tsx` avec :
- Supprimer `locale` des params
- Lien retour : `/manage/clients/${id}`
- Passer `locale="fr"` à `ClientForm`

---

## 4. Migrer Projets et Factures

### `src/app/manage/projects/page.tsx`

Copier `src/app/[locale]/(admin)/projects/page.tsx` — pas de locale dans ce
fichier, copie directe.

### `src/app/manage/invoices/page.tsx`

Copier `src/app/[locale]/(admin)/invoices/page.tsx` — pas de locale dans ce
fichier, copie directe.

---

## 5. Corriger les Server Actions

### `src/app/actions/cms.ts`

- `createPage` : remplacer `redirect(`/${data.locale}/cms/${page.id}/edit`)`
  par `redirect(`/manage/cms/${page.id}/edit`)` — supprimer `locale` du type
  `data` si plus utilisé ailleurs dans la fonction
- `revalidatePath('/[locale]/(admin)/cms', 'page')` →
  `revalidatePath('/manage/cms', 'page')` (dans les 3 fonctions : `createPage`,
  `updatePage`, `deletePage`)

### `src/app/actions/sections.ts`

- `revalidatePath('/[locale]/(admin)/cms', 'page')` →
  `revalidatePath('/manage/cms', 'page')`
- `revalidatePath('/[locale]/(public)', 'layout')` →
  `revalidatePath('/', 'layout')`

### `src/lib/actions/clients.ts`

Ce fichier utilise `locale` du payload pour `revalidatePath` et `redirect`.
Supprimer `locale` de l'interface `ClientPayload` et remplacer par des
chemins fixes :

- `revalidatePath(`/${payload.locale}/clients`)` →
  `revalidatePath('/manage/clients')`
- `redirect(`/${payload.locale}/clients`)` →
  `redirect('/manage/clients')`
- `revalidatePath(`/${payload.locale}/clients/${id}`)` →
  `revalidatePath(`/manage/clients/${id}`)`
- `redirect(`/${payload.locale}/clients/${id}`)` →
  `redirect(`/manage/clients/${id}`)`
- Changer la signature de `archiveClientAction(id, locale)` en
  `archiveClientAction(id)` — supprimer `locale` du paramètre et remplacer :
  `revalidatePath(`/${locale}/clients`)` → `revalidatePath('/manage/clients')`
  `redirect(`/${locale}/clients`)` → `redirect('/manage/clients')`

---

## 6. Adapter `src/components/admin/ClientForm.tsx`

Après suppression de `locale` des actions clients :
- Supprimer `locale` de `buildPayload()` (retirer la ligne `locale,`)
- Changer `archiveClientAction(initial.id, locale)` en
  `archiveClientAction(initial.id)`
- Supprimer la prop `locale` de `ClientFormProps` si elle ne sert plus qu'à
  ces deux usages — vérifier qu'elle n'est pas utilisée ailleurs dans le
  composant avant de la supprimer

---

## 7. Supprimer `src/app/[locale]/(admin)/`

Une fois toutes les routes migrées et le type-check vert :
```bash
rm -rf "src/app/[locale]/(admin)/"
```

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/app/manage/page.tsx`, `src/app/manage/login/route.ts`,
  `src/proxy.ts`, ni `src/lib/supabase/server.ts`
- Ne pas installer de nouvelles dépendances
- Pas de `[locale]` dans les routes manage — les liens internes au backoffice
  utilisent des chemins absolus `/manage/...`
