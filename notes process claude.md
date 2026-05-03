# Claude.ai \ Claude Code / processus

**Moi (Sonnet 4.6 / Claude.ai) vs Claude Code pour la suite :**

|                                   | Claude.ai (moi)         | Claude Code                                |
|-----------------------------------|-------------------------|--------------------------------------------|
| Décisions d'architecture          | ✅ idéal                | ⚠️ possible mais moins fluide             |
| Écrire/modifier du code           | ⚠️ je génère, tu copies | ✅ il écrit directement dans les fichiers |
| Débugger une erreur               | ✅ bon                  | ✅ meilleur (il voit les fichiers)        |
| Réfléchir / concevoir             | ✅ idéal                | ⚠️ orienté action                         |
| Contexte long (comme aujourd'hui) | ✅                      | ✅ via CLAUDE.md                          |


**Ressources :**
Claude Code consomme des tokens à chaque action fichier — sur des tâches longues ça monte vite.
Pour les décisions et specs → ici c'est plus économique. Pour l'implémentation → Claude Code directement.

**Workflow optimal :**
- **Ici** → specs, décisions, révisions d'architecture
- **Claude Code** → implémentation, debug, migrations

---

Voici exactement ce que tu tapes dans Claude Code :

Lis et applique intégralement le fichier kadath-claude-code-instructions-final.md

Si le fichier est dans ~/claude_projects/kadath.fr/, Claude Code le lit directement. Sinon tu peux coller le contenu du fichier directement dans le prompt.
Ensuite dans l'ordre :

- Claude Code scaffold → vérifie que tout est créé
- Colle le prompt Supabase (copié depuis Studio) → ajuste src/lib/supabase/
- npx skills add supabase/agent-skills
- Copie les .woff2 dans public/fonts/
- Remplis .env.local avec tes clés
- pnpm install
- supabase start
- pnpm dev → localhost:3000

Bonne chance — et reviens ici pour les specs vitrine ou si Claude Code bloque sur quelque chose 🚀

---

Rappel ordre dans Claude Code :

- Nos instructions v2 en premier
- Prompt Supabase ensuite — il ajuste src/lib/supabase/ sans écraser le reste


Pour Claude Code :

- Génère/mets à jour CLAUDE.md, README.md, ARCH.md et REF.md à partir des fichiers créés et des décisions techniques du projet.


---

Specs frontend ReactJS manquantes — pages de la vitrine, leur contenu, les composants - prochaine étape logique après le scaffold.

---


Ionos + Firebase :

Chez Ionos (DNS)

Pour kadath.fr :
A     @        151.101.x.x   (IP Firebase Hosting)
A     www      151.101.x.x

Pour kadath.fr/manage :
A     manage   151.101.x.x   (même IP Firebase Hosting)

Les IPs exactes te sont données par Firebase quand tu ajoutes un domaine personnalisé.

Dans Firebase Console
Hosting → Add custom domain :

Ajouter kadath.fr
Ajouter www.kadath.fr → redirect vers kadath.fr
Ajouter kadath.fr/manage

Firebase génère automatiquement les certificats SSL Let's Encrypt pour chaque domaine — rien à acheter, rien à configurer manuellement. Il faut juste attendre la propagation DNS (quelques minutes à 48h).

Ordre recommandé :

Déployer une première fois sur Firebase (firebase deploy)
Puis ajouter les domaines dans la console
Copier les enregistrements DNS dans Ionos
Attendre propagation → SSL actif automatiquement

On s'en occupe quand le scaffold est fait et que tu as quelque chose à déployer. Rien d'urgent maintenant.


---


Créer les comptes auth dans Supabase Studio :
Dans le dashboard Supabase → Authentication → Users → Add user → "Create new user"
Créer :

admin@kadath.fr + mot de passe test
editor@kadath.fr + mot de passe test
client1@test.fr + mot de passe test
client2@test.fr + mot de passe test

Chaque utilisateur créé reçoit un UUID automatique — tu le vois dans la liste.

Mettre à jour les UUIDs dans le seed :
En haut du fichier seed.sql il y a des UUIDs fictifs comme a0000000-0000-0000-0000-000000000001 — tu les remplaces par les vrais UUIDs copiés depuis Authentication > Users.

Exécuter via SQL Editor :
Dashboard Supabase → SQL Editor → coller le contenu du seed.sql → Run


---

https://console.cloud.google.com/iam-admin/iam?authuser=0&project=kadath-fr&hl=fr c'est utile, google cloud, pour firebase ?
Oui, directement utile. Firebase tourne sur Google Cloud — ton projet kadath-fr est déjà lié.
Ce que tu peux y faire de pertinent pour ton projet :

IAM — gérer les permissions des comptes de service (Firebase Admin SDK, GitHub Actions CI/CD)
Service Accounts — créer/télécharger les clés pour Firebase Admin côté serveur (Next.js Route Handlers)
Billing — surveiller les coûts Firebase App Hosting + éventuellement Data Connect si tu l'avais utilisé
Cloud Storage — accès avancé aux buckets Firebase Storage si besoin

Pour ton usage quotidien, la Firebase Console suffit. Google Cloud Console devient utile quand tu attaques le CI/CD (clé de service account pour GitHub Actions) ou si tu as besoin de permissions fines.
