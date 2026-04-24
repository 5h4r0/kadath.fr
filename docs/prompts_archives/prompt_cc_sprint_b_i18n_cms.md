# Sprint B — Migration contenu éditorial i18n → CMS Supabase

## Contexte

Projet Next.js 15 / Supabase / `@supabase/ssr` / `next-intl`. Le pipeline CMS
est fonctionnel : table `page_sections` avec éditeur JSON backoffice, server
actions `updateSection` + `toggleSectionVisibility` dans
`src/app/actions/sections.ts`, fetch dans `src/lib/sections/fetch-homepage.ts`.

Quatre sections (`hero`, `value_prop`, `social_proof`, `problem_solution`) sont
déjà câblées sur le CMS avec des schémas Zod dans `src/lib/cms/schemas.ts` et
des types dans `src/types/page-sections.ts`. Cinq sections restantes
(`methodology`, `deliverables`, `offers`, `options`, `team`) ainsi que
`ContactSection` et `SiteFooter` utilisent encore `getTranslations` de
`next-intl` pour du contenu éditorial.

**Architecture validée pour ce sprint :**
- `page_sections.content` stocke `{ "fr": { … }, "en": { … } }`
- Le locale est résolu dans `page.tsx` avant le parse Zod : `section.content[locale]`
- `/messages/` ne conserve que les chaînes **applicatives** : `common`, `auth`,
  `admin`, `customer`, `cms`, `contact.form` (labels/erreurs/placeholders du formulaire)
- Tout le contenu éditorial visiteur migre dans `page_sections` ou `site_settings`
- Les clés `home.*`, `contact.*` (hors `contact.form`), `footer.*`, `about.*`,
  `legal.*` sont supprimées de `fr.json` et `en.json` en fin de sprint

---

## Périmètre du sprint

### Sections homepage → `page_sections`

Migrer ces 5 composants de `getTranslations` vers une prop `content` typée :
`MethodologySection`, `DeliverablesSection`, `OffersSection`, `OptionsSection`,
`TeamSection`.

Pattern identique aux sections déjà migrées (`HeroSection`, `ValuePropSection`,
etc.) : le composant devient une fonction pure qui reçoit `content` en prop,
sans aucun appel `getTranslations`.

### ContactSection → section `'contact'` dans `page_sections`

`ContactSection` affiche du contenu éditorial (adresses, noms, emails, numéros,
titres). Ce contenu migre vers une section de type `'contact'` dans
`page_sections` de la page homepage. Le composant `ContactForm` et ses labels
(`contact.form.*`) ne bougent **pas** — ce sont des chaînes applicatives.

### SiteFooter → `site_settings`

Le footer affiche copyright et 3 liens légaux. Ces données sont globales (pas
liées à une seule page) → table `site_settings` existante, nouvelles clés JSON.
`SiteFooter` lit ces clés depuis Supabase au lieu de `getTranslations`.

### Nettoyage `messages/`

Supprimer de `fr.json` et `en.json` toutes les clés migrées au CMS. Conserver
uniquement `common`, `auth`, `admin`, `customer`, `cms`, `contact.form`.

---

## 1. Nouveaux types et schémas Zod

### 1a. `src/types/page-sections.ts` — étendre `SectionType` et ajouter les interfaces

Ajouter à l'union `SectionType` les nouveaux types :
`'methodology'`, `'deliverables'`, `'offers'`, `'options'`, `'team'`, `'contact'`

Ajouter les interfaces de contenu (shape des valeurs après résolution du locale,
i.e. `content[locale]`) :

```ts
export interface MethodologyContent {
  title: string
  steps: { title: string; desc: string }[]       // 5 éléments
  target_title: string
  target_intro: string
  target_items: string[]                          // 4 éléments
}

export interface DeliverablesContent {
  title: string
  items: {
    key: string
    title: string
    bullets: string[]
  }[]
}

export interface OffersContent {
  title: string
  intro: string
  cta_label: string
  for_who_label: string
  content_label: string
  offers: {
    slug: string
    name: string
    price: string
    tagline: string
    pitch: string
    for_who: string[]
    content: string[]
  }[]
}

export interface OptionsContent {
  title: string
  items: string[]
  cta_label: string
}

export interface TeamContent {
  title: string
  members: {
    key: string
    name: string
    img: string
    linkedin: string
    bios: string[]   // HTML autorisé (balises <strong>)
  }[]
}

export interface ContactContent {
  heading: string
  offices: {
    city: string
    address_1: string
    address_2: string
  }[]
  email_label: string
  email: string
  contacts: {
    label: string
    phone: string
    phone_href: string
  }[]
  form_heading: string
  form_heading_txt: string
}
```

