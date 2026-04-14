import { getTranslations } from 'next-intl/server'

export async function OptionsSection() {
  const t = await getTranslations('home.options')

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="flex items-start gap-8">
        <div className="flex-[3] flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{t('title')}</span>
          </h2>
          <ul className="flex flex-col gap-3">
            {([0, 1, 2, 3, 4] as const).map((i) => (
              <li key={i}>
                <span className="text-tt-accent">•</span> {t(`item${i}` as Parameters<typeof t>[0])}
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="motif-dots hidden lg:block flex-[2] self-stretch opacity-20"
        />
      </div>

      <div className="mt-16 text-center">
        <a
          href="#contact"
          className="btn-cta inline-block w-full max-w-[40rem] bg-tt-accent px-8 py-5 font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
        >
          {t('cta')}
        </a>
      </div>
    </section>
  )
}
