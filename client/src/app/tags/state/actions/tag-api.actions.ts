import { createAction, props } from "@ngrx/store";

import { Tag } from "../../tag.model";

export const loadTagsSuccess = createAction(
  '[Tag API] Load Success',
  props<{ tags: Tag[] }>() 
);

export const loadTagsFailure = createAction(
  '[Tag API] Load Failure',
  props<{ error: string }>() 
);

export const updateTagSuccess = createAction(
  '[Tag API] Update Tag Success',
  props<{ tag: Tag }>()
);

export const updateTagFailure = createAction(
  '[Tag API] Update Tag Failure',
  props<{ error: string }>()
);

export const createTagSuccess = createAction(
  '[Tag API] Create Tag Success',
  props<{ tag: Tag }>()
);

export const createTagFailure = createAction(
  '[Tag API] Create Tag Failure',
  props<{ error: string }>()
);

export const deleteTagSuccess = createAction(
  '[Tag API] Delete Tag Success',
  props<{ tagId: number }>()
);

export const deleteTagFailure = createAction(
  '[Tag API] Delete Tag Failure',
  props<{ error: string }>()
);