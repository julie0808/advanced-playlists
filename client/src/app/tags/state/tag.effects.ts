import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TagService } from '../tag-service';
import { TagPageActions, TagApiActions } from './actions';

@Injectable()
export class TagEffects {

  constructor(private actions$: Actions, private tagService: TagService) { }

  loadTags$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TagPageActions.loadTags),
      mergeMap(() => this.tagService.getTagsFromDatabase()
          .pipe(
            map(tags => TagApiActions.loadTagsSuccess({ tags })),
            catchError(error => of(TagApiActions.loadTagsFailure({ error })))
          )
        )
    )
  });

  loadTagsAssociations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TagPageActions.loadTagAssociations),
      mergeMap(() => this.tagService.getTagAssociations()
          .pipe(
            map(tags => TagApiActions.loadTagsSuccess({ tags })),
            catchError(error => of(TagApiActions.loadTagsFailure({ error })))
          )
        )
    )
  });


  /*
  updateTag$ = createEffect(() => {
   
  });

  createTag$ = createEffect(() => {
    
  });

  deleteTag$ = createEffect(() => {
   
  });*/
}