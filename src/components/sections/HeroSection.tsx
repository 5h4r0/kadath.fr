import type { HeroContent } from '@/types/page-sections'

const LOGO_SRC = '/images/hero-logo.svg'
const FRAME_SRC = '/images/hero-cadre.png'

interface Props {
  content: HeroContent
}

export function HeroSection({ content }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/*
        Motif gauche — bord gauche de fenêtre jusqu'à ~20% de la largeur du SVG.
        Visible sur tous les viewports.
        Largeur = marge auto du container (max-w-6xl) + px-6 (1.5rem) + 20% du logo (33rem × 0.2)
      */}
      <div
        aria-hidden="true"
        className="motif-dots pointer-events-none absolute left-0 top-0 h-160 opacity-30 w-[calc(max(0,(100vw-72rem)/2)+7.3rem)]"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-8 pt-20 lg:grid-cols-2 lg:items-center">
        {/* Logo + taglines */}
        <div className="flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt={content.logo_alt}
            width={528}
            height={91}
            className="w-132 max-w-full"
          />
          {/* Mobile : aligné à droite, sans marge gauche. Desktop : indenté à 7rem */}
          <div className="flex flex-col font-sans3 font-extralight leading-tight text-tt-accent text-4xl text-right ml-0 lg:ml-28 lg:text-left lg:text-5xl">
            <span className="opacity-70">{content.tagline_top}</span>
            <span className="opacity-50">{content.tagline_main}</span>
            <span className="opacity-30">{content.tagline_sub}</span>
          </div>
        </div>

        {/* Portrait dans cadre baroque */}
        <div className="relative">
          {/* Motif de points — fond droit/bas du cadre (OmbreMotif-001 Figma) */}
          <div
            aria-hidden="true"
            className="motif-dots pointer-events-none absolute bottom-0 right-0 z-0 h-3/4 w-2/3 -translate-x-4 -translate-y-6 opacity-30"
          />
          {/* Ombre décalée derrière le cadre */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 translate-x-5 translate-y-5 filter-[drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FRAME_SRC} alt="" className="relative z-10 w-full object-cover" />
        </div>
      </div>
    </section>
  )
}
