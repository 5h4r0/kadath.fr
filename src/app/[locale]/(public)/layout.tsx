export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
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
