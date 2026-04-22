# Migration : Stripe 17 → 22 + @stripe/stripe-js 5 → 9

## Objectif
Mettre à jour `stripe` (17.7.0 → 22.x) et `@stripe/stripe-js` (5.10.0 → 9.x) dans kadath.fr.

## Contexte projet
- `stripe` : utilisé côté serveur (Server Actions, webhooks, API)
- `@stripe/stripe-js` : utilisé côté client (Stripe Elements, paiements)

---

## Étape 1 — Audit préliminaire

Scanner tous les usages Stripe dans le projet :

```bash
grep -rn "stripe\|Stripe" --include="*.ts" --include="*.tsx" src/ | grep -v "node_modules"
```

Identifier et noter :
- Comment Stripe est initialisé : `Stripe('sk...')` ou `new Stripe('sk...')`
- Les types utilisés : `Stripe.StripeError`, `Stripe.StripeContext`
- Les callbacks (`.then()`, fonctions callback) vs async/await
- Les références à `stripe/types` dans les imports ou directives
- Les champs `decimal_string` manipulés (montants, taux de change)
- L'usage de `stripe.customers.retrieve(id, apiKey)` avec apiKey en 2ème arg
- Les webhooks : `stripe.webhooks.constructEvent()`

---

## Étape 2 — Mise à jour des packages

```bash
pnpm add stripe@latest @stripe/stripe-js@latest
```

---

## Étape 3 — Corrections de code

### 3a. Initialisation Stripe — `new Stripe()` obligatoire depuis v22

```ts
// AVANT (v17) — les deux formaient acceptés
const stripe = Stripe('sk_test_...')
const stripe = new Stripe('sk_test_...')

// APRÈS (v22) — new obligatoire
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
```

Vérifier tous les fichiers qui instancient Stripe et s'assurer que `new` est présent.

### 3b. Import ESM recommandé

```ts
// AVANT (v17) — CJS encore courant
const stripe = require('stripe')

// APRÈS (v22) — ESM recommandé (CJS encore supporté mais déprécié)
import Stripe from 'stripe'
```

### 3c. Types TypeScript — StripeError

```ts
// AVANT
let err: Stripe.errors.StripeError

// APRÈS — trois options
let err: typeof Stripe.errors.StripeError
let err: InstanceType<typeof Stripe.errors.StripeError>
let err: Stripe.ErrorType  // le plus simple
```

### 3d. Supprimer les directives /// <reference types="stripe/types" />

Si présentes dans le code, les supprimer — le dossier `types/` a été supprimé en v22, TypeScript résout les types automatiquement depuis la carte d'exports.

### 3e. Callbacks → async/await (si applicable)

```ts
// AVANT — callbacks (supprimés en v18+)
stripe.customers.list(customers => {
  // do something
})

// APRÈS — promises uniquement
const customers = await stripe.customers.list()
```

### 3f. Champs decimal_string — Stripe.Decimal (depuis v21)

Depuis v21, les champs comme `unit_amount_decimal`, `quantity_decimal`, `fx_rate` sont de type `Stripe.Decimal` au lieu de `string`.

Si ces valeurs sont simplement passées d'un objet Stripe à un autre, aucun changement nécessaire. Si elles sont manipulées arithmétiquement ou converties :

```ts
// Lire la valeur numérique
const amount = session.amount_total // toujours number, pas affecté
const decimal = session.currency_conversion?.fx_rate // Stripe.Decimal
const asString = decimal?.toString() // conversion explicite si nécessaire
```

### 3g. API Billing — si utilisée (v18)

Si le projet utilise des abonnements/invoices Stripe :
- `stripe.invoices.upcoming()` → remplacé par `stripe.invoices.createPreview()`
- `total_count` sur les listes n'est plus supporté (ne pas expand `total_count`)
- Les Checkout Sessions pour abonnements créent maintenant l'abonnement après le paiement

---

## Étape 4 — Type-check + build

```bash
npx tsc --noEmit
pnpm build
```

Corriger toutes les erreurs TypeScript avant de continuer.

---

## Étape 5 — Test fonctionnel

**Important** : Stripe gère des paiements réels. Tester en mode test uniquement.

Vérifier avec les clés de test (`sk_test_...`, `pk_test_...`) :
- [ ] Initialisation du client Stripe sans erreur
- [ ] Les webhooks `stripe.webhooks.constructEvent()` fonctionnent
- [ ] Les Stripe Elements se chargent côté client
- [ ] Les Server Actions qui appellent l'API Stripe ne retournent pas d'erreur de type
- [ ] Les montants s'affichent correctement (pas de régression sur les champs decimal)

---

## Commit

```bash
git add -A
git commit -m "build: ⬆️ stripe 17 → 22 + @stripe/stripe-js 5 → 9"
```

---

## Notes importantes

- **Ne jamais tester les changements Stripe en production** sans avoir validé sur les clés de test.
- **v19/v20** utilisent la même API version `2025-09-30.clover` — pas de migration guide séparé, seulement des changelogs. Les breaking changes SDK sont mineurs entre ces versions.
- **v22 et v21** utilisent la même API version `2026-03-25.dahlia` — upgrader de v21 à v22 est principalement un changement de types TypeScript.
- **`@stripe/stripe-js`** côté client : l'API `loadStripe()` reste stable entre v5 et v9, les changements sont principalement des types et des nouvelles fonctionnalités.
