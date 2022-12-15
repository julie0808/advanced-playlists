## TODOS
https://trello.com/b/sihPIKvw/fancyt

### P1
- Ajouter le filtre pour trier par rating

### P2
- ajouter les artites dans un champ � part et non dans les vignettes
- bogue: videoList not updated if tagname is updated in tag manager 
- v�rifier l'erreur dans la console (postMessage on Domwindow target origin does not match)
- montrer un loading gif le temps que les vid�os se chargent
- supprimer un tag a besoin d'un modal de confirmation (+ suppression des liaisons)
- syst�me pour savoir quels videos sont nouveaux / n'ont aucun tag assign�
- mettre des accord�ons dans taglist
- nettoyer form.scss
- supprimer le filtre du vid�o en court de lecture fait boguer le lecteur, celui-ci doit recommencer au premier vid�o chaque fois quon change un filtre
- faire le tag/release management sur github

### P3
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour s�lection rapide
- voir la dur�e des vid�os
- tri par date d'ajout � la playlist
- option pour jouer de fa�on al�atoire
- contr�le vid�os pour next/previous
- fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons, age restricted...)
- fonction pour consulter les vid�os retir�s de youtube
- avoir un filtre n�gatif pour retirer de la liste certains tags
- utiliser l'authentification Youtube pour aller chercher la liste de mon choix



# Release 1.1.0

- Syst�me de tag parent poour mieux cat�goriser les vid�os
- Syst�me de rating pour filtrer les vid�os (WIP)


# Release 1.0.1

- Mise � jour de divers modules obsol�tes
- Charger correctement une liste de vid�os volumineuse


# Release 1.0.0

- MVP officiel
- Ajout du login via Google oAuth

# Release 0.6.0

- Videoplayer dans l'application

# Release 0.5.0

- Refonte des modules pour permettre lazy loading
- Mise � jour de Angular 12 vers Angular 14 ainsi que ses d�pendances
- Implantation du module de lecteur de vid�o Youtube de base avec ID hardcod�

# Release 0.4.0

- Filter les vid�os par tags
- Ajouter des tags � des vid�os
- Enregistrer le titre initial des vid�os dans la base de donn�es
- Retrait de back4app pour backend Node avec Postgres SQL

# Release 0.3.0

- Storer dans l'application le data venant de l'API Youtube et Back4App

# Release 0.2.0

- Branchement Initial � l'API youtube pour obtenir liste de lecture (hardcod� � 1 liste actuellement)

# Release 0.1.0

- Ajout, suppression et modification de tag
- Ajout ou suppression de tag assign� � un vid�o

