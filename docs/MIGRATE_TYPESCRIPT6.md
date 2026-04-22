# Migration : TypeScript 5.9 → 6.0

## Objectif
Mettre à jour `typescript` (5.9.3 → 6.x) dans kadath.fr.
TypeScript 6 est une release de transition vers TS7 (Go) — les changements portent sur les **defaults du compilateur**, pas sur le langage lui-même. Code TS5 valide reste valide en TS6.

---

## Étape 1 — Codemod ts5to6

Automatise les deux changements les plus disruptifs (`baseUrl` removal, `rootDir` inference) :

```bash
npx @andrewbranch/ts5to6
```

Inspecter les modifications apportées au(x) `tsconfig.json` avant de continuer.

---

## Étape 2 — Bump TypeScript

```bash
pnpm add -D typescript@latest
```

---

## Étape 3 — Vérifier le tsconfig.json

Ouvrir `tsconfig.json` (et tout `tsconfig.*.json` présent) et vérifier/corriger les points suivants :

### 3a. `types` doit être explicite
En TS6, `types` passe à `[]` par défaut — les `@types/*` ne sont plus auto-découverts.

```json
// Vérifier que types est présent et contient au minimum "node"
"types": ["node"]
// Ajouter tout autre @types utilisé globalement dans le projet
```

### 3b. `rootDir` doit être explicite
```json
"rootDir": "./src"
```

### 3c. Options dépréciées à supprimer ou remplacer

| Option dépréciée | Action |
|---|---|
| `"target": "es5"` | Remplacer par `"es2015"` minimum — Next.js utilise `"esnext"` |
| `"moduleResolution": "node"` | Remplacer par `"bundler"` (déjà standard Next.js) |
| `"downlevelIteration": true/false` | Supprimer entièrement |
| `"baseUrl": "."` | Supprimer si redondant avec `paths` (le codemod gère ça) |

### 3d. `strict` déjà activé → rien à faire
`strict: true` est le nouveau défaut en TS6, mais s'il est déjà explicite dans le tsconfig, aucun changement de comportement.

### 3e. `noUncheckedSideEffectImports`
TS6 active ce flag par défaut. Si des imports side-effect sans type (`import './styles.css'`) provoquent des erreurs, deux options :
- Ajouter les déclarations de module manquantes dans `src/global.d.ts`
- Ou désactiver explicitement : `"noUncheckedSideEffectImports": false`

---

## Étape 4 — Type-check sans émission

```bash
npx tsc --noEmit
```

Corriger toutes les erreurs TypeScript remontées avant de continuer.

---

## Étape 5 — Build complet

```bash
pnpm build
```

Le build doit passer sans erreur de type ni d'import.

---

## Étape 6 — Tests

```bash
pnpm test
```

---

## Commits suggérés

1. `build: ⬆️ TypeScript 6 — codemod ts5to6 + tsconfig cleanup`
2. `build: ⬆️ typescript 5.9 → 6.x`

Ou un seul commit si les changements sont mineurs.

---

## Notes

- **Ne pas utiliser `"ignoreDeprecations": "6.0"`** — c'est un escape hatch temporaire qui ne fonctionnera pas en TS7.
- **`--stableTypeOrdering`** : ne pas activer, uniquement utile pour comparer output TS6 vs TS7, ralentit le type-check de ~25%.
- TS6 est la **dernière version JS** du compilateur. TS7 sera en Go (prévu fin 2026/début 2027) avec des gains de perf massifs (type-check ~10x plus rapide).
