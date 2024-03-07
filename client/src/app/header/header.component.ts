import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Observable, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { State, getPlaylists, getCurrentPlaylist, getCurrentPlaylistId } from '../shared/state';
import { PlaylistPageActions } from '../shared/state/actions';

import { Playlist } from '../shared/model/playlist.model';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  user!: SocialUser;
  loggedIn: boolean = false;
  currentPlaylist!: Playlist;

  playlist$: Observable<Playlist[]> = this.store.select(getPlaylists);

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
        const strongTypedPlaylist: Playlist = playlist ||  new Playlist();

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
    this.store.dispatch(PlaylistPageActions.setCurrentPlaylist({
      playlistId: this.currentPlaylist.id
    }));
  }

}
