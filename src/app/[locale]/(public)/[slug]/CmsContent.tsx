'use client'

import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { useMemo } from 'react'

interface Props {
  sections: object
}

export function CmsContent({ sections }: Props) {
  const html = useMemo(
    () => generateHTML(sections as Parameters<typeof generateHTML>[0], [StarterKit]),
    [sections],
  )

  return (
    <div
      className="prose prose-invert prose-sm max-w-none"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: contenu TipTap sanitisé à l'insertion
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