### 1b. `src/lib/cms/schemas.ts` — ajouter les schémas Zod correspondants

Ajouter après les schémas existants :

```ts
export const MethodologyContentSchema = z.object({
  title: z.string(),
  steps: z.array(z.object({ title: z.string(), desc: z.string() })).length(5),
  target_title: z.string(),
  target_intro: z.string(),
  target_items: z.array(z.string()).length(4),
})

export const DeliverablesContentSchema = z.object({
  title: z.string(),
  items: z.array(z.object({
    key: z.string(),
    title: z.string(),
    bullets: z.array(z.string()),
  })),
})

export const OffersContentSchema = z.object({
  title: z.string(),
  intro: z.string(),
  cta_label: z.string(),
  for_who_label: z.string(),
  content_label: z.string(),
  offers: z.array(z.object({
    slug: z.string(),
    name: z.string(),
    price: z.string(),
    tagline: z.string(),
    pitch: z.string(),
    for_who: z.array(z.string()),
    content: z.array(z.string()),
  })),
})

export const OptionsContentSchema = z.object({
  title: z.string(),
  items: z.array(z.string()),
  cta_label: z.string(),
})

export const TeamContentSchema = z.object({
  title: z.string(),
  members: z.array(z.object({
    key: z.string(),
    name: z.string(),
    img: z.string(),
    linkedin: z.string(),
    bios: z.array(z.string()),
  })),
})

export const ContactContentSchema = z.object({
  heading: z.string(),
  offices: z.array(z.object({
    city: z.string(),
    address_1: z.string(),
    address_2: z.string(),
  })),
  email_label: z.string(),
  email: z.string(),
  contacts: z.array(z.object({
    label: z.string(),
    phone: z.string(),
    phone_href: z.string(),
  })),
  form_heading: z.string(),
  form_heading_txt: z.string(),
})

export type MethodologyContent = z.infer<typeof MethodologyContentSchema>
export type DeliverablesContent = z.infer<typeof DeliverablesContentSchema>
export type OffersContent = z.infer<typeof OffersContentSchema>
export type OptionsContent = z.infer<typeof OptionsContentSchema>
export type TeamContent = z.infer<typeof TeamContentSchema>
export type ContactContent = z.infer<typeof ContactContentSchema>
```

**Règle absolue : zéro `as unknown as XxxContent` dans ce sprint ni dans les
fichiers modifiés. Toujours `XxxSchema.safeParse(content[locale])`.**

---

## 2. Modifier `src/lib/sections/fetch-homepage.ts`

Le fetch existant retourne `content: Record<string, unknown>` — shape
monolingue. La nouvelle shape en DB est `content: { fr: {...}, en: {...} }`.

Le fetch **ne résout pas** le locale — il retourne le `content` brut avec
l'enveloppe i18n. La résolution se fait dans `page.tsx`.

Modifier le type de retour pour refléter ça :

```ts
export interface RawPageSection {
  id: string
  page_id: string
  type: string
  order_index: number
  is_visible: boolean
  content: Record<string, Record<string, unknown>>  // { fr: {...}, en: {...} }
}
```

Renommer `PageSection` → `RawPageSection` dans ce fichier (ou créer le nouveau
type en parallèle si `PageSection` est importé ailleurs — adapter les imports).
La fonction `fetchHomepageSections` retourne `Promise<RawPageSection[]>`.

---

## 3. Modifier `src/app/[locale]/(public)/page.tsx`

C'est ici que le locale est résolu. Pour chaque section :

```ts
const rawContent = section.content[locale] ?? section.content['fr'] // fallback fr
```

Puis `XxxSchema.safeParse(rawContent)`.

La page doit importer et rendre **toutes** les sections dans l'ordre
`order_index` :

