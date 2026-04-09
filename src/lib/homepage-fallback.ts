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
      tagline_top: 'design × code',
      tagline_main: 'précision × exécution',
      tagline_sub: 'double exigence',
      logo_alt: 'ThinkTwice',
    },
  },
  {
    id: 'fallback-value-prop',
    page_id: 'homepage',
    type: 'value_prop',
    order_index: 1,
    is_visible: true,
    content: {
      headline:
        'Conception de sites WordPress performants, pensés pour votre image et votre business.',
      subheadline:
        'Nous associons direction artistique et développement pour créer des sites sur mesure, clairs, rapides et durables.',
      cta_primary: { label: 'Demander un devis', href: '#contact' },
      cta_secondary: { label: 'Prendre rendez-vous', href: '#contact' },
    },
  },
  {
    id: 'fallback-social-proof',
    page_id: 'homepage',
    type: 'social_proof',
    order_index: 2,
    is_visible: true,
    content: {
      stat_label: "+20 ans d'expérience",
    },
  },
  {
    id: 'fallback-problem-solution',
    page_id: 'homepage',
    type: 'problem_solution',
    order_index: 3,
    is_visible: true,
    content: {
      problem_headline: 'Problème client',
      problem_body:
        "Aujourd'hui, beaucoup de sites construits avec WordPress manquent de clarté, sont peu différenciants et ne génèrent pas de résultats. Un site qui existe… mais qui ne sert pas votre activité.",
      solution_headline: 'Solution',
      solution_body:
        'Nous concevons des sites esthétiques et performants. Un design sur mesure, une structure claire, un développement solide, un site pensé pour durer.',
    },
  },
]
