import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'thinktwice.sokol.fr',
    short_name: 'kadath',
    description: 'Développeur web freelance',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A1F2E',
    theme_color: '#C5205D',
    icons: [{ src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }],
  }
}
