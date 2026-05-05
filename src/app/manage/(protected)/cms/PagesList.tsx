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
  created_at: string
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
        className={`cursor-pointer text-xs transition-colors ${
          active ? 'text-tt-accent' : 'text-[#666666] hover:text-[#aaaaaa]'
        }`}
      >
        {label}
        {arrow}
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

      {sorted.length === 0 && <p className="text-sm text-[#666666]">Aucune page.</p>}
      {sorted.map((page) => (
        <div
          key={page.id}
          className="flex items-center justify-between rounded-sm border border-[#333333] px-4 py-3"
        >
          <div className="space-y-0.5">
            <Link
              href={`/manage/cms/${page.id}/edit`}
              className="text-sm font-medium text-white transition-colors hover:text-tt-accentrounded-sm px-2 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#2a2a2a] hover:text-tt-accent"
            >
              {page.title}
            </Link>
            <p className="text-xs text-[#666666]">
              <a
                href={`/${page.lang ?? 'fr'}/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-tt-accent"
              >
                /{page.slug}
              </a>
              {' · '}
              <span className="text-tt-info">{page.template}</span>
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
            <div className="flex gap-0.5 px-4 text-xs">
              <span className="px-2 py-0.5 font-light text-white">
                {new Date(page.updated_at).toLocaleDateString('fr-FR')}
              </span>
              <span className="px-2 py-0.5 font-light text-[#666666]">
                {new Date(page.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <Link
              href={`/manage/cms/${page.id}/edit`}
              className="rounded-sm px-2 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#2a2a2a] hover:text-tt-accent"
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
