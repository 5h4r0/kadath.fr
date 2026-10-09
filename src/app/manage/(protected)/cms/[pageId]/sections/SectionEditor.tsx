'use client'

import { useState, useTransition } from 'react'
import { toggleSectionVisibility, updateSection } from '@/app/actions/sections'

interface Section {
  id: string
  type: string
  order_index: number
  is_visible: boolean
  content: Record<string, unknown>
}

export function SectionEditor({ section }: { section: Section }) {
  const [json, setJson] = useState(JSON.stringify(section.content, null, 2))
  const [isVisible, setIsVisible] = useState<boolean>(section.is_visible)
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(json) as Record<string, unknown>
      setJsonError(null)
    } catch {
      setJsonError('JSON invalide')
      return
    }

    setSaved(false)
    setSaveError(null)
    startTransition(async () => {
      const result = await updateSection(section.id, parsed)
      if (result.error) {
        setSaveError(result.error)
      } else {
        setSaved(true)
      }
    })
  }

  function handleToggle() {
    startTransition(async () => {
      await toggleSectionVisibility(section.id, !isVisible)
      setIsVisible((v: boolean) => !v)
    })
  }

  return (
    <div className="space-y-3 rounded-sm border border-[#333333] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#888888]">#{section.order_index}</span>
          <span className="text-sm font-medium text-white">{section.type}</span>
          <span
            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
              isVisible ? 'bg-[#1a3a2a] text-[#4caf82]' : 'bg-[#2a2a2a] text-[#666666]'
            }`}
          >
            {isVisible ? 'visible' : 'masqué'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="text-xs text-[#666666] hover:text-[#cccccc] disabled:opacity-50"
        >
          {isVisible ? 'Masquer' : 'Afficher'}
        </button>
      </div>

      <textarea
        value={json}
        onChange={(e) => {
          setJson(e.target.value)
          setSaved(false)
          setJsonError(null)
        }}
        rows={Math.min(20, json.split('\n').length + 2)}
        className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 font-mono text-xs text-[#cccccc] focus:border-tt-accent focus:outline-hidden"
        spellCheck={false}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-sm bg-tt-accent px-3 py-1.5 text-xs font-medium text-black hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>
        {jsonError && <span className="text-xs text-red-400">{jsonError}</span>}
        {saveError && <span className="text-xs text-red-400">{saveError}</span>}
        {saved && <span className="text-xs text-[#4caf82]">Sauvegardé ✓</span>}
      </div>
    </div>
  )
}