```tsx
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const sections = await fetchHomepageSections()

  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {sections.map((section) => {
        const raw = section.content[locale] ?? section.content['fr']
        switch (section.type) {
          case 'hero': {
            const p = HeroContentSchema.safeParse(raw)
            return p.success ? <HeroSection key={section.id} content={p.data} /> : null
          }
          case 'value_prop': {
            const p = ValuePropContentSchema.safeParse(raw)
            return p.success ? <ValuePropSection key={section.id} content={p.data} /> : null
          }
          case 'social_proof': {
            const p = SocialProofContentSchema.safeParse(raw)
            return p.success ? <SocialProofSection key={section.id} content={p.data} /> : null
          }
          case 'problem_solution': {
            const p = ProblemSolutionContentSchema.safeParse(raw)
            return p.success ? <ProblemSolutionSection key={section.id} content={p.data} /> : null
          }
          case 'methodology': {
            const p = MethodologyContentSchema.safeParse(raw)
            return p.success ? <MethodologySection key={section.id} content={p.data} /> : null
          }
          case 'deliverables': {
            const p = DeliverablesContentSchema.safeParse(raw)
            return p.success ? <DeliverablesSection key={section.id} content={p.data} /> : null
          }
          case 'offers': {
            const p = OffersContentSchema.safeParse(raw)
            return p.success ? <OffersSection key={section.id} content={p.data} /> : null
          }
          case 'options': {
            const p = OptionsContentSchema.safeParse(raw)
            return p.success ? (
              <OptionsSection key={section.id} content={p.data} />
            ) : null
          }
          case 'team': {
            const p = TeamContentSchema.safeParse(raw)
            return p.success ? <TeamSection key={section.id} content={p.data} /> : null
          }
          case 'contact': {
            const p = ContactContentSchema.safeParse(raw)
            return p.success ? (
              <section key={section.id} id="contact" className="border-t border-[#444444]">
                <ContactSection content={p.data} />
              </section>
            ) : null
          }
          default:
            return null
        }
      })}
    </main>
  )
}
```

**Conserver exactement le markup, les classes Tailwind et les `id` existants.**
Ne pas redesigner.

---

## 4. Convertir les composants de section

Pour chaque composant listé ci-dessous : supprimer `getTranslations`, ajouter
une prop `content` typée, adapter le JSX. Le **markup et les classes Tailwind
ne bougent pas** — seule la source des données change.

### `src/components/sections/MethodologySection.tsx`

```ts
interface Props { content: MethodologyContent }
export async function MethodologySection({ content }: Props) { … }
```

- `t('methodology.title')` → `content.title`
- Steps : `content.steps[n-1].title`, `content.steps[n-1].desc`
- `t('target.title')` → `content.target_title`
- `t('target.intro')` → `content.target_intro`
- Items cible : `content.target_items[i]`
- Retirer `'use server'` s'il y en a un ; le composant peut rester `async` ou
  devenir sync (pas de `await` sans `getTranslations`)

### `src/components/sections/DeliverablesSection.tsx`

```ts
interface Props { content: DeliverablesContent }
export async function DeliverablesSection({ content }: Props) { … }
```

- La liste `items` est désormais `content.items`
- `t('title')` → `content.title`
- `t(`${key}_title`)` → `item.title`
- Bullets : `item.bullets[i]`

### `src/components/sections/OffersSection.tsx`

```ts
interface Props { content: OffersContent }
export async function OffersSection({ content }: Props) { … }
```

- La liste `offers` est désormais `content.offers`
- `t('intro')` → `content.intro`
- `t('title')` → `content.title`
- `t('for_who_label')` → `content.for_who_label`
- `t('content_label')` → `content.content_label`
- `t('cta')` → `content.cta_label`
- Par offre : `.name`, `.price`, `.tagline`, `.pitch`, `.for_who[i]`, `.content[i]`

### `src/components/sections/OptionsSection.tsx`

```ts
interface Props { content: OptionsContent }
export async function OptionsSection({ content }: Props) { … }
```

- `t('title')` → `content.title`
- Items : `content.items[i]`
- `t('cta')` → `content.cta_label`

### `src/components/sections/TeamSection.tsx`

```ts
interface Props { content: TeamContent }
export async function TeamSection({ content }: Props) { … }
```

- `t('title')` → `content.title`
- Members : `content.members` (img, linkedin, bios sont dans le content)
- Les bios contiennent du HTML (`<strong>`) — utiliser `dangerouslySetInnerHTML`
  comme suit pour chaque bio :
  ```tsx
  <p key={i} dangerouslySetInnerHTML={{ __html: bio }} />
  ```
  Le contenu vient du CMS interne — pas de risque XSS externe.
- `t.rich(bioKey, { strong: … })` est remplacé par `dangerouslySetInnerHTML`

### `src/components/contact/ContactSection.tsx`

```ts
interface ContactSectionProps {
  content: ContactContent
  headingLevel?: 'h1' | 'h2'
  autoFocus?: boolean
}
export default async function ContactSection({
  content,
  headingLevel: Tag = 'h2',
  autoFocus,
}: ContactSectionProps) { … }
```

