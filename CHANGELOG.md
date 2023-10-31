## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Got to github in Tags section and "Create release"


FOCUS
- current playlist not showing
- 1er video playing plante au chargement
- new bugs with tags. current filtered tags not showing if coming back from tag managing or messing up the video list
- retester ce que ça fait au tags assignés quand on revient de modifier les tags
- problème quand le video est partagé entre les playlists; les tags de lautre playlist apparaissent quand meme. lié les tags au id unique plutôt que id video?
-retirer tingle


### lineup
- FEATURE choisir plus d'un rating en même temps
- FEATURE avoir le player pendant quon gère les tags
- HOTFIX les tags assigné ne sont pas à jour quand on édite un Tag
- FEATURE avoir sous-playlist avec ordre custom (ex: bts story line)
- update à angular 16
- écrire dans la docu les instructions pour installer la bd (tech.md)
- FEATURE mettre un commentaire à un video (ex : video dentrainement)
- FEATURE Raccourci pour scroller au vidéo actuellement lu dans videoList
- FEATURE avoir une loading bar précise? possible avec interceptor? autres options avec le store? async?
- HOTFIX - playlist dropdown width



### Backlog
- FEATURE "offline mode" tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- HOTFIX this.tag dans tag-edit à revoir
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent à un tag qui a des enfants
- FEATURE HOTFIX avoir le loading présent quand on sort / unsort + régler autre bogue de quand il n'apparait pas
- FEATURE fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affiché (unavailable, non published...). mais ne pas les montrer par défaut dans la liste
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE terminer la fonctionnalité détectant les duplications
- HOTFIX updateNewVideos() -> problématique si + de 50 vidéos
----- HOTFIX REFACTOR Latence en général. 850 vidéos... problème avec les observable ou normal? possibilité de lazy load?
- HOTFIX les @extends fonctionnent pas comme prévu avec l'encapsulation
- FEATURE enregistrer un groupe de filtre pour sélection rapide
- FEATURE voir la durée des vidéos
- FEATURE option pour jouer de façon aléatoire
- FEATURE supprimer un video de la playlist - rendu à faire la suppresion de ma BD. api youtube testé, mais semble quil me faut une autre authentification dans lapp pour y accéder
- HOTFIX vérifier tous les TODO TECHNICAL DEBT
- FEATURE error handling avec interface et +
- FEATURE héberger l'app en ligne


# WIP Release 2.2.0

- WIP  Le premier vidéo de la liste est correctement chargé et joue automatiquement
- WIP Quand un tag est modifié, cela édite aussi ses associations dans la liste de vidéos
- WIP ajouter les unsubscribe (revoir "course"?)



# WIP Release 2.1.0

## Ajouté
- Chargement des tags et vidéos par playlist

## Corrigé
- Les contrôles personnalisés de reculer/avancer/jouer un vidéo sont de nouveau fonctionnels
- Le numéro du vidéo actuellement joué est affiché correctement
- Les nouveaux vidéos sont de nouveaux enregistrés dans la base de données pour garder leur titre initial en mémoire

## Modifié
- Modification structurelle au code - Index barrels



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