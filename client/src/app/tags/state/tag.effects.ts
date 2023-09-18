import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, concatMap } from "rxjs/operators";

import { TagService } from "../tag.service";
import * as TagActions from "./tag.action";
import { of } from "rxjs";



@Injectable()
export class TagEffects {

  constructor(
    private actions$: Actions,
    private tagService: TagService
  ) {}

  loadTags$ = createEffect( () => {
    return this.actions$
      .pipe(
        ofType(TagActions.loadTags),
        mergeMap(() => {
          return this.tagService.getTags().pipe(
            map(tags => {
              return TagActions.loadTagsSuccess({ tags });
            }),
            catchError(error => {
              return of(TagActions.loadTagsFailure({ error }))
            })
          );
        })
      )
  });

  createTag$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(TagActions.createTag),
        concatMap(action =>
          this.tagService.createTag(action.tag)
            .pipe(
              map(tag => {
                return TagActions.createTagSuccess({ tag });
              }),
              catchError(error => {
                return of(TagActions.createTagFailure({ error }))
              })
            )
        )
      );
  });

  updateTag$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(TagActions.updateTag),
      concatMap(action => {
        return this.tagService.updateTag(action.tag).pipe(
          map(tag => {
            return TagActions.updateTagSuccess({ tag });
          }),
          catchError(error => {
            return of(TagActions.updateTagFailure({ error }));
          })
        )
      })
    )
  });

  deleteTag$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(TagActions.deleteTag),
        mergeMap(action =>
          this.tagService.deleteTag(action.tagId).pipe(
            map(() => {
              return TagActions.deleteTagSuccess({ tagId: action.tagId });
            }),
            catchError(error => of(TagActions.deleteTagFailure({ error })))
          )
        )
      );
  });
}