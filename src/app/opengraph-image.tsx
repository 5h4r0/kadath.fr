import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'
export const alt = 'thinktwice — Développement Web'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A1F2E',
        color: '#F8F8F8',
        fontSize: 64,
        fontWeight: 700,
      }}
    >
      thinktwice
    </div>,
    { ...size },
  )
}
