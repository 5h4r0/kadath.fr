'use client'

export default function PublicError({
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
