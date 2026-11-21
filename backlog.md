## Current train of thought





## GENERAL PLANNING 

### comment ajouter et publier un tag git :
git tag -a v1.3.0 -m "Filtre pour artiste et choix de playlist"
git push origin v1.3.0
Get to github in Tags section and "Create release"

ncu -u (view current packages and available updates) - ï¿½ utiliser si pas de changement de version de plus de 1 version majeure

1) ng update angular/core@17 (1 major version at a time) https://angular.dev/update-guide?v=20.0-21.0&l=3
2) ng update @ngrx/store@21 @ngrx/effects@21 @ngrx/entity@21 @ngrx/store-devtools@21
3) npm install primeng@^21 primeicons@latest @primeuix/themes@latest --save
4) youtube-player to fit version https://www.npmjs.com/package/@angular/youtube-player?activeTab=versions
EXAMPLE npm install @angular/youtube-player@^21.2.13 --save
1) vï¿½rifier la version de typescript recommande avec l'aide ï¿½ l'upgrade https://angular.dev/update-guide?v=19.0-20.0&l=3
2) terminer avec update du social plugin - https://github.com/abacritt/angularx-social-login/releases npm install @abacritt/angularx-social-login@^2.6.0 --save

BACKEND UPDATED
npm outdated. commencer par upgrdaer au "wanted", puis Latest, finissant par le package "express" 
 
ng version (pour voir version de angular)
node -v (vï¿½rifier version de node)







FOCUS
- maintenant que la playlist n'est plus considï¿½rï¿½ pour aller chercher les tags (update 2.2.0), cela pourrait ï¿½tre problï¿½matique si un youtube_id est dans plusieurs playlist youtube diffï¿½rente; est-ce que les tags devraient ï¿½tre liï¿½ au unique_youtube_id ï¿½ la place? cela va aussi affecter l'affichage des libellï¿½s dans video-list.html en ne considï¿½rant plus les playlist_id
- why though? DEBT - www.js 393 - enregsitrer le ID des playlist pour les vidï¿½os. le but de cette table ï¿½tait de garder le titre original des vidï¿½os, il faudrait ajuster ï¿½a aussi
- HOTFIX show only new VERSUS no rated



QUICK WINS
- FEATURE mettre un commentaire ï¿½ un video (ex : video dentrainement)
- FEATURE voir la durï¿½e des vidï¿½os
- HOTFIX index.html devrait juste avoir app-root
- HOTFIX changer de playlist dans le tag editeur ne retire pas l'ancienne liste si rien de nouveau est trouvï¿½
- HOTFIX *****clï¿½ ï¿½trangï¿½re de play_video ï¿½ faire



### lineup
- FEATURE recherche par mot clï¿½
- FEATURE les artistes sont cross playlists
- FEATURE Raccourci pour scroller au vidï¿½o actuellement lu dans videoList
- FEATURE AI avoir une loading bar prï¿½cise? possible avec interceptor? autres options avec le store? async?
- ï¿½crire dans la docu les instructions pour installer la bd (tech.md)
- DEBT HOTFIX Commencer ï¿½ penser pour le problï¿½me de latence de grosse playlist. software rotty at this point


### Backlog
- FEATURE "offline mode" tous les tags de toutes les playlists (ex: get all the flirty stuff de toutes les playlists)
- FEATURE fonction pour flaguer les vidï¿½os ï¿½ ne pas montrer de faï¿½on permanente (Maze of memories doublons?, age restricted...)
- FEATURE trier par... video non affichï¿½ (unavailable, non published...). mais ne pas les montrer par dï¿½faut dans la liste
- FEATURE terminer la fonctionnalitï¿½ dï¿½tectant les duplications
- FEATURE enregistrer un groupe de filtre pour sï¿½lection rapide
- FEATURE supprimer un video de la playlist - rendu ï¿½ faire la suppresion de ma BD. api youtube testï¿½, mais semble quil me faut une autre authentification dans lapp pour y accï¿½der
- FEATURE error handling avec interface et +
- FEATURE hï¿½berger l'app en local pour accï¿½s de mon tï¿½lï¿½phone
- FEATURE pouvoir ajouter ou exclure des tags ï¿½ partir d'un vidï¿½o de la liste de vidï¿½os

- HOTFIX ï¿½diter un tag en ayant le player, mais que ï¿½a continue oï¿½ on en ï¿½tant quand on retourne dans la liste de vidï¿½o (pas reset au vidï¿½o #1)
- HOTFIX tester ce qui arrive si je supprime un tag parent qui a des parents, ou donne un parent ï¿½ un tag qui a des enfants
- HOTFIX updateNewVideos() -> problï¿½matique si + de 50 vidï¿½os
- HOTFIX affichage titre et artiste pas UX friendly
- HOTFIX Mï¿½me si c'est le premier vidï¿½o chargï¿½ aprï¿½s le chargement de la playlist, faire jouer le vidï¿½o si manuellement on demande de le jouer.
- HOTFIX pourquoi solar a A.C.E et 3stars+? quelle donnï¿½es conflict?
- HOTFIX plusieurs "none" possible dans le choix de Group dans l'ï¿½dition d'un tag
- HOTFIX repenser UX des filtres/tri
- HOTFIX - redirect routing to videos not working
 
