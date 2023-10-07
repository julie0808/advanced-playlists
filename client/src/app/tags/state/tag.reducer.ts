import { createReducer, on } from "@ngrx/store";

import { TagApiActions, TagPageActions } from "./actions";

import { Tag } from "../tag.model";
import * as TagHelperFunc from "./tag-helper-func";



export interface TagState {
  currentTagId: number | null;
  tags: Tag[];
  error: string;
}

const initialState: TagState = {
  currentTagId: null,
  tags: [],
  error: ''
};



export const tagReducer = createReducer<TagState>(
  initialState,
  on(
    TagPageActions.setCurrentTag,
    (state, action): TagState => {
      return {
        ...state,
        currentTagId: action.tagId
      }
    }
  ),
  on(
    TagPageActions.initializeCurrentTag,
    (state): TagState => {
      return {
        ...state,
        currentTagId: 0
      }
    }
  ),
  on(
    TagPageActions.clearCurrentTag,
    (state): TagState => {
      return {
        ...state,
        currentTagId: 0
      }
    }
  ),



  // CRUD
  on(TagApiActions.loadTagsSuccess,
    (state, action): TagState => {
      return {
        ...state,
        tags: action.tags,
        error: ''
      }
    }
  ),
  on(TagApiActions.loadTagsFailure,
    (state, action): TagState => {
      return {
        ...state,
        tags: [],
        error: action.error
      }
    }
  ),



  on(TagApiActions.updateTagSuccess,
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
  on(TagApiActions.updateTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),



  on(TagApiActions.createTagSuccess,
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
  on(TagApiActions.createTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),



  on(TagApiActions.deleteTagSuccess,
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
  on(TagApiActions.deleteTagFailure,
    (state, action): TagState => {
      return {
        ...state,
        error: action.error
      }
    }
  )

)

