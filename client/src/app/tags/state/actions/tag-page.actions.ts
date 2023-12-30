import { createAction, props } from "@ngrx/store";

import { Tag } from "../../tag.model";

export const setCurrentTag = createAction(
  '[Tag Page] Set current tag',
  props<{ tagId: number }>() 
);

export const clearCurrentTag = createAction(
  '[Tag Page] Clear current tag'
);

export const initializeCurrentTag = createAction(
  '[Tag Page] Initialize current tag'
);

export const loadTags = createAction(
  '[Tag Page] Load'
);

export const updateTag = createAction(
  '[Tag Page] Update Tag',
  props<{ tag: Tag }>()
);

export const updateTagList = createAction(
  '[Tag Page] Update Tag list',
  props<{ tag: Tag }>()
);

export const createTag = createAction(
  '[Tag Page] Create Tag',
  props<{ tag: Tag }>()
);

export const deleteTag = createAction(
  '[Tag Page] Delete Tag',
  props<{ tagId: number }>()
);

export const deleteFromTagList = createAction(
  '[Tag Page] Delete from Tag list',
  props<{ tagId: number }>()
);

