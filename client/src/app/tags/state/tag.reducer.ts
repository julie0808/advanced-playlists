import { createReducer, on } from '@ngrx/store';

import { ITag } from '../tag-model';

import * as AppState from '../../state/app.state';
import { TagPageActions, TagApiActions } from './actions';

export interface State extends AppState.State {
  tags: TagState;
}

export interface TagState {
  currentTagId: number | null;
  tags: ITag[],
  tagAssociations: any[],
  error: string;
}

const initialState: TagState = {
  currentTagId: null,
  tags: [],
  tagAssociations: [],
  error: ''
};

export const tagReducer = createReducer<TagState>(
  initialState,
  on(TagPageActions.setCurrentTag, (state, action): TagState => {
    return {
      ...state,
      currentTagId: action.currentTagId
    };
  }),
  on(TagPageActions.clearCurrentTag, (state): TagState => {
    return {
      ...state,
      currentTagId: null
    };
  }),
  on(TagPageActions.initializeCurrentTag, (state): TagState => {
    return {
      ...state,
      currentTagId: 0
    };
  }),
  on(TagApiActions.loadTagsSuccess, (state, action): TagState => {
    return {
      ...state,
      tags: action.tags,
      error: ''
    };
  }),
  on(TagApiActions.loadTagsFailure, (state, action): TagState => {
    return {
      ...state,
      tags: [],
      error: action.error
    };
  }),
  on(TagApiActions.updateTagSuccess, (state, action): TagState => {
    const updatedTags = state.tags.map(
      item => action.tag.id === item.id ? action.tag : item);
    return {
      ...state,
      tags: updatedTags,
      currentTagId: action.tag.id,
      error: ''
    };
  }),
  on(TagApiActions.updateTagFailure, (state, action): TagState => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(TagApiActions.createTagSuccess, (state, action): TagState => {
    return {
      ...state,
      tags: [...state.tags, action.tag],
      currentTagId: action.tag.id,
      error: ''
    };
  }),
  on(TagApiActions.createTagFailure, (state, action): TagState => {
    return {
      ...state,
      error: action.error
    };
  }),
  on(TagApiActions.deleteTagSuccess, (state, action): TagState => {
    return {
      ...state,
      tags: state.tags.filter(tag => tag.id !== action.tagId),
      currentTagId: null,
      error: ''
    };
  }),
  on(TagApiActions.deleteTagFailure, (state, action): TagState => {
    return {
      ...state,
      error: action.error
    };
  })
);
