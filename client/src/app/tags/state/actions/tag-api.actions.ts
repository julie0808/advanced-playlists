import { createAction, props } from '@ngrx/store';

import { ITag } from '../../tag-model';

export const loadTagsSuccess = createAction(
  '[Tag API] Load Success',
  props<{ tags: ITag[] }>()
);

export const loadTagsFailure = createAction(
  '[Tag API] Load Fail',
  props<{ error: string }>()
);

export const updateTagSuccess = createAction(
  '[Tag API] Update Tag Success',
  props<{ tag: ITag }>()
);

export const updateTagFailure = createAction(
  '[Tag API] Update Tag Fail',
  props<{ error: string }>()
);

export const createTagSuccess = createAction(
  '[Tag API] Create Tag Success',
  props<{ tag: ITag }>()
);

export const createTagFailure = createAction(
  '[Tag API] Create Tag Fail',
  props<{ error: string }>()
);

export const deleteTagSuccess = createAction(
  '[Tag API] Delete Tag Success',
  props<{ tagId: number }>()
);

export const deleteTagFailure = createAction(
  '[Tag API] Delete Tag Fail',
  props<{ error: string }>()
);