- `t('heading')` → `content.heading`
- Offices : boucler sur `content.offices`
- `t('email_label')` → `content.email_label`
- `t('email')` → `content.email`
- Contacts directs : boucler sur `content.contacts` (label, phone, phone_href)
- `t('form_heading')` → `content.form_heading`
- `t('form_heading_txt')` → `content.form_heading_txt`
- Supprimer l'import `getTranslations`
- `ContactForm` reçoit toujours `autoFocus={autoFocus}` — ne pas modifier
  `ContactForm.tsx` ni `contact.form.*` dans les messages

**Note :** La page `/contact` (`src/app/[locale]/(public)/contact/page.tsx`)
passe actuellement `headingLevel="h1"` à `ContactSection`. Elle devra aussi lui
passer `content`. Dans ce sprint, la page `/contact` fetch elle-même la section
contact depuis `page_sections` (requête Supabase directe, même pattern que
`fetchHomepageSections` mais pour une seule section). Voir section 6.

---

## 5. SiteFooter → `site_settings`

### 5a. Migration SQL

**Fichier :** `supabase/migrations/20260418000022_site_settings_footer.sql`

```sql
-- Nouvelles clés site_settings pour le footer public
-- Les valeurs sont des chaînes JSON (pour supporter les tableaux et objets)

INSERT INTO settings (key, value) VALUES
  ('footer_copyright_fr', '"©2026 thinktwice. Tous droits réservés."'),
  ('footer_copyright_en', '"©2026 thinktwice. All rights reserved."'),
  ('footer_legal_links',  '[
    {"label_fr":"Mentions légales","label_en":"Legal notice","href_fr":"/fr/mentions-legales","href_en":"/en/legal"},
    {"label_fr":"Conditions d''utilisation","label_en":"Terms of use","href_fr":"/fr/conditions-utilisation","href_en":"/en/terms"},
    {"label_fr":"Politique de confidentialité","label_en":"Privacy policy","href_fr":"/fr/politique-confidentialite","href_en":"/en/privacy"}
  ]')
ON CONFLICT (key) DO NOTHING;
```

**Note :** La table `settings` est dans le schéma `public` et a une RLS admin.
Pour la lecture publique du footer, ajouter une policy `SELECT` publique sur
les clés préfixées `footer_` :

```sql
CREATE POLICY "settings_public_footer_read"
  ON settings
  FOR SELECT
  USING (key LIKE 'footer_%');
```

### 5b. `src/lib/settings/fetchFooterSettings.ts` (nouveau fichier)

```ts
import { createClient } from '@supabase/supabase-js'

export interface FooterLegalLink {
  label_fr: string
  label_en: string
  href_fr: string
  href_en: string
}

export interface FooterSettings {
  copyright: { fr: string; en: string }
  legalLinks: FooterLegalLink[]
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
  )

  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['footer_copyright_fr', 'footer_copyright_en', 'footer_legal_links'])

  const row = (key: string) => data?.find((r) => r.key === key)?.value ?? 'null'

  return {
    copyright: {
      fr: JSON.parse(row('footer_copyright_fr')) as string,
      en: JSON.parse(row('footer_copyright_en')) as string,
    },
    legalLinks: JSON.parse(row('footer_legal_links')) as FooterLegalLink[],
  }
}
```

### 5c. `src/components/SiteFooter.tsx` — modifier

- Remplacer `getTranslations('footer')` par `fetchFooterSettings()`
- `t('copyright')` → `settings.copyright[locale]`
- Les 3 liens légaux hardcodés → boucler sur `settings.legalLinks` :
  ```tsx
  settings.legalLinks.map((link) => (
    <Link key={link.href_fr} href={link[`href_${locale}` as 'href_fr' | 'href_en']}>
      {link[`label_${locale}` as 'label_fr' | 'label_en']}
    </Link>
  ))
  ```
- Conserver exactement le markup et les classes Tailwind existants

---

## 6. Page `/contact` — fetch de la section contact

**Fichier :** `src/app/[locale]/(public)/contact/page.tsx`

La page contact affiche `ContactSection` avec `headingLevel="h1"`. Elle doit
désormais lui fournir `content`. Fetch de la section depuis `page_sections` :

```ts
import { createClient } from '@supabase/supabase-js'
import { ContactContentSchema } from '@/lib/cms/schemas'

// Dans le composant page :
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
)

const { data } = await supabase
  .from('page_sections')
  .select('content')
  .eq('type', 'contact')
  .is('deleted_at', null)
  .single()

const rawContent = data?.content?.[locale] ?? data?.content?.['fr']
const parsed = ContactContentSchema.safeParse(rawContent)
if (!parsed.success) notFound()

return <ContactSection content={parsed.data} headingLevel="h1" autoFocus />
```

---

## 7. Seed SQL — contenu initial bilingue

**Fichier :** `supabase/seed-sections.sql` — compléter avec les nouvelles sections

