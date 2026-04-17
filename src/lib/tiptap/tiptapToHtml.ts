type Mark = { type: string }
type Node = {
  type: string
  text?: string
  marks?: Mark[]
  content?: Node[]
  attrs?: Record<string, unknown>
}

function renderMarks(text: string, marks: Mark[] = []): string {
  return marks.reduce((acc, mark) => {
    if (mark.type === 'bold') return `<strong>${acc}</strong>`
    if (mark.type === 'italic') return `<em>${acc}</em>`
    return acc
  }, text)
}

function renderNode(node: Node): string {
  const inner = (node.content ?? []).map(renderNode).join('')

  switch (node.type) {
    case 'doc':
      return inner
    case 'paragraph':
      return `<p>${inner}</p>`
    case 'heading': {
      const level = (node.attrs?.level as number) ?? 2
      return `<h${level}>${inner}</h${level}>`
    }
    case 'bulletList':
      return `<ul>${inner}</ul>`
    case 'orderedList':
      return `<ol>${inner}</ol>`
    case 'listItem':
      return `<li>${inner}</li>`
    case 'hardBreak':
      return '<br />'
    case 'text':
      return renderMarks(node.text ?? '', node.marks)
    default:
      return inner
  }
}

import DOMPurify from 'isomorphic-dompurify'

export function tiptapToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return ''
  return DOMPurify.sanitize(renderNode(doc as Node))
}
