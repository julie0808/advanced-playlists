# Liste de lecture Youtube avanc�es

�tant une utilisatrice avide de Youtube, j'ai atteint un point o� mes listes de lectures sont devenues inutilisables. Sp�cialement pour les listes de musique avec plus de 800 items, je ne trouve pas facilement ce que je veux.

## La solution

Cr�er un syst�me de "tags". En associant ces tags aux videos de mes listes d'origine sur Youtube, je peux g�rer dans ma nouvelle plateforme, � l'aide de filtre, ce que j'ai envie d'�couter.

### Fonctionnali�s actuelles

- Cr�er / modifier / supprimer un tag
- Ajouter / supprimer un tag � un video (multiple tags par vid�o possible)
- Filtrer par tag
- Lecture � m�me l'application, selon les filtres choisis
- Branchement � l'authentification Youtube pour que l'app prenne en compte l'abonnement Youtube Premium
- Connexion � l'API de Youtube pour obtenir la liste de lecture d�sir�e (hardcod�e pour le moment)

## Avancement actuel du projet

Liste de vid�os + �dition des tags associ�s :
![Video List](_doctech/videoList.jpg "Video list")

Liste de tags + �dition des tags  :
![Tag List](_doctech/tagList.jpg "Tag list")

### Fonctionnalit�s d�sir�e pour une release future

- Enregistrement de filtres pour les r�utiliser � une visite ult�rieure
- Filtrer les vid�os pour voir seulement ceux ajout�s depuis la derni�re visite
- Filtrer par Artiste
- Jouer de fa�on al�atoire la liste en cours


## Choix technologiques

- Angular (version 15)
- Node.js pour le Backend
- Postgres SQL
- SCSS / SASS
- Trello/Onenote pour la gestion des priorit�s et de l'avancement

## Info Angular

Projet g�n�r� avec [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
