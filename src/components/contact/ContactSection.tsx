import ContactForm from '@/components/contact/ContactForm'

interface ContactSectionProps {
  /**
   * Niveau du titre principal — h1 sur la page dédiée, h2 en section homepage.
   * @default 'h2'
   */
  headingLevel?: 'h1' | 'h2'
  /** Focus automatique sur first_name à l'arrivée (page /contact). */
  autoFocus?: boolean
}

export default function ContactSection({
  headingLevel: Tag = 'h2',
  autoFocus,
}: ContactSectionProps) {
  return (
    <>
      {/* ── TITRE ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pt-24 pb-16 text-center">
        <Tag className="text-[1.875rem] font-light tracking-tight text-white">
          <span className="mark-gray">Contactez-nous</span>
        </Tag>
      </section>

      {/* ── INFO CONTACTS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Adresses */}
          <div className="border-l border-tt-accent pl-6 flex flex-col gap-4 text-base leading-relaxed">
            <div>
              <p className="text-tt-accent font-bold text-lg">Paris</p>
              <p className="text-white/80">37 quater avenue du Maréchal Foch</p>
              <p className="text-white/80">77370 Nangis</p>
            </div>
            <hr className="border-white/10" />
            <div>
              <p className="text-tt-accent font-bold text-lg">Nîmes</p>
              <p className="text-white/80">6 rue Massillon</p>
              <p className="text-white/80">30000 Nîmes</p>
            </div>
            <hr className="border-white/10" />
            <p className="text-white/80">
              E-mail :{' '}
              <a href="mailto:thinktwice@sokol.fr" className="text-tt-accent hover:underline">
                thinktwice@sokol.fr
              </a>
            </p>
          </div>

          {/* Colonne droite — Contacts directs */}
          <div className="border-l border-tt-accent pl-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-white/60 mb-1">Contactez Stéphane Sokol directement</p>
              <a
                href="tel:+33687434294"
                className="text-tt-accent text-2xl font-bold tracking-tight hover:underline lg:text-3xl"
              >
                +33 (0)6 87 43 42 94
              </a>
            </div>
            <hr className="border-white/10" />
            <div>
              <p className="text-sm text-white/60 mb-1">Contactez Stéphane Rochard directement</p>
              <a
                href="tel:+33623711812"
                className="text-tt-accent text-2xl font-bold tracking-tight hover:underline lg:text-3xl"
              >
                +33 (0)6 23 71 18 12
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Accroche */}
          <div className="flex flex-col justify-start">
            <h2 className="text-xl font-bold leading-snug lg:text-2xl">
              <span className="mark-teal">Besoin d'informations supplémentaires</span>
            </h2>
          </div>

          {/* Colonne droite — Formulaire */}
          <div>
            <ContactForm autoFocus={autoFocus} />
          </div>
        </div>
      </section>
    </>
  )
}
