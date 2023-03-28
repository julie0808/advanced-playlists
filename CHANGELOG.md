## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0

### 1.5 prep
-  big bug en allant modifier un tag apr�s avoir load� la liste de vid�o, tri� par "new", et cot� un vid�o. elle est pas � jour avec les nouveaux tags assign� en revenant du gestionnaire de tag. on devrait unsort les vid�os?


### Quick wins

- Raccourci pour scroller au vid�o actuellement lu dans videoList
- mettre un commentaire � un video (ex : video dentrainement)

### P1
 
- Latence quand on combine les infos de vid�os... peut pas les chercher on time, car on doit tout avoir pour trier / afficher dans videolist
- associated count to tag is not updated after modifying a video 
- updateNewVideos() -> probl�matique si + de 50 vid�os
- (semble y avoir un gros probl�me de performance quand on unsort, ou arrive de la section "tags management") -> pas du au get mais bien au multiple combine sur 800 entr�es... faire du "on request" � la place au lieu de join tout le data au d�but?

### P2-
- (0.5) il reste un "video inexistant", mais la logique de videoPlaying est flawed
- avoir le loading pr�sent quand on sort / unsort + r�gler autre bogue de quand il n'apparait pas
- avoir un filtre n�gatif pour retirer de la liste certains tags
- choisir plus d'un rating en m�me temps
- faire les /edit avec le routing "popup"
- bug : rater un video, alos il disparait de la liste et le videoplaying devient inexistant
- duplication enum StatusCode
- fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons?, age restricted...)
- trier par... video non affich� (unavailable, non published...). mais ne pas les montrer par d�faut dans la liste

### Backlog
- avoir sous-playlist avec ordre custom (ex: bts story line)
- les @extends fonctionnent pas comme pr�vu avec l'encapsulation
- v�rifier tous les TODO TECHNICAL DEBT
- ajouter � la doc tech comment cr�er la base de donn�es
- enregistrer filtre actuel en session
- enregistrer un groupe de filtre pour s�lection rapide
- voir la dur�e des vid�os
- option pour jouer de fa�on al�atoire
- avoir une loading bar pr�cise
- h�berg� l'app en ligne
- demander confirmer pour supprimer les jct si on supprime un vid�o (si on supprime un vid�o qui n'�tait pas un doublon)
- supprimer un video de la playlist - rendu � faire la suppresion de ma BD. api youtube test�, mais semble quil me faut une autre authentification dans lapp pour y acc�der




# WIP Release 1.4.0 

## Ajout�
- Ajout� syst�me rudimentaire de gestion de la cache
- Ajout� le nombre de vid�os li�s � un tag pour r�f�rence
- Ajout� un champ description pour les tags
- Ajout� doc technique sur l'utilisation (�bauche)
- Ajout� plusieurs formats diff�rents pour la lecteur de vid�o
- Ajout� contr�le de base pour le lecteur (jouer vid�o suivant/pr�c�dent, pause, jouer) 

## Modifi�
- Refactoring des datastreams / usage de RXjs dans le service de vid�o pour corriger divers bugs et rendre plus lisible
- Refactoring du css pour avoir un .scss pour chaque component de fa�on logique

## Corrig�
- Supprimer correctement les r�f�rences aux vid�os si un tag est supprim�
- Un nouveau vid�o ne donne plus l'erreur de "rating" absent
- L'API Youtube est seulement appel� le nombre de fois n�cessaire plut�t qu'� chaque �mission d'un inner observable

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


