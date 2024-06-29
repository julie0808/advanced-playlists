# WIP Release 2.2.0

## Ajouté
- WIP Gestion des playlists
- WIP Ajout de playlist par l'utilisateur (ajout à une playlist utilisateur des vidéos de n'importe quelle playlist Youtube existante)

## Modifié
- Il n'y a plus de playlist qui se charge par défaut avec l'application
- Si aucune playlist n'est sélectionnée, la barre des filtrse et les informations de la liste de vidéo sont cachées.


# Release 2.1.0

## Ajouté
- Chargement des tags et vidéos par playlist
- Possibilité de ordonner la liste par vidéo le moins récemment ajouté à la playlist originale sur Youtube
- Possibilité de jouer un vidéo en boucle

## Corrigé
- Les contrôles personnalisés de reculer/avancer/jouer un vidéo sont de nouveau fonctionnels
- Le numéro du vidéo actuellement joué est affiché correctement
- Les nouveaux vidéos sont de nouveaux enregistrés dans la base de données pour garder leur titre initial en mémoire
- Si on change de section, la liste de vidéos est correctement rafraichie au retour
- Quand un tag est modifié, cela édite aussi ses associations dans la liste de vidéos
- Si un vidéo est dans 2 playlists différentes, il ne partage pas les tags entre les listes.

## Modifié
- Modification structurelle au code - Index barrels
- Le tri par cote permet de sélectionner plusieurs cotes à la fois; un nom a également été donné aux cotes pour les rendre moins subjectives
- Mise à jour vers Angular 17

## Retiré
- Librairie "tingle" inutilisée



# Release 2.0.0

## Ajouté
- Implantation du Store NgRx

## Modifié
- Améliorations / optimisations diverses au code

## Retiré
- Tag manager : compte des vidéos ayant le tag associé
- Affichage des champs reliés au choix de playlist (codé de nouveau au dur pour la liste de kpop)
- Diverses fonctions désactivées non fonctionnelles avec NgRx pour le moment (playnext, playprevious, play first video of loaded playlist)



# Release 1.4.0 

## Ajouté
- Ajouté système rudimentaire de gestion de la cache
- Ajouté le nombre de vidéos liés à un tag pour référence
- Ajouté un champ description pour les tags
- Ajouté doc technique sur l'utilisation (ébauche)
- Ajouté plusieurs formats différents pour le lecteur de vidéo
- Ajouté contrôle de base pour le lecteur (jouer vidéo suivant/précédent, pause, jouer) 

## Modifié
- Refactoring des datastreams / usage de RXjs dans le service de vidéo pour corriger divers bugs et rendre plus lisible
- Refactoring du css pour avoir un .scss pour chaque component de façon logique

## Corrigé
- Supprimer correctement les références aux vidéos si un tag est supprimé
- Un nouveau vidéo ne donne plus l'erreur de "rating" absent
- L'API Youtube est seulement appelé le nombre de fois nécessaire plutôt qu'à chaque émission d'un inner observable



# Release 1.3.0

- Maintenant possible de choisir une différente playlist
- Ajout d'un état "publié" ou "indisponible" aux vidéos pour supporter les vidéos privatisés ou supprimés par leur auteur
- Ajout d'un filtre spécifique pour les artistes



# Release 1.2.1

- Ajout de modal de confirmation pour la suppression de tag
- Le titre d'un tag modifié se met maintenant correctement à jour dans les tags assignés dans la liste de vidéo 
- Choisir un filtre fait maintenant jouer le bon vidéo sur sélection
- Les filtres s'additionnent lorsque sélectionnés plutôt que de filtrer selon un seul choix
- Les couleurs des étoiles dans la sélection d'un filtre est corrigé



# Release 1.2.0

- Système de tag parent pour mieux catégoriser les vidéos
- Système de classement avec étoiles pour filtrer les vidéos
- Intégration de PrimeNG pour remplacer divers composantes
- Ajout d'un tri pour voir seulement les vidéos sans classement avec étoile
- Affichage des artistes de façon séparée des tags



# Release 1.1.0

- Mise à jour de divers modules obsolètes
- Charger correctement une liste de vidéos volumineuse



# Release 1.0.0

- MVP officiel
- Ajout du login via Google oAuth
- Videoplayer dans l'application
- Filter les vidéos par tags
- Enregistrer le titre initial des vidéos dans la base de données
- Branchement Initial à l'API youtube pour obtenir liste de lecture (hardcodé à 1 liste actuellement)
- Ajout, suppression et modification de tag
- Ajout ou suppression de tag assigné à un vidéo