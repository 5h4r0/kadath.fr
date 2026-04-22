# Migration : Tiptap 2 → 3

## Objectif
Mettre à jour `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link` (2.27.2 → 3.x).

## Contexte projet
- Next.js 16 App Router (SSR)
- Usage : éditeur riche dans le CMS/backoffice (`/cms`)
- Extensions installées : `starter-kit`, `extension-link`, `react`

---

## Étape 1 — Audit préliminaire

Scanner les fichiers qui utilisent Tiptap :

```bash
grep -rn "tiptap\|useEditor\|StarterKit\|BubbleMenu\|FloatingMenu\|tippy\|tippyOptions" --include="*.ts" --include="*.tsx" src/
```

Identifier et noter :
- Les imports depuis `@tiptap/react` (BubbleMenu, FloatingMenu changent de chemin en v3)
- L'usage de `history:` dans `StarterKit.configure()` → renommé `undoRedo:`
- L'usage ou l'absence de `immediatelyRender` dans `useEditor()` (Next.js SSR)
- L'usage de `tippyOptions` sur BubbleMenu/FloatingMenu → API remplacée par `options`
- L'usage de `getPos()` dans des NodeViews custom → peut retourner `undefined` en v3

---

## Étape 2 — Désinstaller et réinstaller

```bash
pnpm remove @tiptap/react @tiptap/starter-kit @tiptap/extension-link
pnpm add @tiptap/react@latest @tiptap/starter-kit@latest @tiptap/extension-link@latest
```

Vérifier si `tippy.js` est installé et le supprimer si c'est le cas (remplacé par `@floating-ui/dom` en v3) :

```bash
grep "tippy" package.json
# Si présent :
pnpm remove tippy.js
```

Si des menus flottants (BubbleMenu/FloatingMenu) sont utilisés, installer la nouvelle dépendance :

```bash
pnpm add @floating-ui/dom
```

---

## Étape 3 — Corrections de code

### 3a. BubbleMenu / FloatingMenu — nouveau chemin d'import

```ts
// AVANT (v2)
import { BubbleMenu, FloatingMenu } from '@tiptap/react'

// APRÈS (v3)
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
```

### 3b. BubbleMenu — tippyOptions → options + @floating-ui/dom

```tsx
// AVANT (v2)
import { BubbleMenu } from '@tiptap/react'
<BubbleMenu tippyOptions={{ duration: 100 }}>...</BubbleMenu>

// APRÈS (v3)
import { BubbleMenu } from '@tiptap/react/menus'
import { offset } from '@floating-ui/dom'
<BubbleMenu options={{ offset: 6, placement: 'top' }}>...</BubbleMenu>
```

### 3c. StarterKit — history → undoRedo

```ts
// AVANT (v2)
StarterKit.configure({ history: false })

// APRÈS (v3)
StarterKit.configure({ undoRedo: false })
```

### 3d. useEditor — ajouter immediatelyRender: false (SSR Next.js)

En v3, c'est critique pour éviter les hydration mismatches avec Next.js :

```ts
// APRÈS (v3) — obligatoire avec Next.js App Router
const editor = useEditor({
  immediatelyRender: false,
  extensions: [...],
  content: '...',
})
```

### 3e. getPos() dans NodeViews — gérer undefined

```ts
// AVANT (v2)
const pos = nodeViewProps.getPos()
// pos était toujours un number

// APRÈS (v3)
const pos = nodeViewProps.getPos()
if (pos !== undefined) {
  // utiliser pos
}
```

### 3f. setContent / clearContent — émettent des updates par défaut

En v3, `setContent` et `clearContent` émettent des updates par défaut. Si ce comportement est indésirable dans certains cas, passer `{ emitUpdate: false }` en option.

---

## Étape 4 — Type-check + build

```bash
npx tsc --noEmit
pnpm build
```

---

## Étape 5 — Test visuel

```bash
pnpm dev
```

Vérifier dans le backoffice `/cms` :
- [ ] L'éditeur se charge sans erreur d'hydration
- [ ] La saisie de texte fonctionne
- [ ] Les liens (`extension-link`) fonctionnent
- [ ] La toolbar/bubble menu fonctionne (si présente)
- [ ] Le contenu existant s'affiche correctement

---

## Commit

```bash
git add -A
git commit -m "build: ⬆️ @tiptap/* 2 → 3"
```

---

## Notes

- **StarterKit v3 inclut désormais `underline` et `link` par défaut** — si `@tiptap/extension-link` est configuré manuellement, désactiver le link intégré au StarterKit : `StarterKit.configure({ link: false })` puis utiliser l'extension custom.
- **Packages consolidés** : certains packages comme `@tiptap/extension-table`, `@tiptap/extension-list-*` ont été regroupés — si d'autres extensions sont ajoutées plus tard, vérifier le nouveau schéma d'import.
- **tippy.js supprimé** : tout usage de styles CSS tippy dans le projet devra être migré vers floating-ui.
