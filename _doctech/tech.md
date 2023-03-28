# Documentation technique

L'outil fonctionne uniquement en local. On doit lancer le frontend et le backend séparement.

## Pré-requis
- Installer VSCode
- Installer [PGAdmin](https://www.pgadmin.org/download/)

### Instructions pour lancer le serveur local
1) Ouvrir le dossier de projet dans VSCode.
2) Ouvrir un terminal et taper /cd client
3) Taper /npm start pour activer le frontend sous Angular
4) Ouvrir un 2e terminal et taper /cd server
5) Taper /npm run start:dev

### Instructions pour la base de données
1) Installer la base de données (TODO)
2) S'assurer que les informations de connexion correspondent dans le dossier server/.env

## Accéder à l'outil

Utiliser l'outil : http://localhost:4200/

Tester l'API : http://localhost:3080/api-docs/