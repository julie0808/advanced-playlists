## TODOS
https://trello.com/b/sihPIKvw/fancyt

####### WHERE AM AT?
tag-list -> typescript boque sur tagGroups3. me demande si cest une limitation de typescript ou une erreur l�gitime



comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0

### 1.5 prep
- FEATURE Raccourci pour scroller au vid�o actuellement lu dans videoList
- HOTFIX duplication enum StatusCode
- HOTFIX fermer la fen�tre d'�dition quand le vid�o �dit� disparait de la liste (apr�s avoir cot� un vid�o)
- rev�rifier le best practive des class/ interface names (ITag ou Tag?)

### 1.6 prep
- avoir une loading bar pr�cise? possible avec interceptor?

#### NGRX?  1.5? should be 2.0 ?
- HOTFIX rater un video, alors il disparait de la liste et le videoplaying devient inexistant
- HOTFIX big bug en allant modifier un tag apr�s avoir load� la liste de vid�o, tri� par "new", et cot� un vid�o. elle est pas � jour avec les nouveaux tags assign� en revenant du gestionnaire de tag. on devrait unsort les vid�os?


### lineup
- HOTFIX associated count to tag is not updated after modifying a video 
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




# WIP Release 1.5.0



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


###### ng rx instructions
- ng add @ngrx/store
- ng add @ngrx/store-devtools
- ng add @ngrx/effects + new file in state subfolder 

- check thats its added to NgModule of AppModule
- add to Components .module
- create reducers in componentsin subfoler "state" for each
- create interfaces for store in reducers
- create app.state in "state" subfoler at root app folder
- define initial state const for every property in reducers
- ?? create "selectors" in reducers (1 exported fct for each property, 1 private const for each slice de store)
- create "actions"
- handle error in states

- presentational / container refactor + push strategy
-index.ts file



## course notes
- Store should be organized by component at 1st level of object
- each .module will have StoreModule as import
- slice up the store by having a different reducer for video data and video list??
- lazyloaded modules wont work in app state : use extends AppState in compoenent reducers 
- selector are query/stored procedure like to strongly type and avoid errors (like an API)
--- slector are functions assigned to a const
--- you need a const as a getter
--- than a const exported to act as a function to do manipulation with the data before return
- action creation
--- la fct "dispatch" dans le component trigger l'action
--- props are metadata needed for the action
--- action should have their own file in state subfolder
- Effects (keep component pure of side effects)
--- entre autre pour async stuff (http requests)
- go further with @ngrx/entity (crud operations)
--- @ngrx/schematics cli generate entity/container/feature
--- @ngrx/router-store dispatch router navigation through store
--- mgrx/data abstract ngrx entity code (moins int�ressnat car moins de custom control)