## TODOS
https://trello.com/b/sihPIKvw/fancyt
- vérifier l'erreur dans la console (postMessage on Domwindow target origin does not match)
- montrer un loading gif le temps que les vidéos se chargent
- Le visuel du multi select est insatisfaisant 
- bogue: videoList not updated if tagname is updated in tag manager 
- supprimer un tag a besoin d'un modal de confirmation (+ suppression des liaisons)
- système pour savoir quels videos sont nouveaux / n'ont aucun tag assigné
- avoir un système à part pour les Artistes ???
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour sélection rapide
- voir la durée des vidéos
- tri par date d'ajout à la playlist
- option pour jouer de façon aléatoire
- contrôle vidéos pour next/previous
- groupe de tags ?? ou catégories? give colors to différents parent categories too
- Star rating for a filter


# Release 1.1.0

- Système de tag parent poour mieux catégoriser les vidéos


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


