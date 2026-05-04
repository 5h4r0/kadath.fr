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
  const [saved, setSaved] = useState<string | null>(null)
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
        <label className={LABEL_CLASS} htmlFor="page-title">
          Titre
        </label>
        <input
          id="page-title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleTitleBlur}
          className={INPUT_CLASS}
        />
        {saved === 'title' && !isPending && <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <label className={LABEL_CLASS} htmlFor="page-slug">
          Slug
        </label>
        <input
          id="page-slug"
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setSlugTouched(true)
            setSaved(null)
          }}
          onBlur={handleSlugBlur}
          className={`${INPUT_CLASS} font-mono`}
        />
        {saved === 'slug' && !isPending && <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>}
      </div>

      {/* Template */}
      <div className="space-y-1.5">
        <label className={LABEL_CLASS} htmlFor="page-template">
          Template
        </label>
        <select
          id="page-template"
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value)
            setSaved(null)
          }}
          onBlur={handleTemplateBlur}
          className={INPUT_CLASS}
        >
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
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
