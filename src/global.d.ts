import type fr from '../messages/fr.json'

declare module '*.css'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof fr
  }
}
