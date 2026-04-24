import type { DeliverablesContent } from '@/lib/cms/schemas'

interface Props {
  content: DeliverablesContent
}

export function DeliverablesSection({ content }: Props) {
  return (
    <section className="relative w-full pb-24 text-center">
      <div
        aria-hidden="true"
        className="motif-dots pointer-events-none absolute left-0 top-0 bottom-0 opacity-30 w-[calc(max(0px,(100%-40rem)/2))]"
      />
      <div
        aria-hidden="true"
        className="motif-dots pointer-events-none absolute right-0 top-0 bottom-0 opacity-30 w-[calc(max(0px,(100%-40rem)/2))]"
      />

      <div className="relative mx-auto max-w-160 px-6 flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
        <h2 className="text-2xl font-light text-tt-accent">
          <span className="mark-gray">{content.title}</span>
        </h2>

        {content.items.map((item) => (
          <div key={item.key} className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span>{' '}
              <span className="mark-teal">{item.title}</span>
            </p>
            {item.bullets.map((b) => (
              <p key={b}>
                <span className="text-tt-accent">•</span> {b}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
