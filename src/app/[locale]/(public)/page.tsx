import ContactForm from '@/components/contact/ContactForm'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProblemSolutionSection } from '@/components/sections/ProblemSolutionSection'
import { SocialProofSection } from '@/components/sections/SocialProofSection'
import { ValuePropSection } from '@/components/sections/ValuePropSection'
import { fetchHomepageSections } from '@/lib/sections/fetch-homepage'
import type {
  HeroContent,
  ProblemSolutionContent,
  SocialProofContent,
  ValuePropContent,
} from '@/types/page-sections'

// Vitrine ThinkTwice — Hero section
// Revalidation toutes les 60s (page semi-dynamique, cf. CLAUDE.md)
export const revalidate = 60

export default async function HomePage() {
  const sections = await fetchHomepageSections()

  const heroSection = sections.find((s) => s.type === 'hero')
  const valuePropSection = sections.find((s) => s.type === 'value_prop')
  const socialProofSection = sections.find((s) => s.type === 'social_proof')
  const problemSolutionSection = sections.find((s) => s.type === 'problem_solution')

  return (
    <main className="bg-tt-bg min-h-screen font-grotesk text-white">
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      {heroSection && <HeroSection content={heroSection.content as unknown as HeroContent} />}

      {/* ── VALUE PROP ─────────────────────────────────────────────────── */}
      {valuePropSection && (
        <ValuePropSection content={valuePropSection.content as unknown as ValuePropContent} />
      )}

      {/* ── SOCIAL PROOF ───────────────────────────────────────────────── */}
      {socialProofSection && (
        <SocialProofSection content={socialProofSection.content as unknown as SocialProofContent} />
      )}
      {/* ── PROBLÈME / SOLUTION ────────────────────────────────────────── */}
      {problemSolutionSection && (
        <ProblemSolutionSection
          content={problemSolutionSection.content as unknown as ProblemSolutionContent}
        />
      )}
      {/* ── MÉTHODOLOGIE / POUR QUI ────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Colonne gauche — Méthodologie */}
          <div className="flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
            <h2 className="text-2xl">
              <span className="mark-teal">Méthodologie</span>
            </h2>
            <ol className="flex flex-col gap-6">
              <li>
                <p className="font-bold">
                  <span className="text-tt-accent">1.</span> Cadrage
                </p>
                <p className="mt-1 text-base text-white/70">
                  Compréhension de votre activité, objectifs, cibles
                </p>
              </li>
              <li>
                <p className="font-bold">
                  <span className="text-tt-accent">2.</span> UX &amp; structure
                </p>
                <p className="mt-1 text-base text-white/70">Arborescence, parcours utilisateur</p>
              </li>
              <li>
                <p className="font-bold">
                  <span className="text-tt-accent">3.</span> Design
                </p>
                <p className="mt-1 text-base text-white/70">Maquettes sur mesure (PSD/Figma)</p>
              </li>
              <li>
                <p className="font-bold">
                  <span className="text-tt-accent">4.</span> Développement
                </p>
                <p className="mt-1 text-base text-white/70">
                  Intégration WordPress propre et performante
                </p>
              </li>
              <li>
                <p className="font-bold">
                  <span className="text-tt-accent">5.</span> Mise en ligne
                </p>
                <p className="mt-1 text-base text-white/70">Tests, SEO de base, accompagnement</p>
              </li>
            </ol>
          </div>

          {/* Colonne droite — Pour qui ? */}
          <div className="flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
            <h2 className="text-2xl">
              <span className="mark-teal">Pour qui ?</span>
            </h2>
            <p>Nous travaillons principalement avec :</p>
            <ul className="flex flex-col gap-3 pl-2">
              <li>
                <span className="text-tt-accent">•</span>{' '}
                <span className="mark-teal">cabinets</span> (avocats, conseil, IT)
              </li>
              <li>
                <span className="text-tt-accent">•</span>{' '}
                <span className="mark-teal">PME / ETI</span>
              </li>
              <li>
                <span className="text-tt-accent">•</span>{' '}
                <span className="mark-teal">indépendants exigeants</span>
              </li>
              <li>
                <span className="text-tt-accent">•</span>{' '}
                <span className="mark-teal">startups</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── CE QUE VOUS OBTENEZ ────────────────────────────────────────── */}
      <section className="relative w-full pb-24 text-center">
        {/* Motif gauche — du bord gauche jusqu'à la colonne centrée */}
        <div
          aria-hidden="true"
          className="motif-dots pointer-events-none absolute left-0 top-0 bottom-0 opacity-20 [width:calc(max(0px,(100%-40rem)/2))]"
        />
        {/* Motif droit — de la colonne centrée jusqu'au bord droit */}
        <div
          aria-hidden="true"
          className="motif-dots pointer-events-none absolute right-0 top-0 bottom-0 opacity-20 [width:calc(max(0px,(100%-40rem)/2))]"
        />

        <div className="relative mx-auto max-w-[40rem] px-6 flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="font-bold text-2xl">
            <span className="mark-teal">Ce que vous obtenez</span>
          </h2>

          {/* Site WordPress sur mesure */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span>{' '}
              <span className="mark-teal">site WordPress sur mesure</span>
            </p>
            <p>
              <span className="text-tt-accent">•</span> design unique (pas de template)
            </p>
            <p>
              <span className="text-tt-accent">•</span> responsive (mobile / tablette / desktop)
            </p>
          </div>

          {/* Expérience utilisateur optimisée */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span>{' '}
              <span className="mark-teal">expérience utilisateur optimisée</span>
            </p>
            <p>
              <span className="text-tt-accent">•</span> navigation claire
            </p>
            <p>
              <span className="text-tt-accent">•</span> parcours utilisateur pensé
            </p>
          </div>

          {/* Performance technique */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span>{' '}
              <span className="mark-teal">performance technique</span>
            </p>
            <p>
              <span className="text-tt-accent">•</span> rapidité de chargement
            </p>
            <p>
              <span className="text-tt-accent">•</span> code propre
            </p>
            <p>
              <span className="text-tt-accent">•</span> SEO technique
            </p>
          </div>

          {/* Autonomie */}
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">
              <span className="text-tt-accent">✓</span> <span className="mark-teal">autonomie</span>
            </p>
            <p>
              <span className="text-tt-accent">•</span> back-office simple
            </p>
            <p>
              <span className="text-tt-accent">•</span> formation incluse
            </p>
          </div>
        </div>
      </section>

      {/* ── NOS OFFRES ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        {/* Intro + titre */}
        <div className="mb-12 text-center">
          <p className="mb-6 font-light text-tt-accent text-lg lg:text-xl">
            <span className="mark-gray">
              Nous concevons des identités digitales qui transforment la perception d'une marque
            </span>
          </p>
          <h2 className="inline font-bold text-3xl">
            <span className="mark-teal">Nos offres</span>
          </h2>
        </div>

        {/* Grille 3 colonnes */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Essentiel ── */}
          <div className="relative flex flex-col gap-6 p-6">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 opacity-20"
            />
            <div className="relative flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-2xl text-tt-accent">essentiel</h3>
              <p className="font-bold text-white text-xl">2 900 — 3 900 €</p>
              <p className="font-bold text-white">→ poser une base</p>

              <p className="font-bold text-white mt-2">Pour qui</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> TPE / indépendant
                </li>
                <li>
                  <span className="text-tt-accent">•</span> besoin rapide mais propre
                </li>
                <li>
                  <span className="text-tt-accent">•</span> première vraie présence
                </li>
              </ul>

              <p className="font-bold text-white mt-2">Contenu</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> direction artistique light (univers
                  visuel + typo + couleurs)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> template WordPress premium (customisé
                  proprement)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> 4 à 6 pages
                </li>
                <li>
                  <span className="text-tt-accent">•</span> responsive
                </li>
                <li>
                  <span className="text-tt-accent">•</span> SEO de base (structure + balises)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> intégration contenu
                </li>
              </ul>

              <p className="font-bold text-tt-accent text-base mt-2">
                On pose une base propre, cohérente, crédible — sans surproduire.
              </p>
            </div>
            <a
              href="#contact"
              className="btn-cta relative block bg-tt-accent px-6 py-4 text-center font-light text-tt-bg text-lg leading-snug transition-opacity hover:opacity-90"
            >
              Je choisis cette offre
            </a>
          </div>

          {/* ── Signature ── */}
          <div className="relative flex flex-col gap-6 p-6">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 opacity-20"
            />
            <div className="relative flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-2xl text-tt-accent">signature</h3>
              <p className="font-bold text-white text-xl">4 900 — 7 500 €</p>
              <p className="font-bold text-white">→ construire une image</p>

              <p className="font-bold text-white mt-2">Pour qui</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> PME
                </li>
                <li>
                  <span className="text-tt-accent">•</span> cabinet / conseil / services
                </li>
                <li>
                  <span className="text-tt-accent">•</span> marques qui veulent monter en gamme
                </li>
              </ul>

              <p className="font-bold text-white mt-2">Contenu</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> direction artistique complète
                </li>
                <li>
                  <span className="text-tt-accent">•</span> UX design (parcours utilisateur
                  réfléchi)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> maquettes sur-mesure (PSD/Figma)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> WordPress sur mesure (pas juste un
                  thème)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> 6 à 10 pages
                </li>
                <li>
                  <span className="text-tt-accent">•</span> SEO structuré
                </li>
                <li>
                  <span className="text-tt-accent">•</span> animations légères (motion UI)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> guidelines graphiques livrées
                </li>
              </ul>

              <p className="font-bold text-tt-accent text-base mt-2">
                On ne crée pas un site. On construit une expérience qui renforce votre image et
                votre crédibilité.
              </p>
            </div>
            <a
              href="#contact"
              className="btn-cta relative block bg-tt-accent px-6 py-4 text-center font-light text-tt-bg text-lg leading-snug transition-opacity hover:opacity-90"
            >
              Je choisis cette offre
            </a>
          </div>

          {/* ── Premium ── */}
          <div className="relative flex flex-col gap-6 p-6">
            <div
              aria-hidden="true"
              className="motif-dots pointer-events-none absolute inset-0 opacity-20"
            />
            <div className="relative flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-2xl text-tt-accent">premium</h3>
              <p className="font-bold text-white text-xl">9 000 — 15 000 €</p>
              <p className="font-bold text-white">→ créer un levier</p>

              <p className="font-bold text-white mt-2">Pour qui</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> marques ambitieuses
                </li>
                <li>
                  <span className="text-tt-accent">•</span> repositionnement
                </li>
                <li>
                  <span className="text-tt-accent">•</span> lancement stratégique
                </li>
              </ul>

              <p className="font-bold text-white mt-2">Contenu</p>
              <ul className="flex flex-col gap-1 text-base font-light text-white">
                <li>
                  <span className="text-tt-accent">•</span> atelier stratégique (positionnement,
                  discours)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> direction artistique avancée
                </li>
                <li>
                  <span className="text-tt-accent">•</span> UX approfondie (conversion,
                  storytelling)
                </li>
                <li>
                  <span className="text-tt-accent">•</span> design sur-mesure poussé
                </li>
                <li>
                  <span className="text-tt-accent">•</span> développement WordPress avancé
                </li>
                <li>
                  <span className="text-tt-accent">•</span> SEO + structure éditoriale
                </li>
                <li>
                  <span className="text-tt-accent">•</span> micro-interactions / motion design
                </li>
                <li>
                  <span className="text-tt-accent">•</span> accompagnement lancement
                </li>
              </ul>

              <p className="font-bold text-tt-accent text-base mt-2">
                On aligne votre image, votre discours et votre business. Le site devient un levier,
                pas un support.
              </p>
            </div>
            <a
              href="#contact"
              className="btn-cta relative block bg-tt-accent px-6 py-4 text-center font-light text-tt-bg text-lg leading-snug transition-opacity hover:opacity-90"
            >
              Je choisis cette offre
            </a>
          </div>
        </div>
      </section>

      {/* ── OPTIONS / CTA PRINCIPAL ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-start gap-8">
          {/* Contenu ~60% */}
          <div className="flex-[3] flex flex-col gap-6 font-light text-white text-lg leading-relaxed lg:text-xl">
            <h2 className="text-2xl">
              <span className="mark-teal">Pour aller plus loin / options</span>
            </h2>
            <ul className="flex flex-col gap-3">
              <li>
                <span className="text-tt-accent">•</span> Rédaction SEO : <strong>800 €</strong>{' '}
                <span className="text-tt-accent">→</span> <strong>2 000 €</strong>
              </li>
              <li>
                <span className="text-tt-accent">•</span> Identité visuelle complète :{' '}
                <strong>1 500 €</strong> <span className="text-tt-accent">→</span>{' '}
                <strong>3 000 €</strong>
              </li>
              <li>
                <span className="text-tt-accent">•</span> Maintenance mensuelle :{' '}
                <strong>80 €</strong> <span className="text-tt-accent">→</span>{' '}
                <strong>250 €</strong>{' '}
                <span className="text-sm font-light text-white/60">/ mois</span>
              </li>
              <li>
                <span className="text-tt-accent">•</span> Optimisation conversion :{' '}
                <strong>500 €</strong> <span className="text-tt-accent">→</span>{' '}
                <strong>1 500 €</strong>
              </li>
              <li>
                <span className="text-tt-accent">•</span> Formation client : <strong>300 €</strong>{' '}
                <span className="text-tt-accent">→</span> <strong>800 €</strong>
              </li>
            </ul>
          </div>

          {/* Motif droite ~40% */}
          <div
            aria-hidden="true"
            className="motif-dots hidden lg:block flex-[2] self-stretch opacity-20"
          />
        </div>

        {/* CTA principal */}
        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="btn-cta inline-block w-full max-w-[40rem] bg-tt-accent px-8 py-5 font-light text-tt-bg text-[1.8rem] leading-[2rem] transition-opacity hover:opacity-90"
          >
            Discutons de votre projet
          </a>
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[60rem] px-6 pb-24">
        <h2 className="mb-16 text-center text-3xl font-bold">
          <span className="mark-teal">Qui sommes-nous ?</span>
        </h2>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* ── Stéphane S. ── */}
          <div className="flex flex-col gap-6">
            {/* Portrait */}
            {/* TODO: remplacer par assets cadre teal + portrait Stéphane S. */}
            <div className="relative self-start">
              <div
                aria-hidden="true"
                className="motif-dots pointer-events-none absolute bottom-0 right-0 h-3/4 w-3/4 translate-x-3 translate-y-3 opacity-30"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/thinktwice-ss.png"
                alt="Stéphane S."
                className="relative z-10 w-full max-w-[18rem]"
              />
            </div>

            {/* Nom */}
            <p className="font-bold text-tt-accent text-xl">SOKOL</p>

            {/* Bio */}
            <div className="flex flex-col gap-4 font-light text-white text-base leading-relaxed">
              <p>
                Directeur artistique digital senior et auteur. Fort de près de trente ans
                d'expérience, dont quinze en agences et quatorze en indépendant, il conçoit{' '}
                <strong>des identités et des expériences digitales exigeantes.</strong>
              </p>
              <p>
                Son approche privilégie la cohérence, la lisibilité et l'impact, en alignant image,
                discours et usage.
              </p>
              <p>
                <strong>Spécialiste du branding et du design d'interfaces,</strong> il intervient
                sur des projets variés, de la refonte stratégique au lancement de marque.
              </p>
              <p>
                En parallèle, son travail d'écriture nourrit{' '}
                <strong>une vision sensible et rigoureuse.</strong>
              </p>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 text-tt-accent">
              <a href="#contact" className="hover:opacity-70">
                <span className="sr-only">Facebook</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#contact" className="hover:opacity-70">
                <span className="sr-only">LinkedIn</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#contact" className="hover:opacity-70">
                <span className="sr-only">Instagram</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Stéphane R. ── */}
          <div className="flex flex-col gap-6">
            {/* Portrait */}
            {/* TODO: remplacer par assets cadre teal + portrait Stéphane R. */}
            <div className="relative self-start">
              <div
                aria-hidden="true"
                className="motif-dots pointer-events-none absolute bottom-0 right-0 h-3/4 w-3/4 translate-x-3 translate-y-3 opacity-30"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/thinktwice-sr.png"
                alt="Stéphane R."
                className="relative z-10 w-full max-w-[18rem]"
              />
            </div>

            {/* Nom */}
            <p className="font-bold text-tt-accent text-xl">ROCHARD</p>

            {/* Bio */}
            <div className="flex flex-col gap-4 font-light text-white text-base leading-relaxed">
              <p>
                Concepteur développeur web fort de plus de vingt ans d'expérience, il conjugue{' '}
                <strong>développement, pilotage de projets</strong> et expertise WordPress, PHP,
                NodeJS et architectures web.
              </p>
              <p>
                Il conçoit des plateformes robustes, optimise l'existant et intervient sur des
                environnements sensibles, du front au back, avec une attention particulière portée à{' '}
                <strong>
                  la performance, la qualité, la fiabilité et la maintenabilité des systèmes.
                </strong>
              </p>
              <p>
                Il évolue avec grâce dans des contextes techniques exigeants et sait concevoir des
                solutions <strong>aux besoins et aux contraintes métier.</strong>
              </p>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 text-tt-accent">
              {/* <a href="#contact" className="hover:opacity-70">
                <span className="sr-only">LinkedIn</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a> */}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────────────── */}
      <section id="contact" className="border-t border-[#444444]">
        <div className="mx-auto max-w-2xl px-6 pt-24 pb-32">
          <h2 className="mb-3 font-bold text-2xl text-tt-accent tracking-tight">Contact</h2>
          <p className="mb-10 text-[#cccccc]">Un projet ? Une question ? Je lis tout.</p>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
