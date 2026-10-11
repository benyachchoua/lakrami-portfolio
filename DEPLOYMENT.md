# Déploiement : Vercel et serveur persistant

Le frontend React est déployé sur Vercel. Le serveur Express conserve SQLite,
les sessions et les photos sur un disque persistant. `vercel.mjs` relaie `/api`
et `/uploads` vers ce serveur ; le navigateur utilise l'adresse du site,
y compris pour les cookies de connexion. Les autres routes ouvrent React,
ce qui permet de recharger directement `/login` ou `/admin`.

## 1. Héberger le serveur Express

Le serveur doit disposer de Node.js 22.13 ou supérieur, de HTTPS et d'un disque
persistant. Exemple avec un service web Node.js sur Render :

- Dépôt : `benyachchoua/lakrami-portfolio`, branche `main`.
- Build : `npm ci && npm run build`.
- Démarrage : `npm start`.
- Disque persistant : monté sur `/var/data`.
- Variables : `NODE_ENV=production`, `DB_PATH=/var/data/portfolio.db`,
  `UPLOAD_DIR=/var/data/uploads`, `TRUST_PROXY=1`.

Le disque persistant Render nécessite un service payant. Créer le service
seulement après avoir vérifié son tarif dans le tableau de bord.

Pour conserver le portfolio actuel, arrêter les écritures locales, transférer
la base `portfolio.db` sur le disque et les fichiers de `uploads/` dans
`/var/data/uploads`, puis démarrer le serveur. Faire une sauvegarde avant
le transfert. La base contient les comptes et les sessions : la transférer
par un accès privé au serveur, sans la publier dans GitHub ou Vercel.

Pour une nouvelle installation, définir `ADMIN_EMAIL` et `ADMIN_PASSWORD`
directement chez l'hébergeur (mot de passe de 12 caractères minimum,
72 octets maximum). Cela crée un nouveau portfolio avec les valeurs initiales ;
cela n'importe pas les modifications de la base locale.

Noter l'origine HTTPS du serveur, sans `/api`. Vérifier que
`https://ADRESSE-DU-SERVEUR/api/portfolio` renvoie le profil et les sections
attendus avant de poursuivre.

## 2. Déployer le frontend sur Vercel

Importer le même dépôt GitHub dans un nouveau projet Vercel :

- Répertoire racine : la racine du dépôt.
- Framework : Vite.
- Installation : `npm ci`.
- Build : `npm run build`.
- Dossier de sortie : `dist`.
- Version Node.js : 24.x.
- `BACKEND_URL` : l'origine HTTPS du serveur Express, pour Production et Preview.
- `VITE_API_URL` : laisser vide, ou supprimer cette variable du tableau de bord.

`BACKEND_URL` est lu par la configuration Vercel à la construction. Il ne faut
pas le préfixer par `VITE_`. La configuration bloque le déploiement si cette
adresse manque ou n'est pas une origine HTTPS valide.

Après avoir obtenu l'adresse du site, définir sur le serveur Express
`CORS_ORIGINS=https://ADRESSE-DU-SITE.vercel.app`, puis redémarrer le serveur.
Ajouter chaque domaine personnalisé ou adresse de preview à utiliser,
séparés par des virgules. Ne pas utiliser un joker : le serveur vérifie
l'origine des requêtes de modification.

Les identifiants administrateur sont configurés uniquement sur le serveur.
`.vercelignore` exclut la base, les photos locales (sauf l'icône référencée
par `index.html`), les fichiers `.env` et le code serveur de l'envoi du frontend.

## 3. Vérifier le site publié

1. Ouvrir `/api/portfolio` sur l'adresse Vercel : une réponse JSON avec le
   contenu attendu doit apparaître.
2. Ouvrir le site et vérifier les photos.
3. Se connecter sur `/login`, modifier un champ, puis recharger la page.
4. Recharger directement une page `/admin`.
5. Charger une photo et vérifier qu'elle reste accessible après un redémarrage
   du serveur.

Le frontend seul ne suffit pas à afficher le portfolio : l'API doit être
hébergée et la base transférée ou initialisée avant la mise en ligne.

Documentation : [Vite sur Vercel](https://vercel.com/docs/frameworks/frontend/vite),
[configuration programmatique](https://vercel.com/docs/project-configuration/vercel-ts),
[SQLite et Vercel](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel),
[disques persistants Render](https://render.com/docs/disks).
