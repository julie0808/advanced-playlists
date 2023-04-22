import { createAction, props } from '@ngrx/store';

import { ITag } from '../../tag-model';

export const setCurrentTag = createAction(
  '[Tag Page] Set Current Tag',
  props<{ currentTagId: number }>()
);

export const clearCurrentTag = createAction(
  '[Tag Page] Clear Current Tag'
);

export const initializeCurrentTag = createAction(
  '[Tag Page] Initialize Current Tag'
);

export const loadTags = createAction(
  '[Tag Page] Load'
);

export const loadTagAssociations = createAction(
  '[Tag Page] Load associations'
);

export const updateTag = createAction(
  '[Tag Page] Update Tag',
  props<{ tag: ITag }>()
);

export const createTag = createAction(
  '[Tag Page] Create Tag',
  props<{ tag: ITag }>()
);

export const deleteTag = createAction(
  '[Tag Page] Delete Tag',
  props<{ tag: ITag }>()
);