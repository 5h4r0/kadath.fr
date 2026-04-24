'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Reference = {
  slug: string
  name: string
  image: string
}

const references: Reference[] = [
  { slug: 'a1-cloud-1', name: 'A1 cloud', image: '/images/projects/a1-cloud.jpg' },
  { slug: 'lesaffre-1', name: 'lesaffre', image: '/images/projects/lesaffre.jpg' },
  {
    slug: 'michelin-europe-1',
    name: 'michelin europe',
    image: '/images/projects/michelin-europe.jpg',
  },
  { slug: 'orsay-avocats-1', name: 'orsay avocats', image: '/images/projects/orsay-avocats.jpg' },
  { slug: 'a1-cloud-2', name: 'A1 cloud', image: '/images/projects/a1-cloud.jpg' },
  { slug: 'lesaffre-2', name: 'lesaffre', image: '/images/projects/lesaffre.jpg' },
  {
    slug: 'michelin-europe-2',
    name: 'michelin europe',
    image: '/images/projects/michelin-europe.jpg',
  },
  { slug: 'orsay-avocats-2', name: 'orsay avocats', image: '/images/projects/orsay-avocats.jpg' },
]

const ITEMS_PER_PAGE = 4
const PAGE_COUNT = Math.ceil(references.length / ITEMS_PER_PAGE)

export function ReferencesSliderSection() {
  const [page, setPage] = useState(0)

  const visible = references.slice(page * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE + ITEMS_PER_PAGE)

  return (
    <section className="relative w-full overflow-hidden bg-[#333333]">
      {/* Motif dots */}
      <div
        className="motif-dots pointer-events-none absolute opacity-30 inset-0"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-screen-xl px-6 py-16 md:px-10 lg:px-16">
        {/* Grille 4 colonnes */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((ref) => (
            <article key={ref.slug} className="flex flex-col gap-3">
              {/* Nom client */}
              <h3 className="font-grotesk text-xl font-bold uppercase leading-tight text-white md:text-2xl">
                {ref.name}
              </h3>

              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10">
                <Image
                  src={ref.image}
                  alt={ref.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px"
                  className="object-cover transition-opacity duration-300 hover:opacity-90"
                />
              </div>

              {/* CTA */}
              <Link
                href={`/projets/${ref.slug}`}
                className="group inline-flex items-center gap-1.5 text-sm text-white/80 transition-colors hover:text-[#26e1b0]"
              >
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
                voir le cas
              </Link>
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
  )
}
