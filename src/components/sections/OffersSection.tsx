import type { OffersContent } from '@/lib/cms/schemas'

interface Props {
  content: OffersContent
}

export function OffersSection({ content }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-12 text-center">
        <p className="mb-6 font-light text-tt-accent text-lg lg:text-xl">
          <span className="mark-gray">{content.intro}</span>
        </p>
        <h2 className="inline text-3xl font-light text-tt-accent">
          <span className="mark-gray">{content.title}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {content.offers.map((offer) => (
          <div key={offer.slug} className="relative flex flex-col gap-6 p-6">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 opacity-30"
            />
            <div className="relative flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-2xl text-tt-accent">{offer.name}</h3>
              <p className="font-bold text-white text-xl">{offer.price}</p>
              <p className="font-bold text-white">{offer.tagline}</p>

              <p className="font-bold text-white mt-2">{content.for_who_label}</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                {offer.for_who.map((item) => (
                  <li key={item}>
                    <span className="text-tt-accent">•</span> {item}
                  </li>
                ))}
              </ul>

              <p className="font-bold text-white mt-2">{content.content_label}</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                {offer.content.map((item) => (
                  <li key={item}>
                    <span className="text-tt-accent">•</span> {item}
                  </li>
                ))}
              </ul>

              <p className="font-bold text-tt-accent text-base mt-2">{offer.pitch}</p>
            </div>
            <a
              href="#contact"
              className="btn-cta relative block bg-tt-accent px-6 py-4 text-center font-light text-tt-bg text-lg leading-snug transition-opacity hover:opacity-90"
            >
              {content.cta_label}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
