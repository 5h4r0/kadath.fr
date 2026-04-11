import type { ValuePropContent } from '@/types/page-sections'

interface Props {
  content: ValuePropContent
}

export function ValuePropSection({ content }: Props) {
  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <h1 className="font-light text-white text-4xl leading-snug lg:text-[2.6rem]">
        {content.headline}
      </h1>

      <p className="mt-12 mb-16 font-light text-tt-accent text-2xl leading-snug lg:text-3xl">
        {content.subheadline}
      </p>

      {/* Espaceur */}
      <div aria-hidden="true" className="my-12" />

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-6 sm:flex-row">
        <a
          href={content.cta_primary.href}
          className="btn-cta flex-1 bg-tt-accent px-8 py-5 text-center font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
        >
          {content.cta_primary.label}
        </a>
        <a
          href={content.cta_secondary.href}
          className="btn-cta flex-1 bg-tt-accent px-8 py-5 text-center font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
        >
          {content.cta_secondary.label}
        </a>
      </div>
    </section>
  )
}
