import type { MethodologyContent } from '@/lib/cms/schemas'

interface Props {
  content: MethodologyContent
}

export function MethodologySection({ content }: Props) {
  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Colonne gauche — Méthodologie */}
        <div className="flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{content.title}</span>
          </h2>
          <ol className="flex flex-col gap-6">
            {content.steps.map((step, n) => (
              <li key={step.title}>
                <p className="font-bold">
                  <span className="text-tt-accent">{n + 1}.</span> {step.title}
                </p>
                <p className="mt-1 text-base text-white/70">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Colonne droite — Pour qui ? */}
        <div className="flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">{content.target_title}</span>
          </h2>
          <p>{content.target_intro}</p>
          <ul className="flex flex-col gap-3 pl-2">
            {content.target_items.map((item) => (
              <li key={item}>
                <span className="text-tt-accent">•</span> <span className="mark-teal">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
