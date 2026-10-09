# Sprint — CMS Homepage : câblage frontend + revalidation + parsers Zod

## Contexte

Projet Next.js 15 / Supabase / `@supabase/ssr`. Le pipeline CMS backoffice est
fonctionnel : table `page_sections`, server actions `updateSection` +
`toggleVisible`, éditeur JSON en backoffice. La page publique
`src/app/[locale]/(public)/page.tsx` est encore hardcodée. Ce sprint la câble
sur le pipeline CMS, ajoute la revalidation on-demand, et remplace les
double-casts `as unknown as XxxContent` par des parsers Zod.

---

## 1. Schémas Zod pour les sections CMS

**Fichier à créer :** `src/lib/cms/schemas.ts`

Définir un schéma Zod par type de section présent dans la seed (`home`).
S'appuyer sur la seed SQL et/ou les types existants pour connaître les shapes.
Chaque schéma est exporté nommément. Exporter aussi un union discriminé
`SectionContentSchema` et le type `SectionContent`.

Schémas minimum requis (adapter les champs exacts à ce qui est dans la seed) :

```ts
import { z } from 'zod'

export const HeroContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  cta_label: z.string().optional(),
  cta_href: z.string().optional(),
})

export const ValuePropContentSchema = z.object({
  items: z.array(
    z.object({
      icon: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
    })
  ),
})

export const ContactContentSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
})

// Ajouter autant de schémas que de section_type distincts dans page_sections
// pour la page home. Si un type n'est pas listé ici, utiliser z.record(z.unknown())
// comme fallback.

export type HeroContent = z.infer<typeof HeroContentSchema>
export type ValuePropContent = z.infer<typeof ValuePropContentSchema>
export type ContactContent = z.infer<typeof ContactContentSchema>
```

Règle : **ne jamais utiliser `as unknown as XxxContent`** dans ce sprint ni
dans les fichiers modifiés. Toujours passer par `XxxSchema.safeParse(content)`.

---

## 2. Fetch des sections homepage

**Fichier à créer :** `src/lib/cms/getHomeSections.ts`

Fonction server-side qui fetch toutes les sections visibles de la page `home`,
triées par `order_index`. Retourne un tableau typé.

```ts
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export type PageSection = {
  id: string
  section_type: string
  content: unknown  // sera parsé par les schémas Zod à l'usage
  order_index: number
}

export async function getHomeSections(): Promise<PageSection[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('page_sections')
    .select('id, section_type, content, order_index')
    .eq('page_slug', 'home')
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('[getHomeSections]', error.message)
    return []
  }

  return data ?? []
}
```

---

## 3. Câbler `(public)/page.tsx`

**Fichier :** `src/app/[locale]/(public)/page.tsx`

Remplacer le contenu hardcodé par un fetch CMS + rendu dynamique des sections.

Pattern :

```tsx
import { getHomeSections } from '@/lib/cms/getHomeSections'
import { HeroContentSchema, ValuePropContentSchema, ContactContentSchema } from '@/lib/cms/schemas'
// importer les composants de section existants (HeroSection, etc.)
// S'ils n'existent pas encore, les créer inline ou dans src/components/sections/

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const sections = await getHomeSections()

  return (
    <main>
      {sections.map((section) => {
        switch (section.section_type) {
          case 'hero': {
            const parsed = HeroContentSchema.safeParse(section.content)
            if (!parsed.success) return null
            return <HeroSection key={section.id} content={parsed.data} locale={locale} />
          }
          case 'value_prop': {
            const parsed = ValuePropContentSchema.safeParse(section.content)
            if (!parsed.success) return null
            return <ValuePropSection key={section.id} content={parsed.data} />
          }
          case 'contact': {
            const parsed = ContactContentSchema.safeParse(section.content)
            if (!parsed.success) return null
            return <ContactSection key={section.id} content={parsed.data} locale={locale} />
          }
          default:
            return null
        }
      })}
    </main>
  )
}
```

**Important :** conserver l'apparence visuelle existante de la homepage. Les
composants de section (`HeroSection`, etc.) doivent reprendre exactement le
markup/classes Tailwind actuellement hardcodés dans `page.tsx`. Ne pas
redesigner.

---

## 4. Revalidation on-demand dans les server actions

**Fichier :** `src/app/[locale]/(admin)/cms/[pageId]/sections/actions.ts`
(ou le chemin exact où `updateSection` et `toggleVisible` sont définis)

Ajouter `revalidatePath('/', 'layout')` à la fin de chaque action qui modifie
`page_sections`, **après** le update Supabase et avant le `return`.

```ts
import { revalidatePath } from 'next/cache'

// Dans updateSection, après le update :
revalidatePath('/', 'layout')

// Dans toggleVisible, après le update :
revalidatePath('/', 'layout')
```

`'layout'` revalide toutes les pages sous `/` en un seul appel.

---

## 5. Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/lib/supabase/server.ts`, `client.ts`, ni `middleware.ts`
- Ne pas installer de nouvelles dépendances (`zod` est déjà présent)
- Zéro `as unknown as XxxContent` dans les fichiers créés ou modifiés
- Si un `section_type` dans la seed n'a pas de schéma dans `schemas.ts`,
  l'ajouter plutôt que d'ignorer silencieusement
- Les composants de section doivent accepter des props typées via
  `z.infer<typeof XxxContentSchema>`, pas `any`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` est le nom exact de la variable
  d'env Supabase publique (ne pas supposer le nom standard)

---

## Livrable attendu

5 fichiers créés ou modifiés :

1. `src/lib/cms/schemas.ts` — schémas Zod (nouveau)
2. `src/lib/cms/getHomeSections.ts` — fetch server-side (nouveau)
3. `src/app/[locale]/(public)/page.tsx` — câblé sur CMS (modifié)
4. Actions server `updateSection` + `toggleVisible` — `revalidatePath` ajouté (modifié)
5. Composants de section (`src/components/sections/`) — créés si inexistants, sinon vérifiés (nouveau/modifié)

`tsc --noEmit` doit passer en fin de sprint.
