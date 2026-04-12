'use client'

import { updatePage } from '@/app/actions/cms'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

interface Props {
  pageId: string
  initialContent: unknown
}

export function TipTapEditor({ pageId, initialContent }: Props) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const editor = useEditor({
    extensions: [StarterKit],
    content: (initialContent as object | undefined) ?? '',
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] px-4 py-3 text-white text-sm leading-relaxed focus:outline-none prose prose-invert prose-sm max-w-none',
      },
    },
    onBlur({ editor: e }) {
      setSaveStatus('saving')
      updatePage(pageId, { sections: e.getJSON() }).then((res) => {
        if (res?.error) {
          setSaveStatus('error')
          console.error('[TipTapEditor] save error:', res.error)
        } else {
          setSaveStatus('saved')
          setTimeout(() => setSaveStatus('idle'), 2000)
        }
      })
    },
  })

  if (!editor) return null

  return (
    <div className="rounded border border-[#333333] bg-tt-bg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#333333] px-3 py-2">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          label="B"
          title="Gras"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          label="I"
          title="Italique"
        />
        <span className="mx-1 text-[#444444]">|</span>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          label="H2"
          title="Titre 2"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          label="H3"
          title="Titre 3"
        />
        <span className="mx-1 text-[#444444]">|</span>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          label="• Liste"
          title="Liste à puces"
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          label="1. Liste"
          title="Liste numérotée"
        />

        {/* Save status */}
        <span className="ml-auto text-xs">
          {saveStatus === 'saving' && <span className="text-[#666666]">Enregistrement…</span>}
          {saveStatus === 'saved' && <span className="text-[#4caf82]">Enregistré ✓</span>}
          {saveStatus === 'error' && <span className="text-red-400">Erreur d'enregistrement</span>}
        </span>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

function ToolbarBtn({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void
  active: boolean
  label: string
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
        active ? 'bg-tt-accent text-white' : 'text-tt-accent hover:bg-[#2a2a2a]'
      }`}
    >
      {label}
    </button>
  )
}
