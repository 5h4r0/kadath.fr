'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { createPage } from '@/app/actions/cms'

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // Utilise la propriété Unicode pour les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewCmsPage() {
  const params = useParams()
  const locale = (params.locale as string) ?? 'fr'
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [template, setTemplate] = useState('default')
  const [lang, setLang] = useState(locale === 'en' ? 'en' : 'fr')
  const [robots, setRobots] = useState('index,follow')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function handleSubmit() {
    if (!title.trim() || !slug.trim()) {
      setError('Titre et slug sont requis.')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await createPage({ title, slug, template, lang, robots, locale })
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-[#666666] hover:text-tt-accent"
        >
          ← Pages CMS
        </button>
        <h1 className="text-2xl font-light text-white">Nouvelle page</h1>
      </div>

      <div className="space-y-5">
        {/* Titre */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#666666]" htmlFor="title">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Ma nouvelle page"
            className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#666666]" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            placeholder="ma-nouvelle-page"
            className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 font-mono text-sm text-white focus:border-tt-accent focus:outline-hidden"
          />
        </div>

        {/* Template */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#666666]" htmlFor="template">
            Template
          </label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden"
          >
            <option value="default">default</option>
            <option value="landing">landing</option>
            <option value="contact">contact</option>
          </select>
        </div>

        {/* Langue */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#666666]" htmlFor="lang">
            Langue
          </label>
          <select
            id="lang"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden"
          >
            <option value="fr">fr</option>
            <option value="en">en</option>
          </select>
        </div>

        {/* Robots */}
        <div className="space-y-1.5">
          <label className="text-xs text-[#666666]" htmlFor="robots">
            Robots
          </label>
          <select
            id="robots"
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden"
          >
            <option value="index,follow">index, follow</option>
            <option value="noindex,nofollow">noindex, nofollow</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-sm bg-tt-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Création…' : 'Créer la page'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-sm border border-[#333333] px-4 py-2 text-sm text-[#cccccc] hover:border-[#555555]"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}