Ajouter après les 4 sections existantes. Le `page_id` est
`'00000020-0000-0000-0000-000000000001'` (homepage, cf. seed existante).

Chaque section a `content` au format `{ "fr": { … }, "en": { … } }`.

Les valeurs ci-dessous sont tirées exactement de `fr.json` et `en.json` actuels.

```sql
INSERT INTO page_sections (page_id, type, order_index, content, is_visible) VALUES

-- Mettre à jour les 4 sections existantes pour leur ajouter l'enveloppe i18n
-- (UPDATE ou ON CONFLICT DO UPDATE selon ce qui est plus propre)

-- methodology (order_index 4)
(
  '00000020-0000-0000-0000-000000000001',
  'methodology',
  4,
  '{
    "fr": {
      "title": "Méthodologie",
      "steps": [
        {"title": "Cadrage", "desc": "Compréhension de votre activité, objectifs, cibles"},
        {"title": "UX & structure", "desc": "Arborescence, parcours utilisateur"},
        {"title": "Design", "desc": "Maquettes sur mesure (PSD/Figma)"},
        {"title": "Développement", "desc": "Intégration WordPress propre et performante"},
        {"title": "Mise en ligne", "desc": "Tests, SEO de base, accompagnement"}
      ],
      "target_title": "Pour qui ?",
      "target_intro": "Nous travaillons principalement avec :",
      "target_items": ["cabinets (avocats, conseil, IT)", "PME / ETI", "indépendants exigeants", "startups"]
    },
    "en": {
      "title": "Methodology",
      "steps": [
        {"title": "Scoping", "desc": "Understanding your business, objectives and target audience"},
        {"title": "UX & structure", "desc": "Sitemap, user journey"},
        {"title": "Design", "desc": "Custom mockups (PSD/Figma)"},
        {"title": "Development", "desc": "Clean, performant WordPress integration"},
        {"title": "Launch", "desc": "Testing, basic SEO, onboarding"}
      ],
      "target_title": "Who is this for?",
      "target_intro": "We mainly work with:",
      "target_items": ["law & consulting firms", "SMEs", "demanding independents", "startups"]
    }
  }',
  true
),

-- deliverables (order_index 5)
(
  '00000020-0000-0000-0000-000000000001',
  'deliverables',
  5,
  '{
    "fr": {
      "title": "Ce que vous obtenez",
      "items": [
        {"key": "wp", "title": "site WordPress sur mesure", "bullets": ["design unique (pas de template)", "responsive (mobile / tablette / desktop)"]},
        {"key": "ux", "title": "expérience utilisateur optimisée", "bullets": ["navigation claire", "parcours utilisateur pensé"]},
        {"key": "perf", "title": "performance technique", "bullets": ["rapidité de chargement", "code propre", "SEO technique"]},
        {"key": "auto", "title": "autonomie", "bullets": ["back-office simple", "formation incluse"]}
      ]
    },
    "en": {
      "title": "What you get",
      "items": [
        {"key": "wp", "title": "custom WordPress site", "bullets": ["unique design (no template)", "responsive (mobile / tablet / desktop)"]},
        {"key": "ux", "title": "optimised user experience", "bullets": ["clear navigation", "thought-through user journey"]},
        {"key": "perf", "title": "technical performance", "bullets": ["fast load times", "clean code", "technical SEO"]},
        {"key": "auto", "title": "autonomy", "bullets": ["simple back-office", "training included"]}
      ]
    }
  }',
  true
),

-- offers (order_index 6)
(
  '00000020-0000-0000-0000-000000000001',
  'offers',
  6,
  '{
    "fr": {
      "title": "Nos offres",
      "intro": "Nous concevons des identités digitales qui transforment la perception d''une marque",
      "cta_label": "Je choisis cette offre",
      "for_who_label": "Pour qui",
      "content_label": "Contenu",
      "offers": [
        {
          "slug": "essentiel",
          "name": "essentiel",
          "price": "2 900 — 3 900 €",
          "tagline": "→ poser une base",
          "pitch": "On pose une base propre, cohérente, crédible — sans surproduire.",
          "for_who": ["TPE / indépendant", "besoin rapide mais propre", "première vraie présence"],
          "content": ["direction artistique light (univers visuel + typo + couleurs)", "template WordPress premium (customisé proprement)", "4 à 6 pages", "responsive", "SEO de base (structure + balises)", "intégration contenu"]
        },
        {
          "slug": "signature",
          "name": "signature",
          "price": "4 900 — 7 500 €",
          "tagline": "→ construire une image",
          "pitch": "On ne crée pas un site. On construit une expérience qui renforce votre image et votre crédibilité.",
          "for_who": ["PME", "cabinet / conseil / services", "marques qui veulent monter en gamme"],
          "content": ["direction artistique complète", "UX design (parcours utilisateur réfléchi)", "maquettes sur-mesure (PSD/Figma)", "WordPress sur mesure (pas juste un thème)", "6 à 10 pages", "SEO structuré", "animations légères (motion UI)", "guidelines graphiques livrées"]
        },
        {
          "slug": "premium",
          "name": "premium",
          "price": "9 000 — 15 000 €",
          "tagline": "→ créer un levier",
          "pitch": "On aligne votre image, votre discours et votre business. Le site devient un levier, pas un support.",
          "for_who": ["marques ambitieuses", "repositionnement", "lancement stratégique"],
          "content": ["atelier stratégique (positionnement, discours)", "direction artistique avancée", "UX approfondie (conversion, storytelling)", "design sur-mesure poussé", "développement WordPress avancé", "SEO + structure éditoriale", "micro-interactions / motion design", "accompagnement lancement"]
        }
      ]
    },
    "en": {
      "title": "Our offers",
      "intro": "We design digital identities that transform brand perception",
      "cta_label": "I choose this offer",
      "for_who_label": "For who",
      "content_label": "What''s included",
      "offers": [
        {
          "slug": "essentiel",
          "name": "essential",
          "price": "€2,900 — €3,900",
          "tagline": "→ lay a foundation",
          "pitch": "We lay a clean, coherent, credible foundation — without over-producing.",
          "for_who": ["sole traders / micro-businesses", "fast but clean brief", "first real online presence"],
          "content": ["light art direction (visual universe + typography + colours)", "premium WordPress template (properly customised)", "4 to 6 pages", "responsive", "basic SEO (structure + tags)", "content integration"]
        },
        {
          "slug": "signature",
          "name": "signature",
          "price": "€4,900 — €7,500",
          "tagline": "→ build an image",
          "pitch": "We don''t create a site. We build an experience that strengthens your image and credibility.",
          "for_who": ["SMEs", "law / consulting / services firms", "brands looking to move upmarket"],
          "content": ["full art direction", "UX design (thought-through user journey)", "custom mockups (PSD/Figma)", "custom WordPress (not just a theme)", "6 to 10 pages", "structured SEO", "light animations (motion UI)", "graphic guidelines delivered"]
        },
        {
          "slug": "premium",
          "name": "premium",
          "price": "€9,000 — €15,000",
          "tagline": "→ create a lever",
          "pitch": "We align your image, your voice and your business. The site becomes a lever, not a support.",
          "for_who": ["ambitious brands", "repositioning", "strategic launch"],
          "content": ["strategic workshop (positioning, messaging)", "advanced art direction", "deep UX (conversion, storytelling)", "high-end custom design", "advanced WordPress development", "SEO + editorial structure", "micro-interactions / motion design", "launch support"]
        }
      ]
    }
  }',
  true
),

-- options (order_index 7)
(
  '00000020-0000-0000-0000-000000000001',
  'options',
  7,
  '{
    "fr": {
      "title": "Pour aller plus loin / options",
      "items": ["Rédaction SEO : 800 € → 2 000 €", "Identité visuelle complète : 1 500 € → 3 000 €", "Maintenance mensuelle : 80 € → 250 € / mois", "Optimisation conversion : 500 € → 1 500 €", "Formation client : 300 € → 800 €"],
      "cta_label": "Discutons de votre projet"
    },
    "en": {
      "title": "Going further / options",
      "items": ["SEO copywriting: €800 → €2,000", "Full visual identity: €1,500 → €3,000", "Monthly maintenance: €80 → €250 / month", "Conversion optimisation: €500 → €1,500", "Client training: €300 → €800"],
      "cta_label": "Let''s discuss your project"
    }
  }',
  true
),

-- team (order_index 8)
(
  '00000020-0000-0000-0000-000000000001',
  'team',
  8,
  '{
    "fr": {
      "title": "Qui nous sommes",
      "members": [
        {
          "key": "ss",
          "name": "Stéphane S.",
          "img": "/images/thinktwice-ss.png",
          "linkedin": "https://www.linkedin.com/in/stephanesokol/details/recommendations/",
          "bios": [
            "Directeur artistique digital senior et auteur. Fort de près de trente ans d''expérience, dont quinze en agences et quatorze en indépendant, il conçoit <strong>des identités et des expériences digitales exigeantes.</strong>",
            "Son approche privilégie la cohérence, la lisibilité et l''impact, en alignant image, discours et usage.",
            "<strong>Spécialiste du branding et du design d''interfaces,</strong> il intervient sur des projets variés, de la refonte stratégique au lancement de marque.",
            "En parallèle, son travail d''écriture nourrit <strong>une vision sensible et rigoureuse.</strong>"
          ]
        },
        {
          "key": "sr",
          "name": "Stéphane R.",
          "img": "/images/thinktwice-sr.png",
          "linkedin": "https://www.linkedin.com/in/rochard/details/recommendations/",
          "bios": [
            "Concepteur développeur web fort de plus de vingt ans d''expérience, il conjugue <strong>développement, pilotage de projets</strong> et expertise WordPress, PHP, NodeJS et architectures web.",
            "Il conçoit des plateformes robustes, optimise l''existant et intervient sur des environnements sensibles, du front au back, avec une attention particulière portée à <strong>la performance, la qualité, la fiabilité et la maintenabilité des systèmes.</strong>",
            "Il évolue avec grâce dans des contextes techniques exigeants et sait concevoir des solutions <strong>aux besoins et aux contraintes métier.</strong>"
          ]
        }
      ]
    },
    "en": {
      "title": "Who we are",
      "members": [
        {
          "key": "ss",
          "name": "Stéphane S.",
          "img": "/images/thinktwice-ss.png",
          "linkedin": "https://www.linkedin.com/in/stephanesokol/details/recommendations/",
          "bios": [
            "Senior digital art director and author. With nearly thirty years of experience, fifteen in agencies and fourteen as an independent, he creates <strong>demanding digital identities and experiences.</strong>",
            "His approach prioritises consistency, legibility and impact, aligning image, message and use.",
            "<strong>A specialist in branding and interface design,</strong> he works on varied projects, from strategic rebrands to brand launches.",
            "In parallel, his writing practice nurtures <strong>a sensitive and rigorous vision.</strong>"
          ]
        },
        {
          "key": "sr",
          "name": "Stéphane R.",
          "img": "/images/thinktwice-sr.png",
          "linkedin": "https://www.linkedin.com/in/rochard/details/recommendations/",
          "bios": [
            "Web developer and designer with over twenty years of experience, combining <strong>development, project management</strong> and expertise in WordPress, PHP, NodeJS and web architectures.",
            "He builds robust platforms, optimises existing systems and works in sensitive environments, front to back, with particular attention to <strong>performance, quality, reliability and system maintainability.</strong>",
            "He navigates demanding technical contexts with ease and designs solutions <strong>tailored to business needs and constraints.</strong>"
          ]
        }
      ]
    }
  }',
  true
),

-- contact (order_index 9)
(
  '00000020-0000-0000-0000-000000000001',
  'contact',
  9,
  '{
    "fr": {
      "heading": "Contactez-nous",
      "offices": [
        {"city": "Paris", "address_1": "37 quater avenue du Maréchal Foch", "address_2": "77370 Nangis"},
        {"city": "Nîmes", "address_1": "6 rue Massillon", "address_2": "30000 Nîmes"}
      ],
      "email_label": "E-mail :",
      "email": "thinktwice@sokol.fr",
      "contacts": [
        {"label": "Contactez Stéphane Sokol directement", "phone": "+33 (0)6 87 43 42 94", "phone_href": "tel:+33687434294"},
        {"label": "Contactez Stéphane Rochard directement", "phone": "+33 (0)6 23 71 18 12", "phone_href": "tel:+33623711812"}
      ],
      "form_heading": "Faîtes-nous part de votre besoin",
      "form_heading_txt": "Décrivez brièvement votre projet, et merci d''indiquer votre numéro de téléphone dans le corps de votre message si vous préférez être contacté·e par téléphone"
    },
    "en": {
      "heading": "Contact us",
      "offices": [
        {"city": "Paris", "address_1": "37 quater avenue du Maréchal Foch", "address_2": "77370 Nangis"},
        {"city": "Nîmes", "address_1": "6 rue Massillon", "address_2": "30000 Nîmes"}
      ],
      "email_label": "Email:",
      "email": "thinktwice@sokol.fr",
      "contacts": [
        {"label": "Contact Stéphane Sokol directly", "phone": "+33 (0)6 87 43 42 94", "phone_href": "tel:+33687434294"},
        {"label": "Contact Stéphane Rochard directly", "phone": "+33 (0)6 23 71 18 12", "phone_href": "tel:+33623711812"}
      ],
      "form_heading": "Tell us about your project",
      "form_heading_txt": "Describe your project, and include your phone number if you''d prefer to be reached by phone"
    }
  }',
  true
)

ON CONFLICT DO NOTHING;
```

