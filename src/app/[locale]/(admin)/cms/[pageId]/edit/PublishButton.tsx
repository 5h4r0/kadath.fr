'use client'

import { updatePage } from '@/app/actions/cms'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Props {
  pageId: string
  published: boolean
}

export function PublishButton({ pageId, published }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await updatePage(pageId, { published: !published })
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`rounded px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 ${
        published ? 'border border-[#555555] text-[#cccccc]' : 'bg-tt-accent text-white'
      }`}
    >
      {isPending ? '…' : published ? 'Dépublier' : 'Publier'}
    </button>
  )
}
