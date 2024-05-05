## TODOS
https://trello.com/b/sihPIKvw/fancyt

comment ajouter et publier un tag :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Got to github in Tags section and "Create release"

Changement � sprintool:
https://www.baeldung.com/swagger-2-documentation-for-spring-rest-api
https://spring.io/guides/gs/rest-service/
https://spring.io/quickstart
https://spring.io/guides/gs/guides-with-vscode/

best ngrx practices to consider 
-- https://medium.com/@m3po22/stop-using-ngrx-effects-for-that-a6ccfe186399
-- https://angularindepth.com/posts/1442/ngrx-bad-practices

ncu -u (view current packages and available updates)
ng update angular/core@17 (1 major version at a time)






FOCUS
Travail de visuel bris� un peu partout avec le primeng � jour

- d�mystifier 3stats+, unique, coup de coeur..

Non bloquants mais n�cessaire pour release 2.1.0 :
- HOTFIX les tags assign� ne sont pas � jour quand on �dite un Tag
- HOTFIX probl�me quand le video est partag� entre les playlists; les tags de lautre playlist apparaissent quand meme dans l'�dition de tag pour un vid�o. lier les tags au id unique plut�t que id video?



### lineup
- FEATURE �diter un tag en ayant le player, mais que �a continue o� on en �tant quand on retourne dans la liste de vid�o (pas reset au vid�o #1)

- FEATURE avoir sous-playlist avec ordre custom (ex: bts story line)
- �crire dans la docu les instructions pour installer la bd (tech.md)
- FEATURE mettre un commentaire � un video (ex : video dentrainement)
- FEATURE Raccourci pour scroller au vid�o actuellement lu dans videoList
- FEATURE avoir une loading bar pr�cise? possible avec interceptor? autres options avec le store? async?
- HOTFIX - playlist dropdown width
- DEBT - subscribing to value to filters.. should I send observable to action ngrx?
- HOTFIX - redirect to videos not working
- DEBT - www.js 393 - enregsitrer le ID des playlist pour les vid�os. le but de cette table �tait de garder le titre original des vid�os, il faudrait ajuster �a aussi
- FEATURE - exlure des tags (ex : dance performance, live...)

### Backlog
- FEATURE changer primeng pour Material
- FEATURE "offline mode" tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- HOTFIX this.tag dans tag-edit � revoir
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent � un tag qui a des enfants
- FEATURE HOTFIX avoir le loading pr�sent quand on sort / unsort + r�gler autre bogue de quand il n'apparait pas
- FEATURE fonction pour flaguer les vid�os � ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affich� (unavailable, non published...). mais ne pas les montrer par d�faut dans la liste
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE terminer la fonctionnalit� d�tectant les duplications
- HOTFIX updateNewVideos() -> probl�matique si + de 50 vid�os
----- DEBT REFACTOR Latence en g�n�ral. 850 vid�os... probl�me avec les observable ou normal? possibilit� de lazy load?
- HOTFIX les @extends fonctionnent pas comme pr�vu avec l'encapsulation
- FEATURE enregistrer un groupe de filtre pour s�lection rapide
- FEATURE voir la dur�e des vid�os
- FEATURE option pour jouer de fa�on al�atoire
- FEATURE supprimer un video de la playlist - rendu � faire la suppresion de ma BD. api youtube test�, mais semble quil me faut une autre authentification dans lapp pour y acc�der
- HOTFIX v�rifier tous les TODO TECHNICAL DEBT
- FEATURE error handling avec interface et +
- FEATURE h�berger l'app en ligne
- HOTFIX? show only new VERSUS no stars? keep the new taga or merge with ratings?
- HOTDIX video edit : garder les 3 �toiles ou utiliser le array � la place?









# WIP Release 2.1.0

## Ajout�
- Chargement des tags et vid�os par playlist
- Possibilit� de ordonner la liste par vid�o le moins r�cemment ajout� � la playlist originale sur Youtube
- Possibilit� de jouer un vid�o en boucle

## Corrig�
- Les contr�les personnalis�s de reculer/avancer/jouer un vid�o sont de nouveau fonctionnels
- Le num�ro du vid�o actuellement jou� est affich� correctement
- Les nouveaux vid�os sont de nouveaux enregistr�s dans la base de donn�es pour garder leur titre initial en m�moire
- Si on change de section, la liste de vid�os est correctement rafraichie au retour
- Quand un tag est modifi�, cela �dite aussi ses associations dans la liste de vid�os

## Modifi�
- Modification structurelle au code - Index barrels
- Le tri par cote permet de s�lectionner plusieurs cotes � la fois; un nom a �galement �t� donn� aux cotes pour les rendre moins subjectives
- Mise � jour vers Angular 17

## Retir�
- Librairie "tingle" inutilis�e



# Release 2.0.0

## Ajout�
- Implantation du Store NgRx

## Modifi�
- Am�liorations / optimisations diverses au code

## Retir�
- Tag manager : compte des vid�os ayant le tag associ�
- Affichage des champs reli�s au choix de playlist (cod� de nouveau au dur pour la liste de kpop)
- Diverses fonctions d�sactiv�es non fonctionnelles avec NgRx pour le moment (playnext, playprevious, play first video of loaded playlist)



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