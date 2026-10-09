# Sprint — CMS : édition slug/titre/template + améliorations liste

> Créé : 2026-05-04

---

## Contexte

- `src/app/manage/cms/[pageId]/edit/page.tsx` — Server Component, affiche les
  champs en lecture seule + sous-composants Client
- `src/app/manage/cms/[pageId]/edit/ResumeCmsField.tsx` — pattern de référence :
  Client Component avec state local, save on blur, feedback "Sauvegardé ✓"
- `src/app/actions/cms.ts` — `updatePage(id, data)` accepte déjà `title`,
  `slug` dans son type `data`
- `src/app/manage/cms/page.tsx` — liste des pages, Server Component

---

## 1. Nouveau composant `PageMetaFields`

**Fichier à créer :** `src/app/manage/cms/[pageId]/edit/PageMetaFields.tsx`

Client Component gérant titre, slug et template en un seul composant.
Pattern identique à `ResumeCmsField` : state local, save on blur de chaque
champ, feedback inline.

Comportement slug :
- `slugTouched` : boolean, `false` par défaut
- Si `slugTouched === false`, chaque frappe dans le titre recalcule le slug
  via `slugify()` (même fonction que dans
  `src/app/[locale]/(admin)/cms/new/page.tsx`)
- Dès que l'utilisateur tape directement dans le champ slug :
  `setSlugTouched(true)` — le slug devient indépendant du titre
- Save on blur sur chaque champ : appel `updatePage(pageId, { title })`,
  `updatePage(pageId, { slug })`, `updatePage(pageId, { template })`
  séparément selon le champ qui a perdu le focus

```ts
'use client'

import { useState, useTransition } from 'react'
import { updatePage } from '@/app/actions/cms'

const TEMPLATES = ['default', 'landing', 'contact'] as const

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface Props {
  pageId: string
  initialTitle: string
  initialSlug: string
  initialTemplate: string
}

export function PageMetaFields({ pageId, initialTitle, initialSlug, initialTemplate }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [template, setTemplate] = useState(initialTemplate)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saved, setSaved] = useState<string | null>(null) // 'title' | 'slug' | 'template'
  const [isPending, startTransition] = useTransition()

  const INPUT_CLASS =
    'w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden'
  const LABEL_CLASS = 'text-xs text-[#666666]'

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
    setSaved(null)
  }

  function handleTitleBlur() {
    if (title === initialTitle) return
    startTransition(async () => {
      await updatePage(pageId, { title })
      setSaved('title')
    })
  }

  function handleSlugBlur() {
    if (slug === initialSlug) return
    startTransition(async () => {
      await updatePage(pageId, { slug })
      setSaved('slug')
    })
  }

  function handleTemplateBlur() {
    if (template === initialTemplate) return
    startTransition(async () => {
      await updatePage(pageId, { template })
      setSaved('template')
    })
  }

  return (
    <div className="space-y-4">
      {/* Titre */}
      <div className="space-y-1.5">
        <label className={LABEL_CLASS} htmlFor="page-title">Titre</label>
        <input
          id="page-title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleTitleBlur}
          className={INPUT_CLASS}
        />
        {saved === 'title' && !isPending && (
          <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className={LABEL_CLASS} htmlFor="page-slug">Slug</label>
        <input
          id="page-slug"
          type="text"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); setSaved(null) }}
          onBlur={handleSlugBlur}
          className={`${INPUT_CLASS} font-mono`}
        />
        {saved === 'slug' && !isPending && (
          <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>
        )}
      </div>

      {/* Template */}
      <div className="space-y-1.5">
        <label className={LABEL_CLASS} htmlFor="page-template">Template</label>
        <select
          id="page-template"
          value={template}
          onChange={(e) => { setTemplate(e.target.value); setSaved(null) }}
          onBlur={handleTemplateBlur}
          className={INPUT_CLASS}
        >
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {saved === 'template' && !isPending && (
          <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>
        )}
      </div>

      {isPending && <p className="text-xs text-[#666666]">Sauvegarde…</p>}
    </div>
  )
}
```

---

## 2. Mettre à jour `src/app/manage/cms/[pageId]/edit/page.tsx`

Remplacer l'affichage statique du titre, slug et template par `PageMetaFields`.

- Supprimer le `<h1>` hardcodé avec `{page.title}` et les spans
  `/{page.slug} · {page.template}` dans le header
- Ajouter une section **au-dessus** de la section Résumé :

```tsx
import { PageMetaFields } from './PageMetaFields'

{/* Méta */}
<section className="space-y-2">
  <h2 className="text-xs font-medium uppercase tracking-widest text-[#666666]">
    Informations
  </h2>
  <PageMetaFields
    pageId={pageId}
    initialTitle={page.title}
    initialSlug={page.slug}
    initialTemplate={page.template}
  />
</section>
```

- Conserver le lien "Voir la page ↗" dans le header en le construisant depuis
  `page.lang` et `page.slug` comme actuellement — il ne sera plus dynamique
  (reflect uniquement la valeur initiale au chargement), ce qui est acceptable

- Conserver le badge publié/brouillon dans le header

---

## 3. Corriger `src/app/manage/cms/[pageId]/edit/DeleteButton.tsx`

La prop `locale` a été supprimée lors de la migration mais le redirect
post-delete l'utilise encore. Corriger :

```ts
// Remplacer :
export function DeleteButton({ pageId, locale }: { pageId: string; locale: string })
// ...
router.push(`/${locale}/cms`)

// Par :
export function DeleteButton({ pageId }: { pageId: string })
// ...
router.push('/manage/cms')
```

