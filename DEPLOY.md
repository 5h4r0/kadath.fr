# DEPLOY.md — kadath.fr

Procédure de déploiement et pièges connus.

---

## Environnements

| Domaine | Rôle | Supabase |
|---|---|---|
| `localhost:3000` | Dev local | Instance locale `127.0.0.1:54321` |
| `kadath.fr` | Préprod | Projet distant `jxgwjpoqbqgdvpoldmzs` |
| `thinktwice.sokol.fr` | Prod | Projet distant `jxgwjpoqbqgdvpoldmzs` |

---

## Variables d'environnement

### `.env.local` (dev local uniquement, jamais committé)

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<clé locale — voir supabase status --output env>
```

⚠️ La `SUPABASE_SERVICE_ROLE_KEY` locale est différente de la clé cloud.
Récupérer la clé locale avec :

```bash
supabase status --output env | grep SERVICE_ROLE_KEY
```

### Firebase Secret Manager (préprod + prod)

Créer ou mettre à jour un secret :

```bash
printf 'VALEUR_DU_SECRET' | firebase apphosting:secrets:set NOM_DU_SECRET
```

⚠️ **Toujours `printf`, jamais `echo`** — `echo` ajoute un `\n` en fin de chaîne qui corrompt les JWT silencieusement.

Après chaque `apphosting:secrets:set`, vérifier que la variable est bien listée dans `apphosting.yaml` :

```yaml
- variable: NOM_DU_SECRET
  secret: NOM_DU_SECRET
```

---

## Supabase local

### Reset complet (migrations + seed)

```bash
supabase db reset
```

⚠️ `supabase stop && supabase start` repart du backup Docker — il **ne réapplique pas les migrations**.
Après un `stop && start`, toujours faire un `db reset` si des migrations ont été ajoutées.

### Récupérer les clés locales

```bash
supabase status --output env
```

### Régénérer les types TypeScript après migration

Via Claude Code (MCP Supabase) ou :

```bash
supabase gen types typescript --local > src/types/supabase.ts
```

---

## Déploiement Firebase

Le déploiement se déclenche automatiquement sur push vers `dev`.

Forcer un redéploiement sans changement de code :

```bash
git commit --allow-empty -m "chore: force redeploy" && git push
```

Après création d'un nouveau secret, accorder l'accès au backend :

```bash
firebase apphosting:secrets:grantaccess NOM_DU_SECRET --backend kadath-fr-web-app
```

---

## CookieYes

- Enregistré sur `thinktwice.sokol.fr` uniquement
- Désactivé sur `kadath.fr` et `localhost` via la variable `NEXT_PUBLIC_COOKIEYES_ENABLED`
- Secret Firebase : `NEXT_PUBLIC_COOKIEYES_ENABLED=true` (prod uniquement)
- En local et kadath.fr : variable absente = bandeau désactivé

---

## Checklist avant push

- [ ] Migrations locales non vides (`supabase/migrations/*.sql`)
- [ ] `supabase db reset` passé sans erreur
- [ ] `src/types/supabase.ts` régénéré si migration ajoutée
- [ ] Nouveaux secrets ajoutés dans `apphosting.yaml`
- [ ] `pnpm build` sans erreur TypeScript
