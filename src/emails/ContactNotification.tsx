interface ContactNotificationProps {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactNotification({
  name,
  email,
  subject,
  message,
}: ContactNotificationProps) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <title>Nouveau message de contact</title>
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
              Nouveau message de contact
            </h1>
          </div>

          <div style={{ padding: '24px 32px' }}>
            <p
              style={{
                color: '#aaaaaa',
                margin: '0 0 4px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Nom
            </p>
            <p style={{ color: '#ffffff', margin: '0 0 20px', fontSize: '16px' }}>{name}</p>

            <p
              style={{
                color: '#aaaaaa',
                margin: '0 0 4px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Email
            </p>
            <p style={{ color: '#26e1b0', margin: '0 0 20px', fontSize: '16px' }}>{email}</p>

            <p
              style={{
                color: '#aaaaaa',
                margin: '0 0 4px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Sujet
            </p>
            <p style={{ color: '#ffffff', margin: '0 0 20px', fontSize: '16px' }}>{subject}</p>

            <hr style={{ borderColor: '#444444', margin: '0 0 20px' }} />

            <p
              style={{
                color: '#aaaaaa',
                margin: '0 0 4px',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Message
            </p>
            <p
              style={{
                color: '#ffffff',
                margin: 0,
                fontSize: '15px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {message}
            </p>
          </div>

          <div style={{ padding: '16px 32px', borderTop: '1px solid #444444' }}>
            <p style={{ color: '#666666', margin: 0, fontSize: '12px' }}>
              kadath.fr — formulaire de contact
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
