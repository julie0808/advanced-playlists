import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { TagService } from "../../tags/tag.service";
import * as PlaylistActions from "./playlist.action";
import { mergeMap, map, catchError } from "rxjs/operators";

import { of } from "rxjs";



@Injectable()
export class PlaylistEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagService
  ) {}

  loadPlaylists$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(PlaylistActions.loadPlaylists),
        mergeMap(() => {
          return this.tagService.getPlaylists().pipe(
            map(playlists => {
              return PlaylistActions.loadPlaylistsSuccess({ playlists });
            }),
            catchError(error => {
              return of(PlaylistActions.loadPlaylistsFailure({ error }))
            })
          );
        })
      )
  });

}