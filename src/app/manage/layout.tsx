import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ThinkTwice — Admin',
}

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
