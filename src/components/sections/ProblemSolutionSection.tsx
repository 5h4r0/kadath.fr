import type { ProblemSolutionContent } from '@/types/page-sections'

interface Props {
  content: ProblemSolutionContent
}

export function ProblemSolutionSection({ content }: Props) {
  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Colonne gauche — Problème */}
        <div className="flex flex-col gap-6 font-light text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl">
            <span className="mark-gray">{content.problem_headline}</span>
          </h2>
          <p>{content.problem_body}</p>
        </div>

        {/* Colonne droite — Solution */}
        <div className="flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl">
            <span className="mark-gray">{content.solution_headline}</span>
          </h2>
          <p>{content.solution_body}</p>
        </div>
      </div>
    </section>
  )
}
