## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0

## NGRX
- finish integration in tag manager
- prendre une décision sur la nomenclature ITag, IPlaylist

ajouter les unsubscribe (pas encore vu dans le course)

autre non side effect : currentPlaylist, isLoading, all the sorting params, videoSelect (edit), selectedTag (edit)
avec side effect : videoList, tagList...
app.state: isLoading

## NGRX videolist
- video player : redo the datastream for selectedvideo quand on va loader la liste complète des vidéos
- quand le storing de la liste des videos sera faite, je pourrais considérer faire un selecteur combiné; currentVideoPlaying devenant seulement le youtubeuniqueid pour alléger



## FOCUS
enregistrer les tags de video doit pas écraser ceux de dautres playlist


### 1.5 prep
- FEATURE Raccourci pour scroller au vidéo actuellement lu dans videoList
 disparait de la liste (après avoir coté un vidéo)
- revérifier le best practice des class/ interface names (ITag ou Tag?)

### 1.6 prep
- avoir une loading bar précise? possible avec interceptor?

#### NGRX?  1.5? should be 2.0 ?
- HOTFIX big bug en allant modifier un tag après avoir loadé la liste de vidéo, trié par "new", et coté un vidéo. elle est pas à jour avec les nouveaux tags assigné en revenant du gestionnaire de tag. on devrait unsort les vidéos?


### lineup
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent à un tag qui a des enfants
- HOTFIX associated count to tag is not updated after modifying a video 
- HOTFIX les requêtes dans le www.js devrait considérer la playlist pour être moins lourd (tags associations et peut-être +)
- FEATURE HOTFIX avoir le loading présent quand on sort / unsort + régler autre bogue de quand il n'apparait pas
- FEATURE choisir plus d'un rating en même temps
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affiché (unavailable, non published...). mais ne pas les montrer par défaut dans la liste
- FEATURE avoir sous-playlist avec ordre custom (ex: bts story line)

- FEATURE ngrx for states : current filters
--- set user details on login
--- would nb of linked video to a tag be a state?
--- currently playing video
--- videos list
--- tags list
--- form states currently edited vs new with default value


### Backlog
- duplication de code au choix de playlist dans tag manager
- HOTFIX updateNewVideos() -> problématique si + de 50 vidéos
- FEATURE mettre un commentaire à un video (ex : video dentrainement)
- HOTFIX REFACTOR Latence en général. 850 vidéos... problème avec les observable ou normal? possibilité de lazy load?
- HOTFIX les @extends fonctionnent pas comme prévu avec l'encapsulation
- DOC ajouter à la doc tech comment créer la base de données
- FEATURE enregistrer filtre actuel en session pour l'avoir encore en revenant de la page Tag Manager
- FEATURE enregistrer un groupe de filtre pour sélection rapide
- FEATURE voir la durée des vidéos
- FEATURE option pour jouer de façon aléatoire
- FEATURE supprimer un video de la playlist - rendu à faire la suppresion de ma BD. api youtube testé, mais semble quil me faut une autre authentification dans lapp pour y accéder
- HOTFIX vérifier tous les TODO TECHNICAL DEBT
- FEATURE héberger l'app en ligne
- FEATURE error handling avec interface et +





# WIP Release 2.1.0

## Ajouté
- Implantation du Store NgRx sur la liste de vidéos

## Modifié
- Ajuster le vidéo sélectionné pour utiliser un ID plutôt qu'un objet vidéo



# WIP Release 2.0.0

## Ajouté
- Implantation du Store NgRx sur le lecteur de vidéo et le gestionnaire de tags

## Retiré
- Tag manager : compte des vidéos ayant le tag associé



# WIP Release 1.6.0
--- update to angular 16?


# WIP Release 1.5.0

## Ajouté
- Trier par playlist

## Modifié
- Améliorations / optimisations diverses au code


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






##### théorie rxjs
- valider si jutilise switchMap seulement por des request annulable comme une Recherche. 
- concatMap, attend la complétion avant de passer au prochain. safest pour CRUD quand lordre importe
- mergeMap: en parallèle, plus performant mais garanti pas l'ordre (utiliser pour CRUD)
- exhaudMap: ignore tout requête avant complétion de la première (ex: login) 

