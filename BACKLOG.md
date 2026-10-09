# Backlog kadath.fr

## En cours / prochain sprint

- [ ] Customer space — zéro routes implémentées (dashboard, profil, documents)
- [ ] Wirer `(public)/page.tsx` au pipeline CMS (actuellement hardcodé)
- [ ] Login : implémenter la prise en compte du param `?redirect=`
- [ ] Résoudre BUG-8 : DNS `contact@kadath.fr` propagation Ionos

## Backlog technique

- [ ] Zod parser sur `heroSection.content` et autres sections CMS (remplacer les double-casts `as unknown as HeroContent`)
- [ ] `@dnd-kit` drag-and-drop sur `order_index` dans `page_sections`
- [ ] TipTap editor pour `cms_pages.sections` JSONB (pages libres : mentions légales, CGU, articles)
- [ ] Lenteur backoffice — investiguer requêtes Supabase non optimisées
- [ ] Bridge API Anthropic pour automatiser le relay CC ↔ claude.ai

## Accessibilité (RGAA)

- [ ] Attributs `aria-*` sur tous les formulaires (labels, `aria-describedby`, `aria-invalid`)
- [ ] Liens d'évitement (`<a href="#main-content">`) pour navigation clavier
- [ ] Focus management sur modales/overlays
- [ ] Audit contrastes (`bg-tt-bg` + couleurs d'accent)
- [ ] Navigation TAB cohérente sur toutes les pages
- [ ] Liens internes vers sections (`#contact`, etc.)

## Déprécié / annulé
