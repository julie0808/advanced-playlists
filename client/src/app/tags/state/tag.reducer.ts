import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

import * as AppState from "../../state/app.state";
import * as TagActions from "./tag.action";
import * as TagHelperFunc from "./tag-helper-func";

import { ITag } from "../tag.model";



export interface State extends AppState.State {
  tags: TagState;
}

export interface TagState {
  currentTagId: number | null;
  tags: ITag[];
  error: string;
}

const initialState: TagState = {
  currentTagId: null,
  tags: [],
  error: ''
};



const getTagFeatureState = createFeatureSelector<TagState>('tags');

export const getTags = createSelector(
  getTagFeatureState,
  state => state.tags
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
      let searchForTag = state.tags.find(p => p.id === currentTagId) || new ITag();

      if (searchForTag.id === 0) {

        for( const tag of state.tags){
          if ( tag.lst_children_tag !== null ) {
            searchForTag = tag.lst_children_tag.find(p => {
              if (p.id === currentTagId){
                return true;
              }
            }) || new ITag();
  
            if (searchForTag.id !== 0){ break; };
          }
        }
      }
      return searchForTag;
    } else {
      return new ITag();
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



export const tagReducer = createReducer<TagState>(
  initialState,
  on(
    TagActions.setCurrentTag,
    (state, action): TagState => {
      return {
        ...state,
        currentTagId: action.tagId
      }
    }
  ),
  on(
    TagActions.initializeCurrentTag,
    (state): TagState => {
      return {
        ...state,
        currentTagId: 0
      }
    }
  ),
  on(
    TagActions.clearCurrentTag,
    (state): TagState => {
      return {
        ...state,
        currentTagId: 0
      }
    }
  ),



  // CRUD
  on(TagActions.loadTagsSuccess,
    (state, action): TagState => {
      return {
        ...state,
        tags: action.tags,
        error: ''
      }
    }
  ),
  on(TagActions.loadTagsFailure,
    (state, action): TagState => {
      return {
        ...state,
        tags: [],
        error: action.error
      }
    }
  ),



  on(TagActions.updateTagSuccess,
    (state, action): TagState => {
      const updatedTags = TagHelperFunc.updateTagFromList(state.tags, action.tag);

      return {
        ...state,
        tags: updatedTags,
        currentTagId: action.tag.id,
        error: ''
      }
    }
  ),
  on(TagActions.updateTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),



  on(TagActions.createTagSuccess,
    (state, action): TagState => {

      const updatedTags = TagHelperFunc.addTagToList(state.tags, action.tag);
      
      const newState = {
        ...state,
        tags: updatedTags,
        currentTagId: action.tag.id,
        error: ''
      }

      console.log('CURRENT STATE', state.tags);
      console.log('UPDATEDTAGS', updatedTags);
      console.log('NEW STATE', newState);

      return newState;
    }
  ),
  on(TagActions.createTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),



  on(TagActions.deleteTagSuccess,
    (state, action): TagState => {

      const updatedTags = TagHelperFunc.removeTagFromList(state.tags, action.tagId);
     
      return {
        ...state,
        tags: updatedTags,
        currentTagId: 0,
        error: ''
      }
    }
  ),
  on(TagActions.deleteTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  )

)

