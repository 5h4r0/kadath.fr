Prompt CC — Sprint Footer dynamique
## Contexte

Projet kadath.fr — Next.js 15 / Supabase / @supabase/ssr.

La clé `footer_legal_links` dans la table `settings` est actuellement un JSONB
plat avec label/href hardcodés. On la remplace par une vraie table relationnelle
`footer_legal_links` liée à `cms_pages`, avec deux zones (`legal` / `nav`) et un
`order_index` entier.

Ne pas modifier : `src/lib/supabase/server.ts`, `client.ts`, `middleware.ts`.
Ne pas installer de nouvelles dépendances.
`tsc --noEmit` doit passer sans erreur.

---

## Étape 1 — Migration

**Fichier :** `supabase/migrations/20260506000001_footer_legal_links_table.sql`

```sql
-- Supprimer l'ancienne clé settings
DELETE FROM settings WHERE key = 'footer_legal_links';

-- Créer la table
CREATE TABLE IF NOT EXISTS public.footer_legal_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cms_page_id   uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  zone          text NOT NULL CHECK (zone IN ('legal', 'nav')),
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.footer_legal_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "footer_legal_links: lecture publique"
  ON public.footer_legal_links FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "footer_legal_links: admin uniquement"
  ON public.footer_legal_links FOR ALL
  TO authenticated
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());
```

---

## Étape 2 — Seed

Dans `supabase/seed.sql`, remplacer le bloc :

```sql
  ('footer_legal_links', '[{"label_fr":"Mentions légales","label_en":"Legal notice","href_fr":"/fr/mentions-legales","href_en":"/en/legal-notices"},{"label_fr":"Politique de confidentialité","label_en":"Privacy policy","href_fr":"/fr/confidentialite","href_en":"/en/privacy"}]')
```

par :

```sql
  -- footer_legal_links migré vers table dédiée (voir seed footer_legal_links ci-dessous)
```

Puis ajouter après les inserts `cms_pages`, un bloc :

```sql
-- ─── Footer legal links ───────────────────────────────────────────────────
INSERT INTO public.footer_legal_links (cms_page_id, zone, order_index)
SELECT id, 'legal', 0 FROM public.cms_pages WHERE slug = 'mentions-legales'
ON CONFLICT DO NOTHING;

INSERT INTO public.footer_legal_links (cms_page_id, zone, order_index)
SELECT id, 'legal', 1 FROM public.cms_pages WHERE slug = 'confidentialite'
ON CONFLICT DO NOTHING;
```

Note : le slug `confidentialite` sera créé en Sprint C. Le `SELECT` retourne 0
lignes si la page n'existe pas encore — pas d'erreur.

---

## Étape 3 — Regénérer les types TS

```bash
supabase gen types typescript --local 2>/dev/null > src/types/supabase.ts
```

---

## Étape 4 — `fetchFooterSettings`

**Fichier :** `src/lib/settings/fetchFooterSettings.ts`

Réécrire entièrement :

```ts
import { createClient } from '@supabase/supabase-js'

export interface FooterLegalLink {
  id: string
  zone: 'legal' | 'nav'
  order_index: number
  slug: string
  title: string
}

export interface FooterSettings {
  copyright: { fr: string; en: string }
  legalLinks: FooterLegalLink[]
  navLinks: FooterLegalLink[]
}

export async function fetchFooterSettings(): Promise<FooterSettings> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '',
  )

  const [{ data: settingsData }, { data: linksData }] = await Promise.all([
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['footer_copyright_fr', 'footer_copyright_en']),
    supabase
      .from('footer_legal_links')
      .select('id, zone, order_index, cms_pages(slug, title)')
      .order('zone')
      .order('order_index'),
  ])

  const get = (key: string) =>
    settingsData?.find((r) => r.key === key)?.value ?? null

  const rawFr = get('footer_copyright_fr')
  const rawEn = get('footer_copyright_en')

  const allLinks: FooterLegalLink[] = (linksData ?? []).map((row) => {
    const page = Array.isArray(row.cms_pages) ? row.cms_pages[0] : row.cms_pages
    return {
      id: row.id,
      zone: row.zone as 'legal' | 'nav',
      order_index: row.order_index,
      slug: page?.slug ?? '',
      title: page?.title ?? '',
    }
  })

  return {
    copyright: {
      fr: rawFr ? (JSON.parse(rawFr) as string) : '',
      en: rawEn ? (JSON.parse(rawEn) as string) : '',
    },
    legalLinks: allLinks.filter((l) => l.zone === 'legal'),
    navLinks: allLinks.filter((l) => l.zone === 'nav'),
  }
}
```

