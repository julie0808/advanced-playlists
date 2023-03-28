# Liste de lecture Youtube avancées

Étant une utilisatrice avide de Youtube, j'ai atteint un point où mes listes de lectures sont devenues inutilisables. Spécialement pour les listes de musique avec plus de 800 items, je ne trouve pas facilement ce que je veux.

## La solution

Créer un système de "tags". En associant ces tags aux videos de mes listes d'origine sur Youtube, je peux gérer dans ma nouvelle plateforme, à l'aide de filtre, ce que j'ai envie d'écouter.

### Fonctionnaliés actuelles

- Créer / modifier / supprimer un tag
- Ajouter / supprimer un tag à un video (multiple tags par vidéo possible)
- Lecture à même l'application, selon les filtres choisis
- Branchement à l'authentification Youtube pour que l'app prenne en compte l'abonnement Youtube Premium
- Connexion à l'API de Youtube pour obtenir la liste de lecture désirée (hardcodée pour le moment)

## Utilisation de l'outil

Il est seulement possible d'utiliser l'outil en environnement local. Voir la [documentation technique](_doctech/tech.md)


## Choix technologiques

- Angular (version 15)
- Node.js pour le Backend
- Postgres SQL
- SCSS / SASS

## Info Angular

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
