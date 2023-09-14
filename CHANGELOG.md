## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0

## NGRX
- finish integration in tag manager
- prendre une d�cision sur la nomenclature ITag, IPlaylist

ajouter les unsubscribe (pas encore vu dans le course)

autre non side effect : currentPlaylist, isLoading, all the sorting params, videoSelect (edit), selectedTag (edit)
avec side effect : videoList, tagList...
app.state: isLoading

## NGRX videolist
- video player : redo the datastream for selectedvideo quand on va loader la liste compl�te des vid�os
- quand le storing de la liste des videos sera faite, je pourrais consid�rer faire un selecteur combin�; currentVideoPlaying devenant seulement le youtubeuniqueid pour all�ger



## FOCUS
enregistrer les tags de video doit pas �craser ceux de dautres playlist


### 1.5 prep
- FEATURE Raccourci pour scroller au vid�o actuellement lu dans videoList
 disparait de la liste (apr�s avoir cot� un vid�o)
- rev�rifier le best practice des class/ interface names (ITag ou Tag?)

### 1.6 prep
- avoir une loading bar pr�cise? possible avec interceptor?

#### NGRX?  1.5? should be 2.0 ?
- HOTFIX big bug en allant modifier un tag apr�s avoir load� la liste de vid�o, tri� par "new", et cot� un vid�o. elle est pas � jour avec les nouveaux tags assign� en revenant du gestionnaire de tag. on devrait unsort les vid�os?


### lineup
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent � un tag qui a des enfants
- HOTFIX associated count to tag is not updated after modifying a video 
- HOTFIX les requ�tes dans le www.js devrait consid�rer la playlist pour �tre moins lourd (tags associations et peut-�tre +)
- FEATURE HOTFIX avoir le loading pr�sent quand on sort / unsort + r�gler autre bogue de quand il n'apparait pas
- FEATURE choisir plus d'un rating en m�me temps
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affich� (unavailable, non published...). mais ne pas les montrer par d�faut dans la liste
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
- HOTFIX updateNewVideos() -> probl�matique si + de 50 vid�os
- FEATURE mettre un commentaire � un video (ex : video dentrainement)
- HOTFIX REFACTOR Latence en g�n�ral. 850 vid�os... probl�me avec les observable ou normal? possibilit� de lazy load?
- HOTFIX les @extends fonctionnent pas comme pr�vu avec l'encapsulation
- DOC ajouter � la doc tech comment cr�er la base de donn�es
- FEATURE enregistrer filtre actuel en session pour l'avoir encore en revenant de la page Tag Manager
- FEATURE enregistrer un groupe de filtre pour s�lection rapide
- FEATURE voir la dur�e des vid�os
- FEATURE option pour jouer de fa�on al�atoire
- FEATURE supprimer un video de la playlist - rendu � faire la suppresion de ma BD. api youtube test�, mais semble quil me faut une autre authentification dans lapp pour y acc�der
- HOTFIX v�rifier tous les TODO TECHNICAL DEBT
- FEATURE h�berger l'app en ligne
- FEATURE error handling avec interface et +





# WIP Release 2.1.0

## Ajout�
- Implantation du Store NgRx sur la liste de vid�os

## Modifi�
- Ajuster le vid�o s�lectionn� pour utiliser un ID plut�t qu'un objet vid�o



# WIP Release 2.0.0

## Ajout�
- Implantation du Store NgRx sur le lecteur de vid�o et le gestionnaire de tags

## Retir�
- Tag manager : compte des vid�os ayant le tag associ�



# WIP Release 1.6.0
--- update to angular 16?


# WIP Release 1.5.0

## Ajout�
- Trier par playlist

## Modifi�
- Am�liorations / optimisations diverses au code


# Release 1.4.0 

## Ajout�
- Ajout� syst�me rudimentaire de gestion de la cache
- Ajout� le nombre de vid�os li�s � un tag pour r�f�rence
- Ajout� un champ description pour les tags
- Ajout� doc technique sur l'utilisation (�bauche)
- Ajout� plusieurs formats diff�rents pour le lecteur de vid�o
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






##### th�orie rxjs
- valider si jutilise switchMap seulement por des request annulable comme une Recherche. 
- concatMap, attend la compl�tion avant de passer au prochain. safest pour CRUD quand lordre importe
- mergeMap: en parall�le, plus performant mais garanti pas l'ordre (utiliser pour CRUD)
- exhaudMap: ignore tout requ�te avant compl�tion de la premi�re (ex: login) 

