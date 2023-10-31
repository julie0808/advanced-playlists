import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, concatMap, withLatestFrom } from "rxjs/operators";

import { TagService } from "../tag.service";
import { TagApiActions, TagPageActions } from "./actions";
import { of } from "rxjs";

import { Store } from '@ngrx/store';
import { State, getCurrentPlaylistId } from '../../shared/state';


@Injectable()
export class TagEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private store$: Store<State>
  ) {}

  loadTags$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(TagPageActions.loadTags),
        withLatestFrom(
          this.store$.select(getCurrentPlaylistId)
        ),
        mergeMap(([action, playlistId]) => {
          return this.tagService.getTags(playlistId).pipe(
            map(tags => {
              return TagApiActions.loadTagsSuccess({ tags });
            }),
            catchError(error => {
              return of(TagApiActions.loadTagsFailure({ error }))
            })
          );
        })
      )
  });

  createTag$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(TagPageActions.createTag),
        concatMap(action =>
          this.tagService.createTag(action.tag)
            .pipe(
              map(tag => {
                return TagApiActions.createTagSuccess({ tag });
              }),
              catchError(error => {
                return of(TagApiActions.createTagFailure({ error }))
              })
            )
        )
      );
  });

  updateTag$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(TagPageActions.updateTag),
      concatMap(action => {
        return this.tagService.updateTag(action.tag).pipe(
          map(tag => {
            return TagApiActions.updateTagSuccess({ tag });
          }),
          catchError(error => {
            return of(TagApiActions.updateTagFailure({ error }));
          })
        )
      })
    )
  });

  deleteTag$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(TagPageActions.deleteTag),
        mergeMap(action =>
          this.tagService.deleteTag(action.tagId).pipe(
            map(() => {
              return TagApiActions.deleteTagSuccess({ tagId: action.tagId });
            }),
            catchError(error => of(TagApiActions.deleteTagFailure({ error })))
          )
        )
      );
  });
}