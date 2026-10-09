'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deletePage } from '@/app/actions/cms'

export function DeleteButton({ pageId }: { pageId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Supprimer cette page ? Cette action est irréversible.')) return
    startTransition(async () => {
      await deletePage(pageId)
      router.push('/manage/cms')
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-sm border border-[#3a1a1a] px-4 py-2 text-sm text-[#cf4a4a] hover:bg-[#3a1a1a] disabled:opacity-50"
    >
      {isPending ? 'Suppression…' : 'Supprimer'}
    </button>
  )
}
