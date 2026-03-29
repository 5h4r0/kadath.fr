'use client'

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main>
      <h1>Erreur</h1>
      <button type="button" onClick={reset}>
        Réessayer
      </button>
    </main>
  )
}
