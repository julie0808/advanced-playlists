## Current train of thought



## GENERAL PLANNING 

### comment ajouter et publier un tag git :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Get to github in Tags section and "Create release"

ncu -u (view current packages and available updates) - à utiliser si pas de changement de version de plus de 1 version majeure

1) ng update angular/core@17 (1 major version at a time) https://angular.dev/update-guide?v=20.0-21.0&l=3
2) ng update @ngrx/store@21 @ngrx/effects@21 @ngrx/entity@21 @ngrx/store-devtools@21
3) npm install primeng@^21 primeicons@latest @primeuix/themes@latest --save
4) youtube-player to fit version https://www.npmjs.com/package/@angular/youtube-player?activeTab=versions
EXAMPLE npm install @angular/youtube-player@^21.2.13 --save
1) vérifier la version de typescript recommande avec l'aide à l'upgrade https://angular.dev/update-guide?v=19.0-20.0&l=3
2) terminer avec update du social plugin - https://github.com/abacritt/angularx-social-login/releases npm install @abacritt/angularx-social-login@^2.6.0 --save

BACKEND UPDATED
npm outdated. commencer par upgrdaer au "wanted", puis Latest, finissant par le package "express" 
 
ng version (pour voir version de angular)
node -v (vérifier version de node)



### Backlog
- FEATURE WIP Ajout de playlist par l'utilisateur (ajout Ã  une playlist utilisateur des vidÃ©os de n'importe quelle playlist Youtube existante via lÃ©dition du vidÃ©o)
- FEATURE WIP choisir l'ordre des vidÃ©o dans playlist customs
- FEATURE WIP Filtre pour voir les vidÃ©os supprimÃ©s de Youtube mais prÃ©sents dans la base de donnÃ©es
- FEATURE ajouter recherche par mot clé pour chercher dans titre, tags, et description
- FEATURE tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- FEATURE fonction pour flaguer les vidÃ¯Â¿Â½os Ã¯Â¿Â½ ne pas montrer de faÃ¯Â¿Â½on permanente (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affichÃ¯Â¿Â½ (unavailable, non published...). mais ne pas les montrer par dÃ¯Â¿Â½faut dans la liste
- FEATURE terminer la fonctionnalitÃ¯Â¿Â½ dÃ¯Â¿Â½tectant les duplications
- FEATURE enregistrer un groupe de filtre pour sÃ¯Â¿Â½lection rapide
- FEATURE supprimer un video de la playlist - rendu Ã¯Â¿Â½ faire la suppresion de ma BD. api youtube testÃ¯Â¿Â½, mais semble quil me faut une autre authentification dans lapp pour y accÃ¯Â¿Â½der
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent Ã¯Â¿Â½ un tag qui a des enfants
- HOTFIX affichage titre et artiste pas UX friendly
- HOTFIX repenser UX des filtres/tri
- BUGFIX maintenant que la playlist n'est plus considÃ¯Â¿Â½rÃ¯Â¿Â½ pour aller chercher les tags (update 2.2.0), cela pourrait Ã¯Â¿Â½tre problÃ¯Â¿Â½matique si un youtube_id est dans plusieurs playlist youtube diffÃ¯Â¿Â½rente; est-ce que les tags devraient Ã¯Â¿Â½tre liÃ¯Â¿Â½ au unique_youtube_id Ã¯Â¿Â½ la place? cela va aussi affecter l'affichage des libellÃ¯Â¿Â½s dans video-list.html en ne considÃ¯Â¿Â½rant plus les playlist_id
 
