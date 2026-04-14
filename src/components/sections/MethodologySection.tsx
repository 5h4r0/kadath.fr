export function MethodologySection() {
  return (
    <section className="mx-auto max-w-[60rem] px-6 pb-24">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Colonne gauche — Méthodologie */}
        <div className="flex flex-col gap-8 font-light text-white text-lg leading-relaxed lg:text-xl">
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">Méthodologie</span>
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
          <h2 className="text-2xl font-light text-tt-accent">
            <span className="mark-gray">Pour qui ?</span>
          </h2>
          <p>Nous travaillons principalement avec :</p>
          <ul className="flex flex-col gap-3 pl-2">
            <li>
              <span className="text-tt-accent">•</span> <span className="mark-teal">cabinets</span>{' '}
              (avocats, conseil, IT)
            </li>
            <li>
              <span className="text-tt-accent">•</span> <span className="mark-teal">PME / ETI</span>
            </li>
            <li>
              <span className="text-tt-accent">•</span>{' '}
              <span className="mark-teal">indépendants exigeants</span>
            </li>
            <li>
              <span className="text-tt-accent">•</span> <span className="mark-teal">startups</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
