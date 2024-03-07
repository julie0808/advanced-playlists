import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { TagService } from "../../tags/tag.service";
import { PlaylistApiActions, PlaylistPageActions } from "./actions";
import { mergeMap, map, catchError, concatMap } from "rxjs/operators";

import { of } from "rxjs";
import { VideoPageActions } from "src/app/videos/state/actions";
import { TagPageActions } from "src/app/tags/state/actions";



@Injectable()
export class SharedEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagService
  ) {}

  loadPlaylists$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(PlaylistPageActions.loadPlaylists),
        mergeMap(() => {
          return this.tagService.getPlaylists().pipe(
            map(playlists => {
              return PlaylistApiActions.loadPlaylistsSuccess({ playlists });
            }),
            catchError(error => {
              return of(PlaylistApiActions.loadPlaylistsFailure({ error }))
            })
          );
        })
      )
  });

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

}