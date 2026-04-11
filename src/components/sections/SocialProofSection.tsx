import type { SocialProofContent } from '@/types/page-sections'

const PORTRAIT_LEFT_SRC = '/images/hero-portrait-left.png'
const PORTRAIT_RIGHT_SRC = '/images/hero-portrait-right.png'

interface Props {
  content: SocialProofContent
}

export function SocialProofSection({ content }: Props) {
  // stat_label format : "+20 ans d'expérience" → split sur espace
  const [stat, ...rest] = content.stat_label.split(' ')
  const statRest = rest.join(' ')

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="flex items-stretch gap-8">
        {/* Portrait gauche + motif derrière */}
        <div className="relative hidden w-36 flex-shrink-0 lg:block">
          <div
            aria-hidden="true"
            className="motif-dots pointer-events-none absolute left-0 right-0 top-0 h-[88%] translate-x-[1.9rem] -translate-y-[1.3rem] opacity-30 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTRAIT_LEFT_SRC}
            alt=""
            className="relative z-10 h-full w-full object-cover"
          />
        </div>

        {/* stat + description */}
        <div className="flex flex-1 flex-col justify-center gap-6">
          <div className="flex flex-wrap items-center gap-x-6">
            <span
              className="font-bold leading-none text-white"
              style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
            >
              {stat}
            </span>
            <span className="font-light leading-tight text-left text-white text-4xl lg:text-6xl">
              {statRest.split(' ').map((word, idx) => (
                <span key={word}>
                  {word}
                  {idx < statRest.split(' ').length - 1 ? <br /> : null}
                </span>
              ))}
            </span>
          </div>
          <p className="ml-4 max-w-[40rem] font-light text-tt-accent text-lg leading-relaxed lg:ml-24 lg:text-xl">
            En direction artistique et en développement.
            <br />
            Projets réalisés pour A1 Cloud Tech, Michelin Europe, Nissan, Orsay Avocats, Systran, et
            plus.
          </p>
        </div>

        {/* Portrait droit + motif derrière */}
        <div className="relative hidden w-36 flex-shrink-0 lg:block">
          <div
            aria-hidden="true"
            className="motif-dots pointer-events-none absolute left-0 right-0 top-0 h-[88%] -translate-x-[1.8rem] -translate-y-[1.3rem] opacity-30 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-3 translate-y-3 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PORTRAIT_RIGHT_SRC}
            alt=""
            className="relative z-10 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
