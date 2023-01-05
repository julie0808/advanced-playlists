## TODOS
https://trello.com/b/sihPIKvw/fancyt

### P1
- avoir le loading présent quand on sort / unsort
- (1) controle de vue du lecture : fullscreen et cacher
- (0.5) ajout à la doc tech comment utiliser l'outil avec lien dans readme + maj readme
- (0.25) suprimmer les jct ace
- (0.5) supprimer un tag supprime ses liaisons
- (0.5) video indisponible quand on trie par nouveau et rate le video en court (idem si on change de playlist)
- fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons, age restricted...)
- trier par... video non affiché (doublon, unavailable, non published...). mais ne pas les montrer par défaut dans la liste
- (0.5) video test id quand on édite un video qui devient indisponible dans la liste actuelle
- (1) big bug en allant modifié un tag après avoir loadé la liste de vidéo, trié par "new", et coté un vidéo. elle est pas à jour avec les nouveaux tags assigné en revenant du gestionnaire de tag. on devrait unsort les vidéos?

### P2-
- avoir un filtre négatif pour retirer de la liste certains tags
- vérifier l'erreur dans la console (postMessage on Domwindow target origin does not match)
- préloader les video et les garde en session
- Raccourci pour scroller au vidéo actuellement lu dans videoList
- contrôle vidéos pour next/previous
- choisir plus d'un rating en même temps

### P3
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour sélection rapide
- voir la durée des vidéos
- tri par date d'ajout à la playlist
- option pour jouer de façon aléatoire
- supprimer un vidéo de la playlist Youtube à même l'outil
- faire les /edit avec le routing "popup"
- avoir une façon de spotter les doublons




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


