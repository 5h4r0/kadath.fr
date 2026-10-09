import type { OptionsContent } from '@/lib/cms/schemas'

interface Props {
  content: OptionsContent
}

export function OptionsSection({ content }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="flex items-start gap-8">
        <div className="flex-3 flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{content.title}</span>
          </h2>
          <ul className="flex flex-col gap-3">
            {content.items.map((item) => (
              <li key={item}>
                <span className="text-tt-accent">•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden="true"
          className="motif-dots hidden lg:block flex-2 self-stretch opacity-30"
        />
      </div>

      <div className="mt-16 text-center">
        <a
          href="#contact"
          className="btn-cta inline-block w-full max-w-160 bg-tt-accent px-8 py-5 font-light text-tt-bg text-[1.8rem] leading-8 transition-opacity hover:opacity-90"
        >
          {content.cta_label}
        </a>
      </div>
    </section>
  )
}