**Important :** les 4 sections existantes (`hero`, `value_prop`, `social_proof`,
`problem_solution`) ont actuellement un `content` monolingue (sans enveloppe
`fr`/`en`). Les migrer vers la nouvelle shape en ajoutant des `UPDATE` dans
cette même migration ou dans un fichier séparé
`supabase/migrations/20260418000023_wrap_existing_sections_i18n.sql` :

```sql
-- Envelopper le contenu monolingue existant dans { "fr": …, "en": … }
-- À adapter selon le contenu réel en base (vérifier avant d'appliquer)

UPDATE page_sections
SET content = jsonb_build_object('fr', content, 'en', content)
WHERE page_id = '00000020-0000-0000-0000-000000000001'
  AND type IN ('hero', 'value_prop', 'social_proof', 'problem_solution')
  AND content ? 'tagline_top'  -- guard : s'assurer que c'est l'ancienne shape
;
-- Répéter avec des guards adaptés à chaque type si nécessaire
-- Puis mettre à jour le contenu EN manuellement via le backoffice
```

---

## 8. Nettoyage `messages/`

**Fichiers :** `messages/fr.json` et `messages/en.json`

Supprimer les namespaces suivants intégralement :
- `home` (toutes les sous-clés)
- `about` (toutes les sous-clés)
- `contact` — **sauf** `contact.form` qui reste
- `footer`
- `legal`

