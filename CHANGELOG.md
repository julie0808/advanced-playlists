## TODOS
https://trello.com/b/sihPIKvw/fancyt

### P1
- avoir le loading pr�sent quand on sort / unsort
- (1) controle de vue du lecture : fullscreen et cacher
- (0.5) ajout � la doc tech comment utiliser l'outil avec lien dans readme + maj readme
- (0.25) suprimmer les jct ace
- (0.5) supprimer un tag supprime ses liaisons
- (0.5) video indisponible quand on trie par nouveau et rate le video en court (idem si on change de playlist)
- fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons, age restricted...)
- trier par... video non affich� (doublon, unavailable, non published...). mais ne pas les montrer par d�faut dans la liste
- (0.5) video test id quand on �dite un video qui devient indisponible dans la liste actuelle
- (1) big bug en allant modifi� un tag apr�s avoir load� la liste de vid�o, tri� par "new", et cot� un vid�o. elle est pas � jour avec les nouveaux tags assign� en revenant du gestionnaire de tag. on devrait unsort les vid�os?

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
- supprimer un vid�o de la playlist Youtube � m�me l'outil
- faire les /edit avec le routing "popup"
- avoir une fa�on de spotter les doublons




# Release 1.3.0

- Maintenant possible de choisir une diff�rente playlist
- Ajout d'un �tat "publi�" ou "indisponible" aux vid�os pour supporter les vid�os privatis�s ou supprim�s par leur auteur
- Ajout d'un filtre sp�cifique pour les artistes

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


