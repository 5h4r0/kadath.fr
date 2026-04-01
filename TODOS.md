# TODOS

## OG image runtime — Firebase App Hosting compatibility
**What:** Ajouter `export const runtime = 'nodejs'` dans `src/app/opengraph-image.tsx`.
**Why:** Firebase App Hosting = Cloud Run = Node.js. `opengraph-image.tsx` tourne en Edge Runtime par défaut. `@vercel/og` est compatible Node.js depuis v0.5 mais la déclaration de runtime doit être explicite.
**Pros:** OG images fonctionnelles sur Firebase App Hosting sans changer de package.
**Cons:** Aucun — changement d'une ligne.
**Context:** Identifié lors du /plan-eng-review Sprint 1. OG image déféré au Sprint 2. À faire avant d'implémenter `opengraph-image.tsx`.
**Depends on:** Sprint 2 (vitrine contenu finalisé).

---

## firebase.json — Supprimer le bloc `hosting` legacy
**What:** Retirer le bloc `"hosting": { "public": ".next", "rewrites": [...] }` de `firebase.json`.
**Why:** Bloc de static hosting inutilisé avec Firebase App Hosting (Cloud Run). Crée de la confusion sur le mode de déploiement réel.
**Pros:** Fichier propre, pas de fausse piste pour les futurs contributeurs.
**Cons:** Aucun — bloc ignoré par App Hosting.
**Context:** Identifié lors du /plan-eng-review Sprint 1. Non bloquant.
**Depends on:** —
