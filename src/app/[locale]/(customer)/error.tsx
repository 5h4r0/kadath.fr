'use client'

export default function CustomerError({
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
