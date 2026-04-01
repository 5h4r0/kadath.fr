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
        {/* Motif gauche décoratif — partiellement hors-écran */}
        <div
          aria-hidden="true"
          className="motif-dots pointer-events-none absolute -left-24 top-0 hidden h-[640px] w-80 rounded-3xl opacity-20 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))] lg:block"
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
            <div className="flex flex-col font-sans3 font-extralight leading-tight text-tt-accent text-4xl lg:text-5xl">
              <span className="opacity-70">Design × code</span>
              <span className="opacity-50">Précision × exécution</span>
              <span className="opacity-30">Double exigence</span>
            </div>
          </div>

          {/* Portrait dans cadre baroque */}
          <div className="relative">
            {/* Motif de points — fond droit/bas du cadre, fidèle Figma (OmbreMotif-001) */}
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute bottom-0 right-0 z-0 h-3/4 w-2/3 translate-x-6 translate-y-6 opacity-20"
            />
            {/* Ombre décalée derrière le cadre */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 translate-x-5 translate-y-5 rounded-3xl [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FRAME_SRC} alt="" className="relative z-10 w-full rounded-3xl object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUE PROP ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="font-light text-white text-4xl leading-snug lg:text-5xl">
          Conception de sites <span className="mark-teal">WordPress</span> performants, pensés pour
          votre image et votre business.
        </p>

        <p className="mt-6 font-light text-tt-accent text-2xl leading-snug lg:text-3xl">
          Nous associons direction artistique et développement pour créer{' '}
          <span className="mark-gray">des sites sur mesure, clairs, rapides et durables.</span>
        </p>

        {/* Séparateur */}
        <div aria-hidden="true" className="mt-8 h-px bg-white/20" />

        {/* CTAs — TODO: remplacer href par les routes localisées (/[locale]/contact) */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row">
          <a
            href="#contact"
            className="flex-1 rounded bg-tt-accent px-8 py-5 text-center font-medium text-tt-bg text-2xl [filter:drop-shadow(20px_20px_4px_rgba(0,0,0,0.25))] transition-opacity hover:opacity-90"
          >
            Demander un devis
          </a>
          <a
            href="#contact"
            className="flex-1 rounded bg-tt-accent px-8 py-5 text-center font-medium text-tt-bg text-2xl [filter:drop-shadow(20px_20px_4px_rgba(0,0,0,0.25))] transition-opacity hover:opacity-90"
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
              className="motif-dots pointer-events-none absolute inset-0 -translate-x-4 rounded-3xl opacity-20 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-3xl [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT_LEFT_SRC}
              alt=""
              className="relative z-10 h-full w-full rounded-3xl object-cover"
            />
          </div>

          {/* +20 / expérience */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div className="flex flex-wrap items-baseline justify-center gap-x-6">
              <span
                className="font-bold leading-none text-white"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
              >
                +20
              </span>
              <span className="font-light leading-tight text-white text-4xl lg:text-6xl">
                ans
                <br />
                d'expérience
              </span>
            </div>
            <p className="max-w-md font-light text-tt-accent text-lg leading-relaxed lg:text-xl">
              En direction artistique et en développement — projets réalisés pour A1 Cloud Tech,
              Michelin Europe, Nissan, Orsay Avocats, Systran…
            </p>
          </div>

          {/* Portrait droit + motif derrière */}
          <div className="relative hidden w-36 flex-shrink-0 lg:block">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 translate-x-4 rounded-3xl opacity-20 [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl [filter:drop-shadow(0px_4px_4px_rgba(0,0,0,0.25))]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT_RIGHT_SRC}
              alt=""
              className="relative z-10 h-full w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
