# INSTRUCTIONS ASSISTANT CLAUDE - kadath.fr

## CONTEXTE
Tu es l'assistant de développement pour le site *kadath.fr*, un site de développeur web / WordPress / NodeJS Typescript ReactJS.

## INFORMATIONS ESSENTIELLES

*Emplacement projet* :
\\wsl.localhost\Ubuntu\home\sharo\claude_projects\kadath.fr


*Stack technique* :
- Next.js 15+
- React 18.3+ avec TypeScript
- Tailwind CSS
- Supabase (base de données, déjà configuré)
- Firebase Hosting (déjà configuré)

*Branches Git* :
- dev : Développement (branche de travail par défaut)
- main : Production (déployée sur Firebase)

*Règle d'or* : TOUJOURS travailler sur la branche DEV

## CHARTE GRAPHIQUE (STRICT)

*Couleurs* :
- Primary : #FF9F1C (Orange - boutons, CTA)
- Secondary : #2EC5B6 (Turquoise - accents)
- Noir : #000000 (textes, backgrounds)
- Blanc : #FFFFFF

*Typographie* :
- Titres (H1, H2, H3) : *Abandoned Heavy* (font custom dans /public/fonts/)
- Texte : Inter ou system font

*Design* : Mobile-first, responsive

## COMMANDES ESSENTIELLES

bash
# Développement
npm run dev              # Lancer le serveur (http://localhost:5173)
npm run build            # Build de production
npm run preview          # Preview du build

# Git
git status               # Vérifier la branche et les changements
git checkout DEV         # Basculer sur DEV
git add .                # Ajouter les changements
git commit -m "message"  # Commiter
git push origin DEV      # Push vers GitHub

# Déploiement Firebase (l'utilisateur doit faire firebase login manuellement)
npm run build
firebase deploy --only hosting

# Supabase CLI (gestion de la base de données)
supabase --version       # Vérifier l'installation (v2.75.0)
supabase login           # Se connecter à Supabase
supabase link            # Lier le projet local au projet Supabase
supabase db diff         # Voir les changements de schéma
supabase db push         # Appliquer les migrations
supabase start           # Démarrer Supabase en local (dev)
supabase stop            # Arrêter Supabase local


## PRIORITÉS

1. 🔴 Corriger les bugs
2. 🟠 Finaliser les fonctionnalités existantes
3. 🟡 Optimiser performances et SEO
4. 🟢 Ajouter nouvelles fonctionnalités

*Deadline projet* : 31/12/2025

## RÈGLES DE DÉVELOPPEMENT

✅ *TOUJOURS* :
- Travailler sur la branche DEV
- Utiliser TypeScript avec types stricts
- Respecter la charte graphique
- Tester avant de commiter
- Être mobile-first

❌ *JAMAIS* :
- Commiter sur main directement
- Utiliser any en TypeScript
- Ignorer les erreurs ESLint

## STRUCTURE IMPORTANTE


src/
├── components/       # Composants réutilisables
│   ├── ui/           # Boutons, inputs, cards, etc.
│   ├── layout/       # Header, Footer, Layout
│   └── features/     # Portfolio, Contact, etc.
├── pages/            # Pages du site
├── lib/              # Supabase client, utils
└── styles/           # CSS global

public/
├── fonts/            # Abandoned Heavy
└── images/           # Images du site


## FONCTIONNALITÉS DU SITE

*Déjà implémentées* :
- Homepage avec hero, services, portfolio, avis
- Portfolio d'instruments (filtres par type)
- Formulaires (contact, RDV, devis)
- Pages légales
- Intégration Instagram

*Concept unique* : Puce NFC + NFT blockchain dans chaque instrument (à mettre en avant)

## AVANT DÉPLOIEMENT

- [ ] Tests mobile (375px, 414px, 768px)
- [ ] Tests desktop (1280px, 1920px)
- [ ] Vérifier formulaires fonctionnent
- [ ] Vérifier images s'affichent
- [ ] npm run build sans erreur
- [ ] Pas d'erreurs console
- [ ] Lighthouse score > 90

## CONFIGURATION

*Variables d'environnement* : Le fichier .env existe déjà avec :
- VITE_SUPABASE_URL (configuré)
- VITE_SUPABASE_ANON_KEY (configuré)
- VITE_INSTAGRAM_ACCESS_TOKEN (configuré)

*Supabase* : Base de données déjà configurée avec tables (instruments, contact_submissions, bookings, etc.)
- *Supabase CLI v2.75.0 installé* via Scoop
- Migrations dans supabase/migrations/
- Schéma de DB : Tables pour instruments, contacts, réservations, devis, actualités, avis
- RLS (Row Level Security) activé
- Storage configuré pour les images

*Firebase* : Projet cy-art-luthier déjà configuré

## EN CAS DE PROBLÈME

*Build échoue* :
bash
npm run type-check  # Vérifier TypeScript
npm run lint        # Vérifier ESLint
rm -rf node_modules package-lock.json
npm install
npm run build


*Git bloqué* :
bash
git status          # Voir l'état
git stash           # Mettre de côté les changements
git checkout DEV    # Retour sur DEV
git stash pop       # Récupérer les changements


*Supabase inaccessible* :
bash
# Vérifier les clés dans .env
cat .env | grep SUPABASE

# Tester la connexion
supabase projects list

# Relancer en local si nécessaire
supabase start


## CONTACT CLIENT

- *Nom* : Stéphane Rochard
- *Email* : kadath@sharo.fr
- *Tél* : 06 23 71 18 12
- *Site prod* : https://kadath.fr

## TON RÔLE

1. Lire toujours ces instructions en premier
2. Vérifier que tu es sur la branche DEV
3. Proposer des solutions claires et testables
4. Expliquer ce que tu fais
5. Respecter strictement la charte graphique
6. Tester avant de commiter

---

*Documentation complète* : Consulte README.md et PROMPT-CLAUDE-CODE-MASTER.md pour plus de détails.

Firebase en dev et Main
