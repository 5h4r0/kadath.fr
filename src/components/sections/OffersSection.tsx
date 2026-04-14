import { getTranslations } from 'next-intl/server'

export async function OffersSection() {
  const t = await getTranslations('home.offers')

  const offers = [
    {
      slug: 'essentiel',
      fw: ['fw0', 'fw1', 'fw2'],
      content: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'],
    },
    {
      slug: 'signature',
      fw: ['fw0', 'fw1', 'fw2'],
      content: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    },
    {
      slug: 'premium',
      fw: ['fw0', 'fw1', 'fw2'],
      content: ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7'],
    },
  ] as const

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-12 text-center">
        <p className="mb-6 font-light text-tt-accent text-lg lg:text-xl">
          <span className="mark-gray">{t('intro')}</span>
        </p>
        <h2 className="inline text-3xl font-light text-tt-accent">
          <span className="mark-gray">{t('title')}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {offers.map(({ slug, fw, content }) => (
          <div key={slug} className="relative flex flex-col gap-6 p-6">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 opacity-20"
            />
            <div className="relative flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-2xl text-tt-accent">
                {t(`${slug}_name` as Parameters<typeof t>[0])}
              </h3>
              <p className="font-bold text-white text-xl">
                {t(`${slug}_price` as Parameters<typeof t>[0])}
              </p>
              <p className="font-bold text-white">
                {t(`${slug}_tagline` as Parameters<typeof t>[0])}
              </p>

              <p className="font-bold text-white mt-2">{t('for_who_label')}</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                {fw.map((k) => (
                  <li key={k}>
                    <span className="text-tt-accent">•</span>{' '}
                    {t(`${slug}_${k}` as Parameters<typeof t>[0])}
                  </li>
                ))}
              </ul>

              <p className="font-bold text-white mt-2">{t('content_label')}</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                {content.map((k) => (
                  <li key={k}>
                    <span className="text-tt-accent">•</span>{' '}
                    {t(`${slug}_${k}` as Parameters<typeof t>[0])}
                  </li>
                ))}
              </ul>

              <p className="font-bold text-tt-accent text-base mt-2">
                {t(`${slug}_pitch` as Parameters<typeof t>[0])}
              </p>
            </div>
            <a
              href="#contact"
              className="btn-cta relative block bg-tt-accent px-6 py-4 text-center font-light text-tt-bg text-lg leading-snug transition-opacity hover:opacity-90"
            >
              {t('cta')}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
