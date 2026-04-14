interface ContactConfirmationProps {
  firstName: string
  name: string
  locale: 'fr' | 'en'
}

const copy = {
  fr: {
    title: 'Message reçu',
    greeting: (firstName: string, name: string) => `Bonjour ${firstName} ${name},`,
    body: 'Merci pour votre message, nous reprenons contact très rapidement avec vous.',
  },
  en: {
    title: 'Message received',
    greeting: (firstName: string, name: string) => `Hello ${firstName} ${name},`,
    body: 'Thank you for your message, we will get back to you very shortly.',
  },
}

export default function ContactConfirmation({ firstName, name, locale }: ContactConfirmationProps) {
  const t = copy[locale]

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <title>{t.title}</title>
      </head>
      <body
        style={{
          backgroundColor: '#f8f8f8',
          fontFamily: 'sans-serif',
          margin: 0,
          padding: '40px 0',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#333333',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 32px', borderBottom: '2px solid #26e1b0' }}>
            <h1 style={{ color: '#26e1b0', margin: 0, fontSize: '20px', fontWeight: 700 }}>
              kadath.fr
            </h1>
          </div>

          <div style={{ padding: '32px' }}>
            <p style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 16px' }}>
              {t.greeting(firstName, name)}
            </p>
            <p style={{ color: '#dddddd', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              {t.body}
            </p>
          </div>

          <div style={{ padding: '16px 32px', borderTop: '1px solid #444444' }}>
            <p style={{ color: '#666666', margin: 0, fontSize: '12px' }}>kadath.fr</p>
          </div>
        </div>
      </body>
    </html>
  )
}
