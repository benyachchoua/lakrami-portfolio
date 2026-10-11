# Portfolio académique — Fatima Lakrami

React, Vite et Tailwind CSS pour le site public et l'administration ; Express et SQLite pour les données.

## Démarrage local

Prérequis : Node.js 22.13 ou supérieur (Node.js 24 conseillé).

```sh
npm ci
npm run dev:full
```

Ouvrir **http://localhost:3000**. L'API utilise le port 3001. Vite relaie `/api` et `/uploads` vers le serveur : aucune URL externe n'est nécessaire en local. Le port 3000 doit être libre.

La base existante `portfolio.db` et les fichiers `uploads/` sont conservés. Se connecter à `/login` avec le compte existant. Les sessions sont vérifiées par le serveur et expirent ; une ancienne identité enregistrée dans le navigateur ne donne plus accès à l'administration.

## Nouvelle installation

Si aucune base n'existe, définir `ADMIN_EMAIL` et `ADMIN_PASSWORD` dans l'environnement avant le premier démarrage. Le mot de passe doit contenir au moins 12 caractères et au plus 72 octets. Aucun mot de passe administrateur par défaut n'est créé.

Exemple PowerShell, avec vos propres valeurs :

```powershell
$env:ADMIN_EMAIL = 'votre-adresse@example.org'
$env:ADMIN_PASSWORD = 'votre-mot-de-passe-long-et-unique'
npm run dev:full
```

Ces variables ne remplacent pas le mot de passe d'un compte déjà existant. Modifier un ancien mot de passe faible depuis l'éditeur de profil. Ne pas versionner les mots de passe, fichiers de sessions ou sauvegardes de base.

## Vérifications

```sh
npm run lint
npm test
npm run build
# Ou les trois à la suite :
npm run check
```

Les tests de l'API utilisent des bases temporaires, sans modifier le portfolio réel.

## Production

```sh
npm ci
npm run build
npm start
```

`npm start` fonctionne sous Windows et Linux et sert le build depuis Express. Configurer `PORT` selon l'hébergeur. La production nécessite HTTPS pour les cookies sécurisés. Garder le frontend et l'API sur la même origine est recommandé. La base SQLite et le dossier des fichiers doivent être sur un volume persistant et sauvegardés.

| Variable | Usage |
| --- | --- |
| `PORT` | Port Express ; 3001 par défaut |
| `DB_PATH` | Chemin du fichier SQLite |
| `UPLOAD_DIR` | Dossier des photos |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Création du premier administrateur pour une nouvelle base |
| `PUBLIC_USER_ID` | Propriétaire du portfolio public ; premier profil par défaut |
| `CORS_ORIGINS` | Origines autorisées séparées par une virgule, sans chemin |
| `VITE_API_URL` | URL d'une API séparée, intégrée lors du build ; vide pour la même origine |

Les variables serveur doivent être fournies par le shell ou l'hébergeur. Le serveur ne charge pas automatiquement les fichiers `.env`. Les variables `VITE_*` sont publiques : ne jamais y placer de secret.

Les protections comprennent les sessions HttpOnly, le contrôle du propriétaire pour les modifications, la limitation des tentatives de connexion, la validation des entrées et des photos, ainsi que la purification du HTML affiché. Elles ne remplacent pas la gestion des accès, les sauvegardes et les mises à jour régulières de l'hébergement.
# lakrami-portfolio

Pour héberger le frontend sur Vercel avec le serveur Express et les données
sur un disque persistant, suivre [le guide de déploiement](DEPLOYMENT.md).
