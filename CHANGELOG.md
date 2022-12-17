## TODOS
https://trello.com/b/sihPIKvw/fancyt

### P1
- (1) controle de vue du lecture : fullscreen et cacher


### P2
- bogue: videoList not updated if tagname is updated in tag manager 
- vérifier l'erreur dans la console (postMessage on Domwindow target origin does not match)
- supprimer un tag a besoin d'un modal de confirmation (+ suppression des liaisons)
- supprimer le filtre du vidéo en court de lecture fait boguer le lecteur, celui-ci doit recommencer au premier vidéo chaque fois quon change un filtre
- faire le tag/release management sur github
- préloader les video et les garde en session
- Raccourci pour scroller au vidéo actuellement lu dans videoList

- avoir un filtre négatif pour retirer de la liste certains tags
- bogue couleur sélection de rating dans les filtres


### P3
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour sélection rapide
- voir la durée des vidéos
- tri par date d'ajout à la playlist
- option pour jouer de façon aléatoire
- contrôle vidéos pour next/previous
- fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons, age restricted...)
- choisir plus d'un rating en même temps
- fonction pour consulter les vidéos retirés de youtube
- utiliser l'authentification Youtube pour aller chercher la liste de mon choix
- BUG - en triant par "new" : video non existant. vidéo privé?




# Release 1.1.0

- Système de tag parent poour mieux catégoriser les vidéos
- Système de rating pour filtrer les vidéos (WIP)


# Release 1.0.1

- Mise à jour de divers modules obsolètes
- Charger correctement une liste de vidéos volumineuse


# Release 1.0.0

- MVP officiel
- Ajout du login via Google oAuth

# Release 0.6.0

- Videoplayer dans l'application

# Release 0.5.0

- Refonte des modules pour permettre lazy loading
- Mise à jour de Angular 12 vers Angular 14 ainsi que ses dépendances
- Implantation du module de lecteur de vidéo Youtube de base avec ID hardcodé

# Release 0.4.0

- Filter les vidéos par tags
- Ajouter des tags à des vidéos
- Enregistrer le titre initial des vidéos dans la base de données
- Retrait de back4app pour backend Node avec Postgres SQL

# Release 0.3.0

- Storer dans l'application le data venant de l'API Youtube et Back4App

# Release 0.2.0

- Branchement Initial à l'API youtube pour obtenir liste de lecture (hardcodé à 1 liste actuellement)

# Release 0.1.0

- Ajout, suppression et modification de tag
- Ajout ou suppression de tag assigné à un vidéo


