## corretion post upgrade Angular
- couleur des étoiles de rating active
- index.html devrait juste avoir app-root
- warning google log in
- login page visual
- finish transition to standalone of all components
- angular cli seems outdated


## trucs à ajouter au todos post migration 
- gros lag au début du chargement de l'app
- affichage titre et artiste pas UX friendly



## non breaking BUGS

- trier par 3stars+ 
---- pourquoi solar a A.C.E et 3stars+? quelle données conflict?



## TODOS

### comment ajouter et publier un tag git :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Got to github in Tags section and "Create release"

best ngrx practices to consider 
-- https://medium.com/@m3po22/stop-using-ngrx-effects-for-that-a6ccfe186399
-- https://angularindepth.com/posts/1442/ngrx-bad-practices

ncu -u (view current packages and available updates) - à utiliser si pas de changement de version de plus de 1 version majeure
ng update angular/core@17 (1 major version at a time)
ng update rxjs to match version
ng version (pour voir version de angular)
node -v (vérifier version de node)
https://angular.dev/update-guide?v=17.0-18.0&l=1



*****clé étrangère de play_video à faire


FOCUS
- maintenant que la playlist n'est plus considéré pour aller chercher les tags (update 2.2.0), cela pourrait être problématique si un youtube_id est dans plusieurs playlist youtube différente; est-ce que les tags devraient être lié au unique_youtube_id à la place? cela va aussi affecter l'affichage des libellés dans video-list.html en ne considérant plus les playlist_id
- repenser UX des filtres/tri
- 1 démystifier 3stats+, unique, coup de coeur..
- ? mises à jour https://github.com/julie0808/advanced-playlists/security/dependabot ?
- 3 angular 18
- 1 réviser readme
- BUG dropdown playlist zindex weird

- 5 FEATURE - exlure des tags (ex : dance performance, live...)
- 8 FEATURE avoir sous-playlist avec ordre custom (ex: bts story line)
- 2 why though? DEBT - www.js 393 - enregsitrer le ID des playlist pour les vidéos. le but de cette table était de garder le titre original des vidéos, il faudrait ajuster ça aussi
- 2 FEATURE option pour jouer de façon aléatoire
- wut? HOTFIX this.tag dans tag-edit à revoir
- 2 HOTFIX video edit : utiliser le array au lieu des 3 étoiles pour la cote
** Commencer à penser pour le problème de latence de grosse playlist. software rotty at this point




### lineup
- FEATURE recherche par mot clé
- FEATURE les artistes sont cross playlists
- FEATURE éditer un tag en ayant le player, mais que ça continue où on en étant quand on retourne dans la liste de vidéo (pas reset au vidéo #1)
- FEATURE pas loader les videos par défaut...me laisser choisir la playlist
- FEATURE mettre un commentaire à un video (ex : video dentrainement)
- FEATURE Raccourci pour scroller au vidéo actuellement lu dans videoList
- FEATURE avoir une loading bar précise? possible avec interceptor? autres options avec le store? async?

- HOTFIX - playlist dropdown width
- DEBT - subscribing to value to filters.. should I send observable to action ngrx?
- HOTFIX - redirect routing to videos not working

- écrire dans la docu les instructions pour installer la bd (tech.md)


### Backlog
- FEATURE changer primeng pour Material
- FEATURE "offline mode" tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- FEATURE HOTFIX avoir le loading présent quand on sort / unsort + régler autre bogue de quand il n'apparait pas
- FEATURE fonction pour flaguer les vidéos à ne pas montrer (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affiché (unavailable, non published...). mais ne pas les montrer par défaut dans la liste
- FEATURE REFACTOR faire les /edit avec le routing "popup"
- FEATURE terminer la fonctionnalité détectant les duplications
- FEATURE enregistrer un groupe de filtre pour sélection rapide
- FEATURE voir la durée des vidéos
- FEATURE supprimer un video de la playlist - rendu à faire la suppresion de ma BD. api youtube testé, mais semble quil me faut une autre authentification dans lapp pour y accéder
- FEATURE error handling avec interface et +
- FEATURE héberger l'app en local pour accès de mon téléphone

- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent à un tag qui a des enfants
- HOTFIX updateNewVideos() -> problématique si + de 50 vidéos
- DEBT REFACTOR Latence en général. 850 vidéos... problème avec les observable ou normal? possibilité de lazy load?
- HOTFIX les @extends fonctionnent pas comme prévu avec l'encapsulation
- HOTFIX vérifier tous les TODO TECHNICAL DEBT
- HOTFIX? show only new VERSUS no stars? keep the new taga or merge with ratings?
- HOTFIX devrait pas avoir le visual d'accordéon si pas d'enfant?s