Mettre à jour l'usage dans `src/app/manage/cms/[pageId]/edit/page.tsx` :
supprimer la prop `locale` passée à `<DeleteButton>`.

---

## 4. Ajouter `--color-tt-info` dans `src/app/globals.css`

Dans le bloc `:root` / thème ThinkTwice, ajouter après `--color-tt-accent` :

```css
--color-tt-info: #ff7f00;
```

Et dans le bloc `@theme inline` en tête de fichier (là où sont déclarés
`--color-tt-bg` et `--color-tt-accent`), ajouter :

```css
--color-tt-info: var(--color-tt-info);
```

---

## 5. Améliorer `src/app/manage/cms/page.tsx`

### 5a. Slug cliquable + couleur template

Dans la ligne de chaque page, modifier l'élément qui affiche
`/{page.slug} · {page.template}` :

```tsx
<p className="text-xs text-[#666666]">
  <a
    href={`/${page.lang ?? 'fr'}/${page.slug}`}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-tt-accent transition-colors"
  >
    /{page.slug}
  </a>
  {' · '}
  <span className="text-[color:var(--color-tt-info)]">{page.template}</span>
</p>
```

> Ajouter `lang` au select Supabase : `.select('id, slug, title, template, lang, published, updated_at')`

### 5b. Titre cliquable vers la vue d'édition

```tsx
// Remplacer :
<p className="text-sm font-medium text-white">{page.title}</p>

// Par :
<Link
  href={`/manage/cms/${page.id}/edit`}
  className="text-sm font-medium text-white hover:text-tt-accent transition-colors"
>
  {page.title}
</Link>
```

### 5c. Tri de la liste

Ajouter un state client pour le tri. Convertir la page en Client Component
**ou** créer un wrapper Client Component `PagesList` qui reçoit les pages
en props depuis le Server Component parent.

**Approche recommandée :** garder `src/app/manage/cms/page.tsx` comme Server
Component, extraire la liste dans un nouveau Client Component
`src/app/manage/cms/PagesList.tsx`.

**Fichier à créer :** `src/app/manage/cms/PagesList.tsx`

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

type SortKey = 'date' | 'title' | 'template'

interface Page {
  id: string
  slug: string
  title: string
  template: string
  lang: string | null
  published: boolean
  updated_at: string
}

interface Props {
  pages: Page[]
}

export function PagesList({ pages }: Props) {
  const [sort, setSort] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: SortKey) {
    if (sort === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(key)
      setSortDir('asc')
    }
  }

  const sorted = [...pages].sort((a, b) => {
    let cmp = 0
    if (sort === 'date') {
      cmp = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
    } else if (sort === 'title') {
      cmp = a.title.localeCompare(b.title, 'fr')
    } else if (sort === 'template') {
      cmp = a.template.localeCompare(b.template, 'fr')
    }
    return sortDir === 'asc' ? cmp : -cmp
  })

  function SortLink({ label, sortKey }: { label: string; sortKey: SortKey }) {
    const active = sort === sortKey
    const arrow = active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'
    return (
      <button
        type="button"
        onClick={() => handleSort(sortKey)}
        className={`text-xs transition-colors ${
          active ? 'text-tt-accent' : 'text-[#666666] hover:text-[#aaaaaa]'
        }`}
      >
        {label}{arrow}
      </button>
    )
  }

  return (
    <div className="space-y-2">
      {/* Contrôles de tri */}
      <div className="flex items-center gap-4 pb-1">
        <SortLink label="Date" sortKey="date" />
        <SortLink label="Titre A–Z" sortKey="title" />
        <SortLink label="Template" sortKey="template" />
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-[#666666]">Aucune page.</p>
      )}
      {sorted.map((page) => (
        <div
          key={page.id}
          className="flex items-center justify-between rounded-sm border border-[#333333] px-4 py-3"
        >
          <div className="space-y-0.5">
            <Link
              href={`/manage/cms/${page.id}/edit`}
              className="text-sm font-medium text-white hover:text-tt-accent transition-colors"
            >
              {page.title}
            </Link>
            <p className="text-xs text-[#666666]">
              <a
                href={`/${page.lang ?? 'fr'}/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-tt-accent transition-colors"
              >
                /{page.slug}
              </a>
              {' · '}
              <span className="text-[color:var(--color-tt-info)]">{page.template}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                page.published ? 'bg-[#1a3a2a] text-[#4caf82]' : 'bg-[#2a2a2a] text-[#aaaaaa]'
              }`}
            >
              {page.published ? 'publié' : 'brouillon'}
            </span>
            <Link
              href={`/manage/cms/${page.id}/edit`}
              className="text-sm text-[#666666] hover:text-tt-accent"
            >
              Éditer →
            </Link>
            <Link
              href={`/manage/cms/${page.id}/sections`}
              className="text-sm text-[#666666] hover:text-tt-accent"
            >
              Sections →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
```

Dans `src/app/manage/cms/page.tsx`, remplacer le rendu de la liste par :

```tsx
import { PagesList } from './PagesList'
// ...
<PagesList pages={pages ?? []} />
```

> Le select Supabase doit inclure `lang` et `updated_at` :
> `.select('id, slug, title, template, lang, published, updated_at')`

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/app/actions/cms.ts` (déjà compatible)
- Ne pas modifier `src/proxy.ts` ni `src/lib/supabase/server.ts`
- Ne pas installer de nouvelles dépendances
