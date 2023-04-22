import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../state/app.state';
import { ITag } from '../tag-model';
import { TagState } from './tag.reducer';

export interface State extends AppState.State {
    tags: TagState;
}

const getTagFeatureState = createFeatureSelector<TagState>('tags');

export const getCurrentTagId = createSelector(
    getTagFeatureState,
    state => state.currentTagId
);

export const getCurrentTag = createSelector(
    getTagFeatureState,
    getCurrentTagId,
    (state, currentTagId) => {
        if (currentTagId === 0) {
            return new ITag();
        } else {
            return currentTagId ? state.tags.find(p => p.id === currentTagId) : null;
        }
    }
);

export const getTagsAssociations = createSelector(
  getTagFeatureState,
  state => state.tagAssociations
);

export const getTags = createSelector(
    getTagFeatureState,
    getTagsAssociations,
    (state, tagAssociations) => {
      state.tags.map(tag => {
        const associationArray = tagAssociations.filter((association: any) => association.tag_id === tag.id);
        tag.nb_associated_videos = associationArray.length;
        return tag;
      })
    }
);

export const getError = createSelector(
  getTagFeatureState,
    state => state.error
);
