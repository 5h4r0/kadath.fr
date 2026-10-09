import SiteFooter from '@/components/SiteFooter'

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      {children}
      <SiteFooter locale={locale} />
      {/* Umami analytics — public zone only */}
      {process.env.NEXT_PUBLIC_UMAMI_URL && (
        // eslint-disable-next-line @next/next/no-sync-scripts
        <script
          defer
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
      )}
    </>
  )
}
