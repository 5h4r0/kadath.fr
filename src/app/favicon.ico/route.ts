import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const headerStore = await headers()
  const host = headerStore.get('host') ?? 'kadath.fr'
  const proto = headerStore.get('x-forwarded-proto') ?? 'https'
  return NextResponse.redirect(`${proto}://${host}/icon.png`, {
    status: 301,
    headers: { 'Cache-Control': 'public, max-age=604800' },
  })
}
