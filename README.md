# Liste de lecture Youtube avanc�es

�tant une utilisatrice avide de Youtube, j'ai atteint un point o� mes listes de lectures sont devenues inutilisables. Sp�cialement pour les listes de musique avec plus de 800 items, je ne trouve pas facilement ce que je veux.

## La solution

Cr�er un syst�me de "tags". En associant ces tags aux videos de mes listes d'origine sur Youtube, je peux g�rer dans ma nouvelle plateforme, � l'aide de filtre, ce que j'ai envie d'�couter.

### Fonctionnali�s actuelles

- Cr�er / modifier / supprimer un tag
- Ajouter / supprimer un tag � un video (multiple tags par vid�o possible)
- Lecture � m�me l'application, selon les filtres choisis
- Branchement � l'authentification Youtube pour que l'app prenne en compte l'abonnement Youtube Premium
- Connexion � l'API de Youtube pour obtenir la liste de lecture d�sir�e (hardcod�e pour le moment)

## Utilisation de l'outil

Il est seulement possible d'utiliser l'outil en environnement local. Voir la [documentation technique](_doctech/tech.md)


## Choix technologiques

- Angular (version 15)
- Node.js pour le Backend
- Postgres SQL
- SCSS / SASS

## Info Angular

Projet g�n�r� avec [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.
