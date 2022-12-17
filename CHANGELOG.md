## TODOS
https://trello.com/b/sihPIKvw/fancyt

### P1
- (1) controle de vue du lecture : fullscreen et cacher
- (0.5) ajout � la doc tech comment utiliser l'outil avec lien dans readme
- (0.25) suprimmer les jct ace
- (0.5) supprimer un tag supprime ses liaisoms



### P2-
- avoir un filtre n�gatif pour retirer de la liste certains tags
- v�rifier l'erreur dans la console (postMessage on Domwindow target origin does not match)
- pr�loader les video et les garde en session
- Raccourci pour scroller au vid�o actuellement lu dans videoList
- contr�le vid�os pour next/previous
- choisir plus d'un rating en m�me temps



### P3
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour s�lection rapide
- voir la dur�e des vid�os
- tri par date d'ajout � la playlist
- option pour jouer de fa�on al�atoire
- fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons, age restricted...)
- fonction pour consulter les vid�os retir�s de youtube
- utiliser l'authentification Youtube pour aller chercher la liste de mon choix
- supprimer un vid�o de la playlist Youtube � m�me l'outil


# Release 1.2.1

- Ajout de modal de confirmation pour la suppression de tag
- Le titre d'un tag modifi� se met maintenant correctement � jour dans les tags assign�s dans la liste de vid�o 
- Choisir un filtre fait maintenant jouer le bon vid�o sur s�lection
- Les filtres s'additionnent lorsque s�lectionn�s plut�t que de filtrer selon un seul choix
- Les couleurs des �toiles dans la s�lection d'un filtre est corrig�


# Release 1.2.0

- Syst�me de tag parent pour mieux cat�goriser les vid�os
- Syst�me de classement avec �toiles pour filtrer les vid�os
- Int�gration de PrimeNG pour remplacer divers composantes
- Ajout d'un tri pour voir seulement les vid�os sans classement avec �toile
- Affichage des artistes de fa�on s�par�e des tags

# Release 1.1.0

- Mise � jour de divers modules obsol�tes
- Charger correctement une liste de vid�os volumineuse

# Release 1.0.0

- MVP officiel
- Ajout du login via Google oAuth
- Videoplayer dans l'application
- Filter les vid�os par tags
- Enregistrer le titre initial des vid�os dans la base de donn�es
- Branchement Initial � l'API youtube pour obtenir liste de lecture (hardcod� � 1 liste actuellement)
- Ajout, suppression et modification de tag
- Ajout ou suppression de tag assign� � un vid�o


