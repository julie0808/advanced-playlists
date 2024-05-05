## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Got to github in Tags section and "Create release"

Changement à sprintool:
https://www.baeldung.com/swagger-2-documentation-for-spring-rest-api
https://spring.io/guides/gs/rest-service/
https://spring.io/quickstart
https://spring.io/guides/gs/guides-with-vscode/

best ngrx practices to consider 
-- https://medium.com/@m3po22/stop-using-ngrx-effects-for-that-a6ccfe186399
-- https://angularindepth.com/posts/1442/ngrx-bad-practices

ncu -u (view current packages and available updates)
ng update angular/core@17 (1 major version at a time)






FOCUS
Travail de visuel brisé un peu partout avec le primeng à jour

- démystifier 3stats+, unique, coup de coeur..

Non bloquants mais nécessaire pour release 2.1.0 :
- HOTFIX les tags assigné ne sont pas à jour quand on édite un Tag
- HOTFIX problème quand le video est partagé entre les playlists; les tags de lautre playlist apparaissent quand meme dans l'édition de tag pour un vidéo. lier les tags au id unique plutôt que id video?



### lineup
- FEATURE éditer un tag en ayant le player, mais que ça continue où on en étant quand on retourne dans la liste de vidéo (pas reset au vidéo #1)

- FEATURE avoir sous-playlist avec ordre custom (ex: bts story line)
- écrire dans la docu les instructions pour installer la bd (tech.md)
- FEATURE mettre un commentaire à un video (ex : video dentrainement)
- FEATURE Raccourci pour scroller au vidéo actuellement lu dans videoList
- FEATURE avoir une loading bar précise? possible avec interceptor? autres options avec le store? async?
- HOTFIX - playlist dropdown width
- DEBT - subscribing to value to filters.. should I send observable to action ngrx?
- HOTFIX - redirect to videos not working
- DEBT - www.js 393 - enregsitrer le ID des playlist pour les vidéos. le but de cette table était de garder le titre original des vidéos, il faudrait ajuster ça aussi
- FEATURE - exlure des tags (ex : dance performance, live...)

### Backlog
- FEATURE changer primeng pour Material
- FEATURE "offline mode" tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- HOTFIX this.tag dans tag-edit à revoir
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent à un tag qui a des enfants
- FEATURE HOTFIX avoir le loading présent quand on sort / unsort + régler autre bogue de quand il n'apparait pas
- FEATURE fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affiché (unavailable, non published...). mais ne pas les montrer par défaut dans la liste
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE terminer la fonctionnalité détectant les duplications
- HOTFIX updateNewVideos() -> problématique si + de 50 vidéos
----- DEBT REFACTOR Latence en général. 850 vidéos... problème avec les observable ou normal? possibilité de lazy load?
- HOTFIX les @extends fonctionnent pas comme prévu avec l'encapsulation
- FEATURE enregistrer un groupe de filtre pour sélection rapide
- FEATURE voir la durée des vidéos
- FEATURE option pour jouer de façon aléatoire
- FEATURE supprimer un video de la playlist - rendu à faire la suppresion de ma BD. api youtube testé, mais semble quil me faut une autre authentification dans lapp pour y accéder
- HOTFIX vérifier tous les TODO TECHNICAL DEBT
- FEATURE error handling avec interface et +
- FEATURE héberger l'app en ligne
- HOTFIX? show only new VERSUS no stars? keep the new taga or merge with ratings?
- HOTDIX video edit : garder les 3 étoiles ou utiliser le array à la place?









# WIP Release 2.1.0

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