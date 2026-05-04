'use client'

import { useState, useTransition } from 'react'
import { updatePage } from '@/app/actions/cms'

interface Props {
  pageId: string
  initialValue: string
}

export function ResumeCmsField({ pageId, initialValue }: Props) {
  const [value, setValue] = useState(initialValue)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleBlur() {
    if (value === initialValue) return
    setSaved(false)
    startTransition(async () => {
      await updatePage(pageId, { resume: value })
      setSaved(true)
    })
  }

  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setSaved(false)
        }}
        onBlur={handleBlur}
        rows={3}
        placeholder="Résumé court affiché dans les méta et les listings…"
        className="w-full rounded-sm border border-[#333333] bg-[#111111] px-3 py-2 text-sm text-white focus:border-tt-accent focus:outline-hidden"
      />
      {isPending && <p className="text-xs text-[#666666]">Sauvegarde…</p>}
      {saved && !isPending && <p className="text-xs text-[#4caf82]">Sauvegardé ✓</p>}
    </div>
  )
}
