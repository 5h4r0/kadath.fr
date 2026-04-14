import ContactForm from '@/components/contact/ContactForm'
import { getTranslations } from 'next-intl/server'

interface ContactSectionProps {
  /**
   * Niveau du titre principal — h1 sur la page dédiée, h2 en section homepage.
   * @default 'h2'
   */
  headingLevel?: 'h1' | 'h2'
  /** Focus automatique sur first_name à l'arrivée (page /contact). */
  autoFocus?: boolean
}

export default async function ContactSection({
  headingLevel: Tag = 'h2',
  autoFocus,
}: ContactSectionProps) {
  const t = await getTranslations('contact')

  return (
    <>
      {/* ── TITRE ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pt-24 pb-16 text-center">
        <Tag className="text-[1.875rem] font-light tracking-tight text-white">
          <span className="mark-teal">{t('heading')}</span>
        </Tag>
      </section>

      {/* ── INFO CONTACTS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Adresses */}
          <div className="border-l border-tt-accent pl-6 flex flex-col gap-4 text-base leading-relaxed">
            <div>
              <p className="text-tt-accent font-bold text-lg">{t('paris_title')}</p>
              <p className="text-white/80">{t('paris_address_1')}</p>
              <p className="text-white/80">{t('paris_address_2')}</p>
            </div>
            <hr className="border-white/10" />
            <div>
              <p className="text-tt-accent font-bold text-lg">{t('nimes_title')}</p>
              <p className="text-white/80">{t('nimes_address_1')}</p>
              <p className="text-white/80">{t('nimes_address_2')}</p>
            </div>
            <hr className="border-white/10" />
            <p className="text-white/80">
              {t('email_label')}{' '}
              <a href={`mailto:${t('email')}`} className="text-tt-accent hover:underline">
                {t('email')}
              </a>
            </p>
          </div>

          {/* Colonne droite — Contacts directs */}
          <div className="border-l border-tt-accent pl-6 flex flex-col gap-4">
            <div>
              <p className="text-sm text-white/60 mb-1">{t('ss_contact_label')}</p>
              <a
                href="tel:+33687434294"
                className="text-tt-accent text-2xl font-bold tracking-tight hover:underline lg:text-3xl"
              >
                +33 (0)6 87 43 42 94
              </a>
            </div>
            <hr className="border-white/10" />
            <div>
              <p className="text-sm text-white/60 mb-1">{t('sr_contact_label')}</p>
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
              <span className="mark-teal font-light text-white">{t('form_heading')}</span>
            </h2>
            <hr className="border-white/10 my-4" />
            <p className="font-light text-white">{t('form_heading_phone')}</p>
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
