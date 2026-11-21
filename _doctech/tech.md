# Documentation technique

L'outil fonctionne uniquement en local. On doit lancer le frontend et le backend séparement.

## Logiciels requis
- VSCode
- PostgresSQL 18 & PgAdmin4 via l'installateur de Postgres : https://www.postgresql.org/download/
- Node : https://nodejs.org/en/download
- Git : https://git-scm.com/

### Instructions pour lancer l'application locale

## Pré-requis 
1. Service PostgresSQL actif (win + R -> services.msc -> vérifier si Postgres 18 est présent)
2. Base de données "fancyt" accessible
3. dans le dossier backend/.env, les informations correspondent à celles de la base de données
4. Dans VSCode, être connecté à Github

## Installation des dépendances de l'application

1. Ouvrir le dossier de projet dans VSCode.
2. Ouvrir un terminal et taper /cd client
3. taper "npm install"
4. Ouvrir un terminal et taper /cd server
5. taper "npm install"

## Lancement de l'application

Dans un terminal à la racine du projet, taper "npm start". Le frontend ET le backend vont être lancés. La page http://localhost:4200/ sera lancée automatiquement dans le navigateur par défaut.

# Debug la base de données

Vérifier si on est capable de chercher les Playlist via : http://localhost:3080/api-docs/
Si non, il est possible qu'il faille créer un nouvel utilisateur dans pgAdmin et ajuster les informations dans .env


## Accéder à l'outil

Utiliser l'outil : http://localhost:4200/
Tester l'API : http://localhost:3080/api-docs/


