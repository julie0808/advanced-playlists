import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { State, getAllPlaylists, getCurrentPlaylist } from '../shared/state';
import { PlaylistPageActions } from '../shared/state/actions';

import { Playlist } from '../playlists/playlist.model';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  user!: SocialUser;
  loggedIn: boolean = false;
  currentPlaylist!: Playlist;

  playlist$: Observable<Playlist[]> = this.store.select(getAllPlaylists);

  constructor(
    private authService: SocialAuthService,
    private store: Store<State>
    ) { }

  ngOnInit() {

    this.store.dispatch(PlaylistPageActions.loadPlaylists());

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });

    this.store.select(getCurrentPlaylist)
      .subscribe(playlist => {
        const strongTypedPlaylist: Playlist = playlist || new Playlist();

        if ( strongTypedPlaylist.id !== 'none' ) {
          this.currentPlaylist = playlist || new Playlist();
        }
        
      })
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  onPlaylistChange(): void {
    var playlistChosenIsYoutube: boolean = this.currentPlaylist.isYoutube;
    var playlistChosenId: string = this.currentPlaylist.id;

    if ( playlistChosenIsYoutube ) {
      this.store.dispatch(PlaylistPageActions.setCurrentPlaylist({
        playlistId: playlistChosenId
      }));
    } else {
      console.log('playlist is custom!');
      // ici en fait on veut pas faire un if else; on veut que l'effect soit celui qui détermine
      // comment aller chercher le data si c'est une custom playlist
    }
  }

}
