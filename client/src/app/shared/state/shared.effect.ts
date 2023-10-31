import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { TagService } from "../../tags/tag.service";
import { PlaylistApiActions, PlaylistPageActions } from "./actions";
import { mergeMap, map, catchError } from "rxjs/operators";

import { of } from "rxjs";



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

}