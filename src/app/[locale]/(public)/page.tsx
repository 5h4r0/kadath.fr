// Vitrine ThinkTwice — Hero section
// Revalidation toutes les 60s (page semi-dynamique, cf. CLAUDE.md)
export const revalidate = 60

const LOGO_SRC = '/images/hero-logo.svg'
const FRAME_SRC = '/images/hero-cadre.png'
const PORTRAIT_LEFT_SRC = '/images/hero-portrait-left.png'
const PORTRAIT_RIGHT_SRC = '/images/hero-portrait-right.png'

export default function HomePage() {
  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/*
          Motif gauche — bord gauche de fenêtre jusqu'à ~20% de la largeur du SVG.
          Visible sur tous les viewports.
          Largeur = marge auto du container (max-w-6xl) + px-6 (1.5rem) + 20% du logo (33rem × 0.2)
        */}
        <div
          aria-hidden="true"
          className="motif-dots pointer-events-none absolute left-0 top-0 h-[640px] opacity-30 [width:calc(max(0px,(100vw-72rem)/2)+8.5rem)]"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-16 pt-20 lg:grid-cols-2 lg:items-center">
          {/* Logo + taglines */}
          <div className="flex flex-col gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="ThinkTwice"
              width={528}
              height={91}
              className="w-[33rem] max-w-full"
            />
            {/* Mobile : aligné à droite, sans marge gauche. Desktop : indenté à 7rem */}
            <div className="flex flex-col font-sans3 font-extralight leading-tight text-tt-accent text-4xl text-right ml-0 lg:ml-28 lg:text-left lg:text-5xl">
              <span className="opacity-70">Design × code</span>
              <span className="opacity-50">Précision × exécution</span>
              <span className="opacity-30">Double exigence</span>
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
              className="pointer-events-none absolute inset-0 z-0 translate-x-5 translate-y-5 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FRAME_SRC} alt="" className="relative z-10 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUE PROP ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-20">
        <p className="font-light text-white text-4xl leading-snug lg:text-[2.6rem]">
          Conception de sites <span className="mark-teal">WordPress</span> performants, pensés pour
          votre image et votre business.
        </p>

        <p className="mt-12 mb-16 font-light text-tt-accent text-2xl leading-snug lg:text-3xl">
          Nous associons direction artistique et développement pour créer{' '}
          <span className="mark-gray">des sites sur mesure, clairs, rapides et durables.</span>
        </p>

        {/* Espaceur */}
        <div aria-hidden="true" className="my-12" />

        {/* CTAs — TODO: remplacer href par les routes localisées (/[locale]/contact) */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row">
          <a
            href="#contact"
            className="btn-cta flex-1 bg-tt-accent px-8 py-5 text-center font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
          >
            Demander un devis
          </a>
          <a
            href="#contact"
            className="btn-cta flex-1 bg-tt-accent px-8 py-5 text-center font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
          >
            Prendre rendez-vous
          </a>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────── */}
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

          {/* +20 / expérience */}
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="flex flex-wrap items-center gap-x-6">
              <span
                className="font-bold leading-none text-white"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
              >
                +20
              </span>
              <span className="font-light leading-tight text-left text-white text-4xl lg:text-6xl">
                ans
                <br />
                d'expérience
              </span>
            </div>
            <p className="ml-4 max-w-[40rem] font-light text-tt-accent text-lg leading-relaxed lg:ml-24 lg:text-xl">
              En direction artistique et en développement.
              <br />
              Projets réalisés pour A1 Cloud Tech, Michelin Europe, Nissan, Orsay Avocats, Systran,
              et plus.
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
    </main>
  )
}
