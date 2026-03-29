import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        ferryman: ['Ferryman', 'serif'],
        condensed: ['Helvetica Condensed', 'Arial Narrow', 'sans-serif'],
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        'surface-dark': 'var(--color-surface-dark)',
        'surface-light': 'var(--color-surface-light)',
        'bg-light': 'var(--color-bg-light)',
        'bg-dark': 'var(--color-bg-dark)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [typography],
}

export default config