---

## Étape 5 — `SiteFooter`

**Fichier :** `src/components/SiteFooter.tsx`

Remplacer le bloc `{settings.legalLinks.map(...)}` par :

```tsx
{settings.legalLinks.map((link) => (
  <Link
    key={link.id}
    href={`/${locale}/${link.slug}`}
    className="hover:text-tt-accent transition-colors whitespace-nowrap"
  >
    {link.title}
  </Link>
))}
```

Ajouter après la nav légale (render conditionnel) :

```tsx
{settings.navLinks.length > 0 && (
  <nav aria-label="Navigation footer" className="...">
    {settings.navLinks.map((link) => (
      <Link key={link.id} href={`/${locale}/${link.slug}`}>
        {link.title}
      </Link>
    ))}
  </nav>
)}
```

Supprimer l'import `FooterLegalLink` si plus utilisé dans ce fichier.

---

## Étape 6 — Backoffice : page de gestion

**Fichier :** `src/app/manage/(protected)/cms/footer/page.tsx`

Server Component. Charge les liens existants + la liste des cms_pages
disponibles. Rend un Client Component `FooterLinksEditor`.

```ts
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { FooterLinksEditor } from '@/components/manage/FooterLinksEditor'

export default async function FooterLinksPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [{ data: links }, { data: pages }] = await Promise.all([
    supabase
      .from('footer_legal_links')
      .select('id, zone, order_index, cms_pages(slug, title)')
      .order('zone')
      .order('order_index'),
    supabase
      .from('cms_pages')
      .select('id, slug, title')
      .order('title'),
  ])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-white">Footer — liens</h1>
      <FooterLinksEditor links={links ?? []} pages={pages ?? []} />
    </div>
  )
}
```

---

## Étape 7 — `FooterLinksEditor`

**Fichier :** `src/components/manage/FooterLinksEditor.tsx`

Client Component. Props :

```ts
interface LinkRow {
  id: string
  zone: string
  order_index: number
  cms_pages: { slug: string; title: string } | null
}

interface PageOption {
  id: string
  slug: string
  title: string
}

interface Props {
  links: LinkRow[]
  pages: PageOption[]
}
```

UI par zone (`legal` / `nav`) :
- Titre de zone (`Liens légaux` / `Navigation`)
- Pour chaque lien : titre de la page + input `order_index` (type number, min 0)
  + bouton "Supprimer" (appelle Server Action `removeFooterLink(id)`)
- Formulaire d'ajout : select parmi `pages` (filtré pour exclure déjà présents
  dans la zone) + zone radio/select + bouton "Ajouter"
- Style : shadcn/ui `Button`, `Input`, `Label`, `Select` — cohérent backoffice

---

## Étape 8 — Server Actions

**Fichier :** `src/app/manage/(protected)/cms/footer/actions.ts`

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addFooterLink(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const cms_page_id = formData.get('cms_page_id') as string
  const zone = formData.get('zone') as string
  const order_index = parseInt(formData.get('order_index') as string, 10) || 0

  await supabase
    .from('footer_legal_links')
    .insert({ cms_page_id, zone, order_index })

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout') // invalide SiteFooter côté vitrine
}

export async function removeFooterLink(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.from('footer_legal_links').delete().eq('id', id)

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout')
}

export async function updateFooterLinkOrder(id: string, order_index: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase
    .from('footer_legal_links')
    .update({ order_index })
    .eq('id', id)

  revalidatePath('/manage/cms/footer')
  revalidatePath('/', 'layout')
}
```

---

## Ordre d'exécution

1. Créer la migration `20260506000001`
2. `supabase db reset` (applique migration + seed)
3. `supabase gen types typescript --local 2>/dev/null > src/types/supabase.ts`
4. Réécrire `src/lib/settings/fetchFooterSettings.ts`
5. Modifier `src/components/SiteFooter.tsx`
6. Créer `src/app/manage/(protected)/cms/footer/page.tsx`
7. Créer `src/app/manage/(protected)/cms/footer/actions.ts`
8. Créer `src/components/manage/FooterLinksEditor.tsx`
9. `pnpm tsc --noEmit` — doit passer sans erreur

Point d'attention à transmettre à CC : le type retourné par Supabase pour la jointure cms_pages(slug, title) peut être un objet ou un tableau selon la version du client généré — le cast dans fetchFooterSettings gère les deux cas avec Array.isArray.