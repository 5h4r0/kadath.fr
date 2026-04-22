# Migration : Zod 3 → 4

## Objectif
Mettre à jour `zod` (3.25.76 → 4.x) dans kadath.fr.

## Contexte projet
- ~20 tables avec schemas Zod (validation API, forms, env vars)
- Usage probable : `z.string().email()`, `z.string().uuid()`, `z.record()`, `z.object()`, error messages custom
- Librairies tierces à vérifier : `@hookform/resolvers` (react-hook-form), `zod-validation-error` si présent

---

## Étape 0 — Audit préliminaire

Avant toute modification, scanner le projet pour identifier les patterns à risque :

```bash
# Error maps custom
grep -rn "errorMap\|invalid_type_error\|required_error" --include="*.ts" --include="*.tsx" src/

# z.record() avec un seul argument
grep -rn "z\.record(" --include="*.ts" --include="*.tsx" src/

# z.string().uuid() — à migrer vers z.guid() si UUIDs non RFC 4122 stricts
grep -rn "z\.string()\.uuid\|z\.string()\.email\|z\.string()\.url" --include="*.ts" --include="*.tsx" src/

# .optional().default() ou .default().optional()
grep -rn "\.optional()\.default\|\.default.*\.optional" --include="*.ts" --include="*.tsx" src/

# .merge() déprécié
grep -rn "\.merge(" --include="*.ts" --include="*.tsx" src/

# .superRefine() déprécié
grep -rn "\.superRefine(" --include="*.ts" --include="*.tsx" src/

# error.errors (renommé en error.issues)
grep -rn "\.errors\b" --include="*.ts" --include="*.tsx" src/
```

Noter tous les résultats avant de commencer.

---

## Étape 1 — Codemod officiel

```bash
npx @zod/codemod --transform v3-to-v4 ./src
```

Le codemod gère automatiquement :
- `z.string().email()` → `z.email()`
- `z.string().uuid()` → `z.guid()` (compatible v3, pas z.uuid() qui est plus strict RFC 4122)
- `z.string().url()` → `z.url()`
- `z.string().ip()` → `z.ip()`
- `z.string().datetime()` → `z.iso.datetime()`
- `z.string().date()` → `z.iso.date()`
- `z.string().time()` → `z.iso.time()`
- `message:` → `error:` dans les options de validation

Inspecter le diff après le codemod avant de continuer.

---

## Étape 2 — Corrections manuelles

### 2a. z.record() — maintenant 2 arguments obligatoires

```ts
// AVANT (v3) — clé implicitement string
z.record(z.number())

// APRÈS (v4)
z.record(z.string(), z.number())
```

### 2b. error.errors → error.issues

```ts
// AVANT (v3)
if (result.error) {
  console.log(result.error.errors)
}

// APRÈS (v4)
if (result.error) {
  console.log(result.error.issues)
}
```

### 2c. invalid_type_error / required_error → error (fonction)

```ts
// AVANT (v3)
z.string({
  required_error: "Ce champ est requis",
  invalid_type_error: "Doit être une chaîne",
})

// APRÈS (v4)
z.string({
  error: (issue) =>
    issue.input === undefined
      ? "Ce champ est requis"
      : "Doit être une chaîne",
})
```

### 2d. .merge() déprécié → .extend()

```ts
// AVANT (v3)
const merged = SchemaA.merge(SchemaB)

// APRÈS (v4)
const merged = SchemaA.extend(SchemaB.shape)
```

### 2e. .superRefine() déprécié → .check()

```ts
// AVANT (v3)
z.string().superRefine((val, ctx) => {
  if (val.length < 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Trop court" })
  }
})

// APRÈS (v4)
z.string().check((ctx) => {
  if (ctx.value.length < 3) {
    ctx.issue({ code: "custom", message: "Trop court" })
  }
})
```

### 2f. .optional().default() — comportement changé

En v4, `.default()` sur un champ `.optional()` retourne toujours la valeur par défaut même si la clé est absente.

```ts
// v3 : mySchema.parse({}) → {}
// v4 : mySchema.parse({}) → { field: "default" }
const mySchema = z.object({
  field: z.string().default("default").optional(),
})
```

Si ce comportement pose problème, restructurer le schéma.

---

## Étape 3 — Vérifier les dépendances tierces

### @hookform/resolvers
Vérifier la version installée. v4+ supporte Zod 4 :

```bash
pnpm add @hookform/resolvers@latest
```

### zod-validation-error (si présent)
Nécessite v5.0.0+ pour Zod 4 :

```bash
# Vérifier si présent
grep "zod-validation-error" package.json

# Si présent, mettre à jour
pnpm add zod-validation-error@latest
```

---

## Étape 4 — Type-check + build

```bash
npx tsc --noEmit
pnpm build
```

Corriger toutes les erreurs TypeScript avant de continuer.
Les erreurs les plus communes :
- `ZodTypeAny` → utiliser `ZodType` à la place
- `z.ZodIssueCode.custom` → `"custom"`
- Types de `ZodError` : `.errors` → `.issues`

---

## Étape 5 — Tests

```bash
pnpm test
```

---

## Commit

```bash
git add -A
git commit -m "build: ⬆️ zod 3 → 4"
```

---

## Notes importantes

- **z.uuid() vs z.guid()** : le codemod migre vers `z.guid()` qui est l'équivalent comportemental de v3. `z.uuid()` en v4 est plus strict (RFC 4122 complet) — ne pas l'utiliser sans vérifier que les UUIDs Supabase sont conformes (ils le sont, mais prudence).
- **ZodTypeAny supprimé** : si utilisé dans des types génériques, remplacer par `ZodType`.
- **ctx.path dans superRefine** : n'est plus disponible dans les callbacks `.check()` — restructurer si nécessaire.
- **Ordre de priorité des error maps inversé** : les error maps au niveau du schéma ont maintenant priorité sur les error maps contextuelles passées à `.parse()`. Vérifier si ce pattern est utilisé.