Conserver : `common`, `auth`, `admin`, `customer`, `cms`, `contact.form`

Le résultat de `contact` après nettoyage :
```json
"contact": {
  "form": { … }  // uniquement cette sous-clé
}
```

---

## 9. `src/lib/homepage-fallback.ts` — mettre à jour

Le fallback statique doit refléter la nouvelle shape `{ fr: {…}, en: {…} }`.
Mettre à jour les 4 sections existantes et ajouter les 5 nouvelles.

Les valeurs `en` des sections existantes sont actuellement identiques aux `fr`
(traduction à faire ultérieurement via le backoffice). Ce n'est pas un problème
pour ce sprint.

---

## Contraintes

- `tsc --noEmit` doit passer sans erreur
- Ne pas modifier `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`
- Ne pas installer de nouvelles dépendances
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — ne pas supposer le nom standard
- `src/lib/resend/index.ts` existe déjà — ne pas recréer
- Zéro `as unknown as XxxContent` dans les fichiers créés ou modifiés
- Les composants `ContactForm.tsx` et `contact.form.*` dans les messages
  ne bougent pas
- Le markup et les classes Tailwind des composants de section sont conservés
  à l'identique — seule la source des données change

---

## Livrable attendu — fichiers créés ou modifiés

| Fichier | Action |
|---|---|
| `src/types/page-sections.ts` | Modifié — nouveaux types + `SectionType` étendu |
| `src/lib/cms/schemas.ts` | Modifié — 6 nouveaux schémas Zod |
| `src/lib/sections/fetch-homepage.ts` | Modifié — `RawPageSection` avec enveloppe i18n |
| `src/lib/homepage-fallback.ts` | Modifié — shape `{fr,en}` + nouvelles sections |
| `src/lib/settings/fetchFooterSettings.ts` | Nouveau |
| `src/app/[locale]/(public)/page.tsx` | Modifié — switch complet sur toutes les sections |
| `src/app/[locale]/(public)/contact/page.tsx` | Modifié — fetch section contact |
| `src/components/sections/MethodologySection.tsx` | Modifié — prop `content` |
| `src/components/sections/DeliverablesSection.tsx` | Modifié — prop `content` |
| `src/components/sections/OffersSection.tsx` | Modifié — prop `content` |
| `src/components/sections/OptionsSection.tsx` | Modifié — prop `content` |
| `src/components/sections/TeamSection.tsx` | Modifié — prop `content` + `dangerouslySetInnerHTML` |
| `src/components/contact/ContactSection.tsx` | Modifié — prop `content` |
| `src/components/SiteFooter.tsx` | Modifié — `fetchFooterSettings` |
| `messages/fr.json` | Modifié — namespaces éditoriaux supprimés |
| `messages/en.json` | Modifié — namespaces éditoriaux supprimés |
| `supabase/seed-sections.sql` | Modifié — 5 nouvelles sections + contenu i18n |
| `supabase/migrations/20260418000022_site_settings_footer.sql` | Nouveau |
| `supabase/migrations/20260418000023_wrap_existing_sections_i18n.sql` | Nouveau |

`tsc --noEmit` doit passer en fin de sprint.
