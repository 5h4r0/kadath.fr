import { getTranslations } from 'next-intl/server'

export async function DeliverablesSection() {
  const t = await getTranslations('home.deliverables')

  const items = [
    {
      key: 'wp',
      bullets: ['wp_b0', 'wp_b1'],
    },
    {
      key: 'ux',
      bullets: ['ux_b0', 'ux_b1'],
    },
    {
      key: 'perf',
      bullets: ['perf_b0', 'perf_b1', 'perf_b2'],
    },
    {
      key: 'auto',
      bullets: ['auto_b0', 'auto_b1'],
    },
  ] as const

  return (
    <section className="relative w-full pb-24 text-center">
      <div
        aria-hidden="true"
        className="motif-dots pointer-events-none absolute left-0 top-0 bottom-0 opacity-20 [width:calc(max(0px,(100%-40rem)/2))]"
      />
      <div
        aria-hidden="true"
        className="motif-dots pointer-events-none absolute right-0 top-0 bottom-0 opacity-20 [width:calc(max(0px,(100%-40rem)/2))]"
      />

      <div className="relative mx-auto max-w-[40rem] px-6 flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
        <h2 className="text-2xl font-light text-tt-accent">
          <span className="mark-gray">{t('title')}</span>
        </h2>

        {items.map(({ key, bullets }) => (
          <div key={key} className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span>{' '}
              <span className="mark-teal">{t(`${key}_title` as Parameters<typeof t>[0])}</span>
            </p>
            {bullets.map((b) => (
              <p key={b}>
                <span className="text-tt-accent">•</span> {t(b as Parameters<typeof t>[0])}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
