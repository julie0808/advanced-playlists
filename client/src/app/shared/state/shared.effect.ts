import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { TagService } from "../../tags/tag.service";
import { PlaylistApiActions, PlaylistPageActions, AuthPageActions, AuthApiActions } from "./actions";
import { mergeMap, map, catchError, concatMap, switchMap, startWith, tap } from "rxjs/operators";

import { of } from "rxjs";
import { VideoPageActions } from "../../videos/state/actions";
import { TagPageActions } from "../../tags/state/actions";
import { SocialAuthService } from "@abacritt/angularx-social-login";



@Injectable()
export class SharedEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private socialAuthService: SocialAuthService
  ) {}

  loadPlaylists$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(PlaylistPageActions.loadPlaylists),
        mergeMap(() => {
          return this.tagService.getPlaylists().pipe(
            map(playlists => {
              const youtubePlaylists = playlists.filter(p => p.isYoutube === true);
              const customPlaylists = playlists.filter(p => p.isYoutube === false);

              return PlaylistApiActions.loadPlaylistsSuccess({ playlists: youtubePlaylists, customPlaylists: customPlaylists });
            }),
            catchError(error => {
              return of(PlaylistApiActions.loadPlaylistsFailure({ error }))
            })
          );
        })
      )
  });

  // Pourrait être utile, mais crée un enjeu de performance
  /*
  loadDefaultPlaylist$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(PlaylistApiActions.loadPlaylistsSuccess),
      concatMap(action => {
        return of(PlaylistPageActions.setCurrentPlaylist(
          { playlistId: action.playlists[0].id} 
        ));
      })
    )
  });
  */

  loadVideos$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(PlaylistPageActions.setCurrentPlaylist),
      concatMap(action => {
        return of(VideoPageActions.loadVideos());
      })
    )
  });

  initializeFilters$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(PlaylistPageActions.setCurrentPlaylist),
      concatMap(action => {
        return of(VideoPageActions.initializeFilters()); 
      })
    )
  });

  loadTags$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(PlaylistPageActions.setCurrentPlaylist),
      concatMap(action => {
        return of(TagPageActions.loadTags());
      })
    )
  });

  initializeAuth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthPageActions.initializeAuth),
      switchMap(() => {
        return this.socialAuthService.authState.pipe(
          startWith(null),
          map(user => {
            if (user) {
              return AuthApiActions.loginSuccess({ user });
            } else {
              return AuthApiActions.loginFailure({ error: 'User not logged in' });
            }
          }),
          catchError(error => {
            console.log('authState error:', error);
            return of(AuthApiActions.loginFailure({ error: error.message }));
          })
        );
      })
    );
  });

}