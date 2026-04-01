// Vitrine ThinkTwice — Hero section
// Revalidation toutes les 60s (page semi-dynamique, cf. CLAUDE.md)
export const revalidate = 60

// Figma assets — temporaires (expirent ~2026-04-08), remplacer par /public/images/
const LOGO_SRC = 'https://www.figma.com/api/mcp/asset/5c418913-004b-4157-ba65-f0aad7c25886'
const FRAME_SRC = 'https://www.figma.com/api/mcp/asset/5851d71d-8522-4181-8fa7-0b46d718d15f'
const PORTRAIT_LEFT_SRC = 'https://www.figma.com/api/mcp/asset/64e21008-19fa-4fb1-bbc6-7e80be522268'
const PORTRAIT_RIGHT_SRC =
  'https://www.figma.com/api/mcp/asset/2aaaf90d-0444-499f-af25-02f9972c5661'

export default function HomePage() {
  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Motif gauche décoratif — partiellement hors-écran */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 hidden h-[640px] w-80 rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:block"
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
              className="w-64 max-w-full lg:w-96"
            />
            <div className="flex flex-col font-sans3 font-extralight leading-tight text-tt-accent text-4xl lg:text-5xl">
              <span className="opacity-70">design × code</span>
              <span className="opacity-50">précision × exécution</span>
              <span className="opacity-30">double exigence</span>
            </div>
          </div>

          {/* Portrait dans cadre baroque */}
          <div className="relative">
            {/* Ombre décalée derrière le cadre */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-5 translate-y-5 rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={FRAME_SRC} alt="" className="relative z-10 w-full rounded-3xl object-cover" />
          </div>
        </div>
      </section>

      {/* ── VALUE PROP ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="font-light text-white text-4xl leading-snug lg:text-5xl">
          conception de sites WordPress performants, pensés pour votre image et votre business.
        </p>

        {/* Barre accent teal */}
        <div aria-hidden="true" className="mt-4 h-1.5 w-52 bg-tt-accent opacity-60" />

        <p className="mt-6 font-light text-tt-accent text-2xl leading-snug lg:text-3xl">
          nous associons direction artistique et développement pour créer des sites sur mesure,
          clairs, rapides et durables.
        </p>

        {/* Séparateur */}
        <div aria-hidden="true" className="mt-8 h-px bg-white/20" />

        {/* CTAs — TODO: remplacer href par les routes localisées (/[locale]/contact) */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row">
          <a
            href="#contact"
            className="flex-1 rounded bg-tt-accent px-8 py-5 text-center font-medium text-white text-2xl shadow-[20px_20px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            demander un devis
          </a>
          <a
            href="#contact"
            className="flex-1 rounded bg-tt-accent px-8 py-5 text-center font-medium text-white text-2xl shadow-[20px_20px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
          >
            prendre rendez-vous
          </a>
        </div>
      </section>

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-stretch gap-8">
          {/* Portrait gauche */}
          <div className="relative hidden w-36 flex-shrink-0 lg:block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
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
              en direction artistique et en développement — projets réalisés pour A1 Cloud Tech,
              Michelin Europe, Nissan, Orsay Avocats, Systran…
            </p>
          </div>

          {/* Portrait droit */}
          <div className="relative hidden w-36 flex-shrink-0 lg:block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-3 translate-y-3 rounded-3xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
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
