'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

type Reference = {
  url: string
  name: string
  image: string
  description: string
}

const references: Reference[] = [
  {
    url: 'https://sokol.fr/project/a1-cloud-technologies-site-et-direction-artistique/',
    name: 'A1 cloud',
    image: '/images/projects/a1-cloud.jpg',
    description: 'CMS maison',
  },
  {
    url: 'https://sokol.fr/project/lesaffre-refonte-du-site-corporate/',
    name: 'lesaffre',
    image: '/images/projects/lesaffre.jpg',
    description: 'Prospection, reco WordPress',
  },
  {
    url: 'https://sokol.fr/project/michelin-campagnes-thematiques-assets-digitaux/',
    name: 'michelin europe',
    image: '/images/projects/michelin-europe.jpg',
    description: 'campagnes Flash',
  },
  {
    url: 'https://sokol.fr/project/orsay-avocats-refonte-de-lidentite-et-du-site/',
    name: 'orsay avocats',
    image: '/images/projects/orsay-avocats.jpg',
    description: 'Site WordPress',
  },
  {
    url: 'https://sokol.fr/project/a1-cloud-technologies-site-et-direction-artistique/',
    name: 'A1 cloud',
    image: '/images/projects/a1-cloud.jpg',
    description: 'CMS maison',
  },
  {
    url: 'https://sokol.fr/project/lesaffre-refonte-du-site-corporate/',
    name: 'lesaffre',
    image: '/images/projects/lesaffre.jpg',
    description: 'Prospection, reco WordPress',
  },
  {
    url: 'https://sokol.fr/project/michelin-campagnes-thematiques-assets-digitaux/',
    name: 'michelin europe',
    image: '/images/projects/michelin-europe.jpg',
    description: 'campagnes Flash',
  },
  {
    url: 'https://sokol.fr/project/orsay-avocats-refonte-de-lidentite-et-du-site/',
    name: 'orsay avocats',
    image: '/images/projects/orsay-avocats.jpg',
    description: 'Site WordPress',
  },
]

const ITEMS_PER_PAGE = 4
const PAGE_COUNT = Math.ceil(references.length / ITEMS_PER_PAGE)

export function ReferencesSliderSection() {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Reference | null>(null)

  const visible = references.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE)

  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#333333]">
        {/* Motif dots */}
        <div
          className="motif-dots pointer-events-none absolute opacity-30 inset-0"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-16">
          {/* Grille 4 colonnes */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {visible.map((ref) => (
              <article key={ref.url}>
                <button
                  type="button"
                  onClick={() => setSelected(ref)}
                  className="group flex flex-col gap-3 cursor-pointer text-left w-full"
                >
                  {/* Nom client */}
                  <h3 className="font-grotesk text-xl font-bold uppercase leading-tight text-white md:text-2xl">
                    {ref.name}
                  </h3>

                  {/* Thumbnail */}
                  <div className="relative aspect-4/3 w-full overflow-hidden border border-white/10">
                    <Image
                      src={ref.image}
                      alt={ref.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                      className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </div>

                  {/* Description projet */}
                  <p className="font-light text-sm leading-tight text-white md:text-lg">
                    {ref.description}
                  </p>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors group-hover:text-[#26e1b0]">
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                    voir le cas
                  </span>
                </button>
              </article>
            ))}
          </div>

          {/* Pagination dots */}
          {PAGE_COUNT > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: PAGE_COUNT }, (_, i) => i).map((i) => (
                <button
                  key={`page-dot-${i}`}
                  type="button"
                  aria-pressed={i === page}
                  aria-label={`Page ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={[
                    'h-3 w-3 transition-colors',
                    i === page ? 'bg-[#26e1b0]' : 'bg-white/30 hover:bg-white/60',
                  ].join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal iframe */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className="h-[90vh] max-w-[90vw] p-0 overflow-hidden bg-black"
        >
          <VisuallyHidden>
            <DialogTitle>{selected?.name}</DialogTitle>
          </VisuallyHidden>
          {selected && (
            <iframe
              src={selected.url}
              className="w-full h-full border-0"
              title={selected.name}
              loading="lazy"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
