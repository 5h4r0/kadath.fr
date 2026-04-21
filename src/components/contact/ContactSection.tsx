import ContactForm from '@/components/contact/ContactForm'
import type { ContactContent } from '@/lib/cms/schemas'

interface ContactSectionProps {
  content: ContactContent
  headingLevel?: 'h1' | 'h2'
  autoFocus?: boolean
}

export default function ContactSection({
  content,
  headingLevel: Tag = 'h2',
  autoFocus,
}: ContactSectionProps) {
  return (
    <>
      {/* ── TITRE ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pt-24 pb-16 text-center">
        <Tag className="text-[1.875rem] font-light tracking-tight text-white">
          <span className="mark-teal">{content.heading}</span>
        </Tag>
      </section>

      {/* ── INFO CONTACTS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Adresses */}
          <div className="flex flex-col gap-4 text-base leading-relaxed">
            {content.offices.map((office, i) => (
              <div key={office.city}>
                <p className="text-tt-accent font-bold text-lg">{office.city}</p>
                <p className="text-white/80">{office.address_1}</p>
                <p className="text-white/80">{office.address_2}</p>
                {i < content.offices.length - 1 && <hr className="border-white/10 mt-4" />}
              </div>
            ))}
            <hr className="border-white/10" />
            <p className="text-white/80">
              {content.email_label}{' '}
              <a href={`mailto:${content.email}`} className="text-tt-accent hover:underline">
                {content.email}
              </a>
            </p>
          </div>

          {/* Colonne droite — Contacts directs */}
          <div className="flex flex-col gap-4">
            {content.contacts.map((contact, i) => (
              <div key={contact.phone_href}>
                <p className="text-sm text-white/60 mb-1">{contact.label}</p>
                <a
                  href={contact.phone_href}
                  className="text-tt-accent text-2xl font-bold tracking-tight hover:underline lg:text-3xl"
                >
                  {contact.phone}
                </a>
                {i < content.contacts.length - 1 && <hr className="border-white/10 mt-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULAIRE ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Colonne gauche — Accroche */}
          <div className="flex flex-col justify-start">
            <h2 className="text-xl font-bold leading-snug lg:text-2xl">
              <span className="mark-teal font-light text-white">{content.form_heading}</span>
            </h2>
            <p className="pt-8 font-light text-white">{content.form_heading_txt}</p>
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
