import { getTranslations } from 'next-intl/server'

export async function MethodologySection() {
  const t = await getTranslations('home')

  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Colonne gauche — Méthodologie */}
        <div className="flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{t('methodology.title')}</span>
          </h2>
          <ol className="flex flex-col gap-6">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <li key={n}>
                <p className="font-bold">
                  <span className="text-tt-accent">{n}.</span>{' '}
                  {t(`methodology.step${n}_title` as Parameters<typeof t>[0])}
                </p>
                <p className="mt-1 text-base text-white/70">
                  {t(`methodology.step${n}_desc` as Parameters<typeof t>[0])}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Colonne droite — Pour qui ? */}
        <div className="flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{t('target.title')}</span>
          </h2>
          <p>{t('target.intro')}</p>
          <ul className="flex flex-col gap-3 pl-2">
            {([0, 1, 2, 3] as const).map((i) => (
              <li key={i}>
                <span className="text-tt-accent">•</span>{' '}
                <span className="mark-teal">{t(`target.item${i}` as Parameters<typeof t>[0])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
