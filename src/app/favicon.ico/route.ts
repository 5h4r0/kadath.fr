import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'favicon.ico')
  const file = await readFile(filePath)
  return new NextResponse(file, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
