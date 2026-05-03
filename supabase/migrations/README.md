# Migrations — thinktwice

Schéma PostgreSQL / Supabase pour le backoffice `kadath.fr/manage`.

## Ordre d'exécution

| Fichier | Contenu |
|---|---|
| `001_admin_users.sql` | Utilisateurs backoffice (admin / editor) + trigger `set_updated_at` |
| `002_settings.sql` | Paramètres globaux clé/valeur |
| `003_tags.sql` | Tags pour pages CMS |
| `004_cms_pages.sql` | Pages CMS, sections jsonb, galerie, SEO, navigation, `pages_tags`, `pages_linked` |
| `005_cms_page_revisions.sql` | Historique versions pages (manuel, 5 max) |
| `006_clients.sql` | Clients freelance |
| `007_projects.sql` | Projets / missions + images projet |
| `008_quotes_invoices.sql` | Devis, factures et leurs lignes |
| `009_payments.sql` | Paiements (Stripe + virement, acompte/solde) |
| `010_messages.sql` | Messagerie projet, pièces jointes, statut de lecture |
| `011_numbering_sequences.sql` | Numérotation auto devis/factures par année |

## Exécution via Supabase CLI

```bash
supabase db push
# ou migration par migration :
supabase migration new init
# copier le contenu dans supabase/migrations/
```

## Exécution via Supabase Studio

SQL Editor → coller chaque fichier dans l'ordre.

## Conventions

- Tous les `id` : `UUID` via `gen_random_uuid()`
- Soft delete : `deleted_at TIMESTAMPTZ` sur `clients`, `projects`, `quotes`, `invoices`
- `updated_at` : trigger automatique sur toutes les tables concernées
- Montants : `NUMERIC(10,2)` — jamais `FLOAT`
- RLS activé sur toutes les tables
- Index sur toutes les FK

## Tables many-to-many

| Relation | Table de jointure |
|---|---|
| `cms_pages` ↔ `tags` | `pages_tags` |
| `cms_pages` ↔ `cms_pages` (pages liées) | `pages_linked` |
| `messages` ↔ `auth.users` (statut lu) | `message_reads` |

## Règles métier

### Facturation
- Une facture peut être créée sans devis (`quote_id IS NULL`) — cas de facturation directe.
- Dans ce cas, `invoice_lines` porte l'intégralité du détail des prestations.
- Une facture liée à un devis (`quote_id NOT NULL`) hérite de ses lignes à la création, mais celles-ci sont indépendantes et modifiables après coup.

### Numérotation
- Format : `{PREFIX}-{YYYY}-{NNNN}` (ex: `DEVIS-2026-0001`)
- Préfixes configurables dans `settings` (`quote_prefix`, `invoice_prefix`)
- Reset automatique au 1er janvier (compteur par année)

### Images
- Chaque image référence soit `storage_uri` (Supabase Storage) soit `external_url` — jamais les deux, jamais aucun (contrainte CHECK)
- `alt` par défaut : `"Image"`
- Images projet : ajout/suppression par l'admin uniquement

### Clients — champs modifiables par le client
`first_name`, `last_name`, `email`, `phone`, `siret`, `address`, `activity`
Restriction appliquée côté Server Actions Next.js (pas en base).

### Cache CMS
`revalidateTag` Next.js — invalidation immédiate à chaque publication/modification de page depuis le backoffice.

### Thèmes frontend
`dark`, `light`, `accessible` — stockés en cookie (SSR) + `localStorage` (client). Pas en base.
