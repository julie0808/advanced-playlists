# Liste de lecture Youtube avancées

Étant une utilisatrice avide de Youtube, j'ai atteint un point où mes listes de lectures sont devenues inutilisables. Spécialement pour les listes de musique avec plus de 300 items, je ne trouve pas facilement ce que je veux.

## La solution

Créer un système de "tags". En associant ces tags aux videos de mes listes d'origine sur Youtube, je peux gérer dans ma nouvelle plateforme, à l'aide de filtre, ce que j'ai envie d'écouter.

### Donctionnaliés prévues pour la release 1.0.0 (MVP - most viable product)

- Créer des tags sur 2 niveaux (Un tag peut avoir un tag parent)
- Ajout de un ou plusieurs tags à un video
- Filtrer par tag, longueur de video, playlist d'origine
- Lecture à même l'application, selon les filtres choisis

### Fonctionnalités pour une release future

- Enregistrement de filtres pour les réutiliser à une visite ultérieure
- Authentification Google pour pouvoir gérer la liste de n'improte quelle usager Youtube (actuellement hardcodé pour mon usage personnel)
- Organiser la liste de lecture selon la date d'ajout à la liste d'origine
- Filtre les vidéos pour voir seulement ceux ajoutés depuis la dernière visite
- Filtrer par Artiste
- Filtre par longueur de video
- Jouer de façon aléatoire la liste en cours
- Optimisation "mobile-first" pour l'usage sur n'importe quel appareil


## Choix technologiques

- Angular12
- PHP pour la communication avec la base de données
- SCSS / SASS
- Trello pour la gestion des priorités et de l'avancement

## Info Angular

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
