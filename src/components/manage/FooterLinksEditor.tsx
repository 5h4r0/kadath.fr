'use client'

import { useRef } from 'react'
import {
  addFooterLink,
  removeFooterLink,
  updateFooterLinkOrder,
} from '@/app/manage/(protected)/cms/footer/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LinkRow {
  id: string
  zone: string
  order_index: number
  cms_pages: { slug: string; title: string } | { slug: string; title: string }[] | null
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

function getPageTitle(cms_pages: LinkRow['cms_pages']): string {
  if (!cms_pages) return '—'
  if (Array.isArray(cms_pages)) return cms_pages[0]?.title ?? '—'
  return cms_pages.title
}

function ZoneSection({
  zone,
  label,
  links,
  pages,
}: {
  zone: 'legal' | 'nav'
  label: string
  links: LinkRow[]
  pages: PageOption[]
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const existingPageIds = links.map((l) => {
    const page = Array.isArray(l.cms_pages) ? l.cms_pages[0] : l.cms_pages
    return page?.slug ?? ''
  })
  const availablePages = pages.filter((p) => !existingPageIds.includes(p.slug))

  return (
    <section className="space-y-4">
      <h2 className="text-base font-medium text-white/80">{label}</h2>

      {links.length === 0 && <p className="text-sm text-white/40">Aucun lien dans cette zone.</p>}

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id} className="flex items-center gap-3">
            <span className="flex-1 text-sm text-white/70">{getPageTitle(link.cms_pages)}</span>
            <form
              action={async (fd) => {
                await updateFooterLinkOrder(
                  link.id,
                  parseInt(fd.get('order_index') as string, 10) || 0,
                )
              }}
              className="flex items-center gap-2"
            >
              <Label htmlFor={`order-${link.id}`} className="sr-only">
                Ordre
              </Label>
              <Input
                id={`order-${link.id}`}
                name="order_index"
                type="number"
                min={0}
                defaultValue={link.order_index}
                className="w-16 h-8 text-sm"
              />
              <Button type="submit" variant="outline" size="sm">
                OK
              </Button>
            </form>
            <form
              action={async () => {
                await removeFooterLink(link.id)
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Supprimer
              </Button>
            </form>
          </li>
        ))}
      </ul>

      {availablePages.length > 0 && (
        <form
          ref={formRef}
          action={async (fd) => {
            await addFooterLink(fd)
            formRef.current?.reset()
          }}
          className="flex items-end gap-3 pt-2 border-t border-white/10"
        >
          <input type="hidden" name="zone" value={zone} />
          <div className="flex flex-col gap-1">
            <Label htmlFor={`page-${zone}`} className="text-xs text-white/50">
              Page
            </Label>
            <select
              id={`page-${zone}`}
              name="cms_page_id"
              required
              className="h-9 rounded-md border border-white/20 bg-tt-bg px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-tt-accent"
            >
              <option value="">Choisir une page…</option>
              {availablePages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`order-new-${zone}`} className="text-xs text-white/50">
              Ordre
            </Label>
            <Input
              id={`order-new-${zone}`}
              name="order_index"
              type="number"
              min={0}
              defaultValue={links.length}
              className="w-16 h-9 text-sm"
            />
          </div>
          <Button type="submit" size="sm">
            Ajouter
          </Button>
        </form>
      )}
    </section>
  )
}

export function FooterLinksEditor({ links, pages }: Props) {
  const legalLinks = links.filter((l) => l.zone === 'legal')
  const navLinks = links.filter((l) => l.zone === 'nav')

  return (
    <div className="space-y-10">
      <ZoneSection zone="legal" label="Liens légaux" links={legalLinks} pages={pages} />
      <ZoneSection zone="nav" label="Navigation" links={navLinks} pages={pages} />
    </div>
  )
}
