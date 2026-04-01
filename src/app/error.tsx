'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main>
      <h1>Une erreur est malheureusement survenue - mais c'est pas grave !</h1>
      <button type="button" onClick={reset}>
        Réessayer
      </button>
    </main>
  )
}
