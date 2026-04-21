// Source de vérité statique — miroir du contenu homepage actuel.
// Utilisé comme fallback si Supabase est injoignable ou si la table est vide.
// Mettre à jour ici si le contenu change avant que le CMS soit opérationnel.

import type { PageSection } from '@/types/page-sections'

export const HOMEPAGE_FALLBACK: PageSection[] = [
  {
    id: 'fallback-hero',
    page_id: 'homepage',
    type: 'hero',
    order_index: 0,
    is_visible: true,
    content: {
      fr: {
        tagline_top: 'design × code',
        tagline_main: 'précision × exécution',
        tagline_sub: 'double exigence',
        logo_alt: 'ThinkTwice',
      },
      en: {
        tagline_top: 'design × code',
        tagline_main: 'precision × execution',
        tagline_sub: 'double standard',
        logo_alt: 'ThinkTwice',
      },
    },
  },
  {
    id: 'fallback-value-prop',
    page_id: 'homepage',
    type: 'value_prop',
    order_index: 1,
    is_visible: true,
    content: {
      fr: {
        headline:
          'Conception de sites WordPress performants, pensés pour votre image et votre business.',
        subheadline:
          'Nous associons direction artistique et développement pour créer des sites sur mesure, clairs, rapides et durables.',
        cta_primary: { label: 'Demander un devis', href: '#contact' },
        cta_secondary: { label: 'Prendre rendez-vous', href: '#contact' },
      },
      en: {
        headline: 'High-performance WordPress websites built for your image and your business.',
        subheadline:
          'We combine art direction and development to create custom sites that are clear, fast and built to last.',
        cta_primary: { label: 'Request a quote', href: '#contact' },
        cta_secondary: { label: 'Book a call', href: '#contact' },
      },
    },
  },
  {
    id: 'fallback-social-proof',
    page_id: 'homepage',
    type: 'social_proof',
    order_index: 2,
    is_visible: true,
    content: {
      fr: { stat_label: "+20 ans d'expérience" },
      en: { stat_label: '20+ years of experience' },
    },
  },
  {
    id: 'fallback-problem-solution',
    page_id: 'homepage',
    type: 'problem_solution',
    order_index: 3,
    is_visible: true,
    content: {
      fr: {
        problem_headline: 'Problème client',
        problem_body:
          "Aujourd'hui, beaucoup de sites construits avec WordPress manquent de clarté, sont peu différenciants et ne génèrent pas de résultats. Un site qui existe… mais qui ne sert pas votre activité.",
        solution_headline: 'Solution',
        solution_body:
          'Nous concevons des sites esthétiques et performants. Un design sur mesure, une structure claire, un développement solide, un site pensé pour durer.',
      },
      en: {
        problem_headline: 'The problem',
        problem_body:
          'Too many WordPress sites lack clarity, fail to differentiate, and generate no results. A site that exists… but does nothing for your business.',
        solution_headline: 'The solution',
        solution_body:
          'We design beautiful, high-performance websites. Custom design, clear structure, solid development — built to last.',
      },
    },
  },
  {
    id: 'fallback-methodology',
    page_id: 'homepage',
    type: 'methodology',
    order_index: 4,
    is_visible: true,
    content: {
      fr: {
        title: 'Méthodologie',
        steps: [
          { title: 'Cadrage', desc: 'Compréhension de votre activité, objectifs, cibles' },
          { title: 'UX & structure', desc: 'Arborescence, parcours utilisateur' },
          { title: 'Design', desc: 'Maquettes sur mesure (PSD/Figma)' },
          { title: 'Développement', desc: 'Intégration WordPress propre et performante' },
          { title: 'Mise en ligne', desc: 'Tests, SEO de base, accompagnement' },
        ],
        target_title: 'Pour qui ?',
        target_intro: 'Nous travaillons principalement avec :',
        target_items: [
          'cabinets (avocats, conseil, IT)',
          'PME / ETI',
          'indépendants exigeants',
          'startups',
        ],
      },
      en: {
        title: 'Methodology',
        steps: [
          {
            title: 'Scoping',
            desc: 'Understanding your business, objectives and target audience',
          },
          { title: 'UX & structure', desc: 'Sitemap, user journey' },
          { title: 'Design', desc: 'Custom mockups (PSD/Figma)' },
          { title: 'Development', desc: 'Clean, performant WordPress integration' },
          { title: 'Launch', desc: 'Testing, basic SEO, onboarding' },
        ],
        target_title: 'Who is this for?',
        target_intro: 'We mainly work with:',
        target_items: ['law & consulting firms', 'SMEs', 'demanding independents', 'startups'],
      },
    },
  },
  {
    id: 'fallback-deliverables',
    page_id: 'homepage',
    type: 'deliverables',
    order_index: 5,
    is_visible: true,
    content: {
      fr: {
        title: 'Ce que vous obtenez',
        items: [
          {
            key: 'wp',
            title: 'site WordPress sur mesure',
            bullets: [
              'design unique (pas de template)',
              'responsive (mobile / tablette / desktop)',
            ],
          },
          {
            key: 'ux',
            title: 'expérience utilisateur optimisée',
            bullets: ['navigation claire', 'parcours utilisateur pensé'],
          },
          {
            key: 'perf',
            title: 'performance technique',
            bullets: ['rapidité de chargement', 'code propre', 'SEO technique'],
          },
          {
            key: 'auto',
            title: 'autonomie',
            bullets: ['back-office simple', 'formation incluse'],
          },
        ],
      },
      en: {
        title: 'What you get',
        items: [
          {
            key: 'wp',
            title: 'custom WordPress site',
            bullets: ['unique design (no template)', 'responsive (mobile / tablet / desktop)'],
          },
          {
            key: 'ux',
            title: 'optimised user experience',
            bullets: ['clear navigation', 'thought-through user journey'],
          },
          {
            key: 'perf',
            title: 'technical performance',
            bullets: ['fast load times', 'clean code', 'technical SEO'],
          },
          {
            key: 'auto',
            title: 'autonomy',
            bullets: ['simple back-office', 'training included'],
          },
        ],
      },
    },
  },
  {
    id: 'fallback-offers',
    page_id: 'homepage',
    type: 'offers',
    order_index: 6,
    is_visible: true,
    content: {
      fr: {
        title: 'Nos offres',
        intro: "Nous concevons des identités digitales qui transforment la perception d'une marque",
        cta_label: 'Je choisis cette offre',
        for_who_label: 'Pour qui',
        content_label: 'Contenu',
        offers: [
          {
            slug: 'essentiel',
            name: 'essentiel',
            price: '2 900 — 3 900 €',
            tagline: '→ poser une base',
            pitch: 'On pose une base propre, cohérente, crédible — sans surproduire.',
            for_who: ['TPE / indépendant', 'besoin rapide mais propre', 'première vraie présence'],
            content: [
              'direction artistique light (univers visuel + typo + couleurs)',
              'template WordPress premium (customisé proprement)',
              '4 à 6 pages',
              'responsive',
              'SEO de base (structure + balises)',
              'intégration contenu',
            ],
          },
          {
            slug: 'signature',
            name: 'signature',
            price: '4 900 — 7 500 €',
            tagline: '→ construire une image',
            pitch:
              'On ne crée pas un site. On construit une expérience qui renforce votre image et votre crédibilité.',
            for_who: ['PME', 'cabinet / conseil / services', 'marques qui veulent monter en gamme'],
            content: [
              'direction artistique complète',
              'UX design (parcours utilisateur réfléchi)',
              'maquettes sur-mesure (PSD/Figma)',
              'WordPress sur mesure (pas juste un thème)',
              '6 à 10 pages',
              'SEO structuré',
              'animations légères (motion UI)',
              'guidelines graphiques livrées',
            ],
          },
          {
            slug: 'premium',
            name: 'premium',
            price: '9 000 — 15 000 €',
            tagline: '→ créer un levier',
            pitch:
              'On aligne votre image, votre discours et votre business. Le site devient un levier, pas un support.',
            for_who: ['marques ambitieuses', 'repositionnement', 'lancement stratégique'],
            content: [
              'atelier stratégique (positionnement, discours)',
              'direction artistique avancée',
              'UX approfondie (conversion, storytelling)',
              'design sur-mesure poussé',
              'développement WordPress avancé',
              'SEO + structure éditoriale',
              'micro-interactions / motion design',
              'accompagnement lancement',
            ],
          },
        ],
      },
      en: {
        title: 'Our offers',
        intro: 'We design digital identities that transform brand perception',
        cta_label: 'I choose this offer',
        for_who_label: 'For who',
        content_label: "What's included",
        offers: [
          {
            slug: 'essentiel',
            name: 'essential',
            price: '€2,900 — €3,900',
            tagline: '→ lay a foundation',
            pitch: 'We lay a clean, coherent, credible foundation — without over-producing.',
            for_who: [
              'sole traders / micro-businesses',
              'fast but clean brief',
              'first real online presence',
            ],
            content: [
              'light art direction (visual universe + typography + colours)',
              'premium WordPress template (properly customised)',
              '4 to 6 pages',
              'responsive',
              'basic SEO (structure + tags)',
              'content integration',
            ],
          },
          {
            slug: 'signature',
            name: 'signature',
            price: '€4,900 — €7,500',
            tagline: '→ build an image',
            pitch:
              "We don't create a site. We build an experience that strengthens your image and credibility.",
            for_who: [
              'SMEs',
              'law / consulting / services firms',
              'brands looking to move upmarket',
            ],
            content: [
              'full art direction',
              'UX design (thought-through user journey)',
              'custom mockups (PSD/Figma)',
              'custom WordPress (not just a theme)',
              '6 to 10 pages',
              'structured SEO',
              'light animations (motion UI)',
              'graphic guidelines delivered',
            ],
          },
          {
            slug: 'premium',
            name: 'premium',
            price: '€9,000 — €15,000',
            tagline: '→ create a lever',
            pitch:
              'We align your image, your voice and your business. The site becomes a lever, not a support.',
            for_who: ['ambitious brands', 'repositioning', 'strategic launch'],
            content: [
              'strategic workshop (positioning, messaging)',
              'advanced art direction',
              'deep UX (conversion, storytelling)',
              'high-end custom design',
              'advanced WordPress development',
              'SEO + editorial structure',
              'micro-interactions / motion design',
              'launch support',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'fallback-options',
    page_id: 'homepage',
    type: 'options',
    order_index: 7,
    is_visible: true,
    content: {
      fr: {
        title: 'Pour aller plus loin / options',
        items: [
          'Rédaction SEO : 800 € → 2 000 €',
          'Identité visuelle complète : 1 500 € → 3 000 €',
          'Maintenance mensuelle : 80 € → 250 € / mois',
          'Optimisation conversion : 500 € → 1 500 €',
          'Formation client : 300 € → 800 €',
        ],
        cta_label: 'Discutons de votre projet',
      },
      en: {
        title: 'Going further / options',
        items: [
          'SEO copywriting: €800 → €2,000',
          'Full visual identity: €1,500 → €3,000',
          'Monthly maintenance: €80 → €250 / month',
          'Conversion optimisation: €500 → €1,500',
          'Client training: €300 → €800',
        ],
        cta_label: "Let's discuss your project",
      },
    },
  },
  {
    id: 'fallback-team',
    page_id: 'homepage',
    type: 'team',
    order_index: 8,
    is_visible: true,
    content: {
      fr: {
        title: 'Qui nous sommes',
        members: [
          {
            key: 'ss',
            name: 'Stéphane S.',
            img: '/images/thinktwice-ss.png',
            linkedin: 'https://www.linkedin.com/in/stephanesokol/details/recommendations/',
            bios: [
              "Directeur artistique digital senior et auteur. Fort de près de trente ans d'expérience, dont quinze en agences et quatorze en indépendant, il conçoit <strong>des identités et des expériences digitales exigeantes.</strong>",
              "Son approche privilégie la cohérence, la lisibilité et l'impact, en alignant image, discours et usage.",
              "<strong>Spécialiste du branding et du design d'interfaces,</strong> il intervient sur des projets variés, de la refonte stratégique au lancement de marque.",
              "En parallèle, son travail d'écriture nourrit <strong>une vision sensible et rigoureuse.</strong>",
            ],
          },
          {
            key: 'sr',
            name: 'Stéphane R.',
            img: '/images/thinktwice-sr.png',
            linkedin: 'https://www.linkedin.com/in/rochard/details/recommendations/',
            bios: [
              "Concepteur développeur web fort de plus de vingt ans d'expérience, il conjugue <strong>développement, pilotage de projets</strong> et expertise WordPress, PHP, NodeJS et architectures web.",
              "Il conçoit des plateformes robustes, optimise l'existant et intervient sur des environnements sensibles, du front au back, avec une attention particulière portée à <strong>la performance, la qualité, la fiabilité et la maintenabilité des systèmes.</strong>",
              'Il évolue avec grâce dans des contextes techniques exigeants et sait concevoir des solutions <strong>aux besoins et aux contraintes métier.</strong>',
            ],
          },
        ],
      },
      en: {
        title: 'Who we are',
        members: [
          {
            key: 'ss',
            name: 'Stéphane S.',
            img: '/images/thinktwice-ss.png',
            linkedin: 'https://www.linkedin.com/in/stephanesokol/details/recommendations/',
            bios: [
              'Senior digital art director and author. With nearly thirty years of experience, fifteen in agencies and fourteen as an independent, he creates <strong>demanding digital identities and experiences.</strong>',
              'His approach prioritises consistency, legibility and impact, aligning image, message and use.',
              '<strong>A specialist in branding and interface design,</strong> he works on varied projects, from strategic rebrands to brand launches.',
              'In parallel, his writing practice nurtures <strong>a sensitive and rigorous vision.</strong>',
            ],
          },
          {
            key: 'sr',
            name: 'Stéphane R.',
            img: '/images/thinktwice-sr.png',
            linkedin: 'https://www.linkedin.com/in/rochard/details/recommendations/',
            bios: [
              'Web developer and designer with over twenty years of experience, combining <strong>development, project management</strong> and expertise in WordPress, PHP, NodeJS and web architectures.',
              'He builds robust platforms, optimises existing systems and works in sensitive environments, front to back, with particular attention to <strong>performance, quality, reliability and system maintainability.</strong>',
              'He navigates demanding technical contexts with ease and designs solutions <strong>tailored to business needs and constraints.</strong>',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'fallback-contact',
    page_id: 'homepage',
    type: 'contact',
    order_index: 9,
    is_visible: true,
    content: {
      fr: {
        heading: 'Contactez-nous',
        offices: [
          {
            city: 'Paris',
            address_1: '37 quater avenue du Maréchal Foch',
            address_2: '77370 Nangis',
          },
          { city: 'Nîmes', address_1: '6 rue Massillon', address_2: '30000 Nîmes' },
        ],
        email_label: 'E-mail :',
        email: 'thinktwice@sokol.fr',
        contacts: [
          {
            label: 'Contactez Stéphane Sokol directement',
            phone: '+33 (0)6 87 43 42 94',
            phone_href: 'tel:+33687434294',
          },
          {
            label: 'Contactez Stéphane Rochard directement',
            phone: '+33 (0)6 23 71 18 12',
            phone_href: 'tel:+33623711812',
          },
        ],
        form_heading: 'Faîtes-nous part de votre besoin',
        form_heading_txt:
          "Décrivez brièvement votre projet, et merci d'indiquer votre numéro de téléphone dans le corps de votre message si vous préférez être contacté·e par téléphone",
      },
      en: {
        heading: 'Contact us',
        offices: [
          {
            city: 'Paris',
            address_1: '37 quater avenue du Maréchal Foch',
            address_2: '77370 Nangis',
          },
          { city: 'Nîmes', address_1: '6 rue Massillon', address_2: '30000 Nîmes' },
        ],
        email_label: 'Email:',
        email: 'thinktwice@sokol.fr',
        contacts: [
          {
            label: 'Contact Stéphane Sokol directly',
            phone: '+33 (0)6 87 43 42 94',
            phone_href: 'tel:+33687434294',
          },
          {
            label: 'Contact Stéphane Rochard directly',
            phone: '+33 (0)6 23 71 18 12',
            phone_href: 'tel:+33623711812',
          },
        ],
        form_heading: 'Tell us about your project',
        form_heading_txt:
          "Describe your project, and include your phone number if you'd prefer to be reached by phone",
      },
    },
  },
]
