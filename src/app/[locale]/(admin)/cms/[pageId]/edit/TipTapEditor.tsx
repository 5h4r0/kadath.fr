'use client'

import { updatePage } from '@/app/actions/cms'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  pageId: string
  initialContent: unknown
}

export function TipTapEditor({ pageId, initialContent }: Props) {
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
      updatePage(pageId, { sections: e.getJSON() })
    },
  })

  if (!editor) return null

  return (
    <div className="rounded border border-[#333333] bg-tt-bg">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-[#333333] px-3 py-2">
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
