# Migration : Next.js 16 + next-intl 4

## Objectif
Mettre à jour `next` (15 → 16) et `next-intl` (3 → 4) dans le monorepo kadath.fr sans régression fonctionnelle.

## Contexte projet
- Next.js App Router, TypeScript strict
- i18n : fr/en via next-intl avec routing basé sur le locale
- Linter : Biome (pas ESLint)
- Bundler actuel : webpack → passera à Turbopack par défaut

---

## Étape 1 — Lancer le codemod officiel Next.js

```bash
npx @next/codemod@canary upgrade latest
```

Ce codemod couvre automatiquement :
- La migration des `params` / `searchParams` vers async/await dans tous les `page.tsx`, `layout.tsx`, `route.ts`, `default.tsx`
- Les autres APIs request-time (`cookies`, `headers`, `draftMode`)

Après le codemod, vérifier que le build compile sans erreur :
```bash
pnpm build
```

---

## Étape 2 — Mettre à jour next-intl

```bash
pnpm add next-intl@latest
```

### 2a. Renommer middleware.ts → proxy.ts

Next.js 16 a renommé `middleware.ts` en `proxy.ts`. Le fichier `middleware.ts` est déprécié et le routing next-intl cesse de fonctionner sans ce renommage.

```bash
git mv src/middleware.ts src/proxy.ts
# adapter le chemin selon la structure réelle du projet
```

### 2b. Vérifier `getRequestConfig` retourne bien `locale`

Dans le fichier `i18n/request.ts` (ou équivalent), s'assurer que `locale` est retourné explicitement :

```ts
// AVANT (v3) — locale non retourné
export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../messages/${locale}.json`)).default,
}));

// APRÈS (v4) — locale obligatoire dans le retour
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### 2c. Vérifier `NextIntlClientProvider` dans le layout

En v4, `NextIntlClientProvider` est obligatoire si des Client Components utilisent `useTranslations`. Vérifier que le layout racine le fournit :

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 2d. Mettre à jour l'augmentation de types TypeScript

```ts
// global.ts ou types/next-intl.d.ts
// AVANT (v3)
type Messages = typeof import('./messages/fr.json');
declare global {
  interface IntlMessages extends Messages {}
}

// APRÈS (v4)
import { formats } from '@/i18n/request';
import fr from './messages/fr.json';
declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof fr;
    Formats: typeof formats;
  }
}
```

---

## Étape 3 — Vérifier la config next.config.ts

### Supprimer les options PPR expérimentales

```ts
// Supprimer si présent :
experimental: {
  ppr: true, // supprimé en v16
}

// Remplacer par (si PPR souhaité) :
cacheComponents: true,
```

### Turbopack

Turbopack est maintenant le bundler par défaut. Si une config webpack custom existe dans `next.config.ts`, elle sera ignorée. Identifier et adapter toute config webpack custom vers l'équivalent Turbopack.

---

## Étape 4 — Ajuster les scripts npm/pnpm

`next lint` est supprimé en v16. Vérifier `package.json` et remplacer :

```json
// AVANT
"lint": "next lint"

// APRÈS (Biome déjà en place sur ce projet)
"lint": "biome check ."
```

---

## Étape 5 — Vérification finale

```bash
pnpm build          # doit compiler sans erreur TypeScript ni Next.js
pnpm dev            # tester le routing i18n fr/en
pnpm test           # suite Vitest
```

Points à tester manuellement :
- [ ] Navigation fr ↔ en fonctionne
- [ ] `useTranslations` dans les Client Components fonctionne
- [ ] `cookies()` / `headers()` dans les Server Components (async)
- [ ] `params` dans les pages dynamiques (async)
- [ ] Les routes `/contact` et homepage (formulaire Turnstile)
- [ ] Espace client `/customer/` et backoffice `manage.kadath.fr`

---

## Notes

- Ne pas faire d'autres upgrades majeurs en parallèle (Tailwind, Zod, Stripe…)
- Commiter après chaque étape pour faciliter le rollback si besoin
- En cas d'erreur Turbopack sur un import SVG ou asset custom, ajouter `turbopack: { rules: {...} }` dans `next.config.ts`
