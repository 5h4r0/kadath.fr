# Migration : Tailwind CSS 3 → 4 + tailwind-merge 2 → 3

## Objectif
Mettre à jour `tailwindcss` (3.4.19 → 4.x) et `tailwind-merge` (2.6.1 → 3.x) dans kadath.fr.
Ces deux packages doivent être upgradés ensemble — tailwind-merge v3 abandonne le support de Tailwind v3.

## Contexte projet
- Next.js 16 + App Router + Turbopack
- shadcn/ui (compatible Tailwind v4 officiellement)
- Couleurs brand : `#C5205D` et `#53BBAD` définies dans tailwind.config
- Polices : Ferryman (titres) + Helvetica Condensed (corps/UI)
- Plugin `tailwindcss-animate` probablement présent (shadcn/ui)
- `cn()` / `twMerge()` utilisés dans les composants UI

---

## Étape 1 — Codemod officiel Tailwind

Le codemod automatise ~90% de la migration : deps, config JS → CSS, directives, classes renommées.

```bash
npx @tailwindcss/upgrade@latest
```

Ce codemod :
- Met à jour `tailwindcss`, `@tailwindcss/postcss`, `tailwind-merge` dans `package.json`
- Migre `tailwind.config.ts/js` → bloc `@theme` dans `globals.css`
- Remplace les directives `@tailwind base/components/utilities` → `@import "tailwindcss"`
- Met à jour `postcss.config.js/mjs` pour utiliser `@tailwindcss/postcss`
- Renomme les classes dépréciées dans les fichiers source

Après le codemod, inspecter les changements avant de continuer.

---

## Étape 2 — Vérifications post-codemod

### 2a. Colors brand dans globals.css
Vérifier que les couleurs brand de kadath.fr sont bien migrées dans `@theme` :

```css
@theme {
  --color-brand-pink: #C5205D;
  --color-brand-teal: #53BBAD;
  /* autres tokens custom... */
}
```

Si le codemod ne les a pas migrées depuis `tailwind.config`, les ajouter manuellement.

### 2b. Plugin tailwindcss-animate → tw-animate-css
Si `tailwindcss-animate` est présent, shadcn/ui recommande de le remplacer :

```bash
pnpm remove tailwindcss-animate
pnpm add tw-animate-css
```

Dans `globals.css`, remplacer :
```css
/* AVANT */
@plugin 'tailwindcss-animate';

/* APRÈS */
@import "tw-animate-css";
```

### 2c. Variables CSS shadcn/ui dans @theme
Si le projet utilise les variables CSS shadcn (`--background`, `--foreground`, etc.), elles doivent être mappées dans `@theme inline` :

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... autres variables shadcn ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mapper toutes les variables utilisées comme classes Tailwind ... */
}
```

### 2d. Dark mode
Vérifier la configuration du dark mode dans `globals.css` :

```css
@custom-variant dark (&:is(.dark *));
```

### 2e. Polices custom
Si les polices Ferryman et Helvetica Condensed sont définies dans `tailwind.config`, vérifier qu'elles ont bien été migrées dans `@theme` :

```css
@theme {
  --font-display: "Ferryman", serif;
  --font-body: "Helvetica Condensed", "Helvetica Neue", sans-serif;
}
```

---

## Étape 3 — Vérifier tailwind-merge

`twMerge` et `cn()` dans les composants ne changent pas d'API — le changement est interne (support Tailwind v4). Vérifier que `lib/utils.ts` (ou équivalent) importe bien depuis `tailwind-merge` et que le build passe.

Si le projet utilise `extendTailwindMerge` avec une config custom, vérifier la compatibilité avec l'API v3 (les clés de theme ont changé pour correspondre aux variables CSS Tailwind v4).

---

## Étape 4 — Build et vérification visuelle

```bash
pnpm build
```

Le build doit passer sans erreur. Ensuite :

```bash
pnpm dev
```

Vérifier visuellement :
- [ ] Page d'accueil — layout, couleurs brand, typographie
- [ ] Dark mode (si applicable)
- [ ] Composants shadcn/ui (boutons, formulaires, modales)
- [ ] Page contact (formulaire Turnstile)
- [ ] Espace client `/customer/`
- [ ] Backoffice `kadath.fr/manage`

---

## Étape 5 — Commit

```bash
git add -A
git commit -m "build: ⬆️ tailwindcss 3 → 4 + tailwind-merge 2 → 3"
```

---

## Points d'attention

1. **Border color** : en v4, la couleur de bordure par défaut passe à `currentColor` (était `gray-200` en v3). Le codemod ajoute des styles de compatibilité — les supprimer progressivement et ajouter des classes explicites si besoin.

2. **Gradient via** : en v4, `via-*` est préservé lors d'un override — utiliser `via-none` pour remettre à zéro un gradient 3 stops.

3. **Container** : les options `center` et `padding` du plugin `container` n'existent plus — remplacer par `@utility container { ... }`.

4. **Hover sur touch** : le comportement hover sur mobile a changé. Vérifier les interactions hover critiques.

5. **tailwind-merge config custom** : si `extendTailwindMerge` est utilisé avec des groupes custom, les clés de theme ont changé — consulter le guide de migration tailwind-merge v3.

6. **Ne pas supprimer tailwind.config.ts immédiatement** — le codemod peut garder un `@config` dans le CSS pour la compatibilité. Le supprimer progressivement une fois que tout fonctionne.
