import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as AppState from "../../state/app.state";
import * as TagHelperFunc from "./tag-helper-func";

import { Tag } from "../tag.model";
import { TagState } from "./tag.reducer";



export interface State extends AppState.State {
  tags: TagState;
}



const getTagFeatureState = createFeatureSelector<TagState>('tags');

export const getAllTags = createSelector(
  getTagFeatureState,
  state => state.tags
)

export const getOtherTagsForPrimeNg = createSelector(
  getTagFeatureState,
  state => {
    const formattedTags = TagHelperFunc.sortTagsForPrimeNg(state.tags);
    return formattedTags;
  }
)

export const getArtistTags = createSelector(
  getTagFeatureState,
  state => {
    const artistGroup = state.tags.find((tag: Tag) => tag.id === 55) || new Tag();
    let formattedTags: Tag[] = [];

    if (artistGroup.id !== 0) {
      formattedTags = artistGroup.lst_children_tag ? artistGroup.lst_children_tag : [];
    }
    return formattedTags;
  }
)

export const getCurrentTagId = createSelector(
  getTagFeatureState,
  state => state.currentTagId
)

export const getCurrentTag = createSelector(
  getTagFeatureState,
  getCurrentTagId, 
  (state, currentTagId) => {
    if (currentTagId !== 0){
      let searchForTag = state.tags.find(p => p.id === currentTagId) || new Tag();

      if (searchForTag.id === 0) {

        for( const tag of state.tags){
          if ( tag.lst_children_tag !== null ) {
            searchForTag = tag.lst_children_tag.find(p => {
              if (p.id === currentTagId){
                return true;
              }
            }) || new Tag();
  
            if (searchForTag.id !== 0){ break; };
          }
        }
      }
      return searchForTag;
    } else {
      return new Tag();
    }

  }
)

export const getParentTags = createSelector(
  getTagFeatureState,
  state => {
    const filteredTags = state.tags.filter(tag => {
      return tag.parent_tag_id === 0 || tag.parent_tag_id === null;
    });

   return filteredTags;
  }
)
