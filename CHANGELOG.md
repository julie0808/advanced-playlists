## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0

### 1.5 prep
-  big bug en allant modifier un tag après avoir loadé la liste de vidéo, trié par "new", et coté un vidéo. elle est pas à jour avec les nouveaux tags assigné en revenant du gestionnaire de tag. on devrait unsort les vidéos?


### Quick wins

- Raccourci pour scroller au vidéo actuellement lu dans videoList
- mettre un commentaire à un video (ex : video dentrainement)

### P1
 
- Latence quand on combine les infos de vidéos... peut pas les chercher on time, car on doit tout avoir pour trier / afficher dans videolist
- associated count to tag is not updated after modifying a video 
- updateNewVideos() -> problématique si + de 50 vidéos
- (semble y avoir un gros problème de performance quand on unsort, ou arrive de la section "tags management") -> pas du au get mais bien au multiple combine sur 800 entrées... faire du "on request" à la place au lieu de join tout le data au début?

### P2-
- (0.5) il reste un "video inexistant", mais la logique de videoPlaying est flawed
- avoir le loading présent quand on sort / unsort + régler autre bogue de quand il n'apparait pas
- avoir un filtre négatif pour retirer de la liste certains tags
- choisir plus d'un rating en même temps
- faire les /edit avec le routing "popup"
- bug : rater un video, alos il disparait de la liste et le videoplaying devient inexistant
- duplication enum StatusCode
- fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons?, age restricted...)
- trier par... video non affiché (unavailable, non published...). mais ne pas les montrer par défaut dans la liste

### Backlog
- avoir sous-playlist avec ordre custom (ex: bts story line)
- les @extends fonctionnent pas comme prévu avec l'encapsulation
- vérifier tous les TODO TECHNICAL DEBT
- ajouter à la doc tech comment créer la base de données
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour sélection rapide
- voir la durée des vidéos
- option pour jouer de façon aléatoire
- avoir une loading bar précise
- hébergé l'app en ligne
- demander confirmer pour supprimer les jct si on supprime un vidéo (si on supprime un vidéo qui n'était pas un doublon)
- supprimer un video de la playlist - rendu à faire la suppresion de ma BD. api youtube testé, mais semble quil me faut une autre authentification dans lapp pour y accéder




# WIP Release 1.4.0 

## Ajouté
- Ajouté système rudimentaire de gestion de la cache
- Ajouté le nombre de vidéos liés à un tag pour référence
- Ajouté un champ description pour les tags
- Ajouté doc technique sur l'utilisation (ébauche)
- Ajouté plusieurs formats différents pour la lecteur de vidéo
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


