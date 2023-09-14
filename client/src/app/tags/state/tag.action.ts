import { createAction, props } from "@ngrx/store";

import { ITag } from "../tag.model";

export const setCurrentTag = createAction(
  '[Tag] Set current tag',
  props<{ tagId: number }>() 
);

export const clearCurrentTag = createAction(
  '[Tag] Clear current tag'
);

export const initializeCurrentTag = createAction(
  '[Tag] Initialize current tag'
);



//////////// CRUD

export const loadTags = createAction(
  '[Tag] Load'
);

export const loadTagsSuccess = createAction(
  '[Tag] Load Success',
  props<{ tags: ITag[] }>() 
);

export const loadTagsFailure = createAction(
  '[Tag] Load Failure',
  props<{ error: string }>() 
);



export const updateTag = createAction(
  '[Tag] Update Tag',
  props<{ tag: ITag }>()
);

export const updateTagSuccess = createAction(
  '[Tag] Update Tag Success',
  props<{ tag: ITag }>()
);

export const updateTagFailure = createAction(
  '[Tag] Update Tag Failure',
  props<{ error: string }>()
);



export const createTag = createAction(
  '[Tag] Create Tag',
  props<{ tag: ITag }>()
);

export const createTagSuccess = createAction(
  '[Tag] Create Tag Success',
  props<{ tag: ITag }>()
);

export const createTagFailure = createAction(
  '[Tag] Create Tag Failure',
  props<{ error: string }>()
);



export const deleteTag = createAction(
  '[Tag] Delete Tag',
  props<{ tagId: number }>()
);

export const deleteTagSuccess = createAction(
  '[Tag] Delete Tag Success',
  props<{ tagId: number }>()
);

export const deleteTagFailure = createAction(
  '[Tag] Delete Tag Failure',
  props<{ error: string }>()
);