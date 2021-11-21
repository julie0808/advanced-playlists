# Liste de lecture Youtube avanc�es

�tant une utilisatrice avide de Youtube, j'ai atteint un point o� mes listes de lectures sont devenues inutilisables. Sp�cialement pour les listes de musique avec plus de 300 items, je ne trouve pas facilement ce que je veux.

## La solution

Cr�er un syst�me de "tags". En associant ces tags aux videos de mes listes d'origine sur Youtube, je peux g�rer dans ma nouvelle plateforme, � l'aide de filtre, ce que j'ai envie d'�couter.

### Fonctionnali�s pr�vues pour la release 1.0.0 (MVP - minimum viable product)

- Cr�er / modifier / supprimer un tag
- Ajouter / supprimer un tag � un video (multiple tags par vid�o possible)
- Filtrer par tag, playlist d'origine
- Lecture � m�me l'application, selon les filtres choisis
- Connexion � l'API de Youtube pour obtenir mes listes de lecture

### Fonctionnalit�s pour une release future

- Enregistrement de filtres pour les r�utiliser � une visite ult�rieure
- Authentification Google pour pouvoir g�rer la liste de n'importe quelle usager Youtube (actuellement hardcod� pour mon usage personnel)
- Organiser la liste de lecture selon la date d'ajout � la liste d'origine
- Filtrer les vid�os pour voir seulement ceux ajout�s depuis la derni�re visite
- Filtrer par Artiste
- Filtre par longueur de video
- Jouer de fa�on al�atoire la liste en cours
- Optimisation "mobile-first" pour l'usage sur n'importe quel appareil


## Choix technologiques

- Angular (version 12)
- Back4app / Parse API - Sauvegarde des tags assign�s sur une base de donn�es accessible via l'API Parse
- SCSS / SASS
- Trello pour la gestion des priorit�s et de l'avancement

## Info Angular

Projet g�n�r� avec [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
