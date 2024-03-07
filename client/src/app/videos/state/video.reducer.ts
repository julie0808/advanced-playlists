import { createReducer, on } from "@ngrx/store";

import { VideoApiActions, VideoPageActions } from "./actions";

import { Video, VideoRating } from "../video.model";
import { Tag } from "src/app/tags/tag.model";
import { orderTagsAlphabetically } from "src/app/tags/state/tag-helper-func";




export interface VideoState {
  currentVideoPlayingId: string;
  currentVideoEditedId: string;
  videos: Video[];
  sortingSelectedTags: Tag[];
  sortingSelectedRatings: VideoRating[];
  sortingSelectedNew: boolean;
  error: string;
}

const initialState: VideoState = {
  currentVideoPlayingId: '',
  currentVideoEditedId: '',
  videos: [],
  sortingSelectedTags: [],
  sortingSelectedRatings: [],
  sortingSelectedNew: false,
  error: ''
}


// functions
export const videoReducer = createReducer<VideoState>(
  initialState,
  on(
    VideoPageActions.setCurrentVideo,
    (state, action): VideoState => {
      return {
        ...state,
        currentVideoPlayingId: action.videoId
      }
    }
  ),
  on(
    VideoPageActions.setCurrentVideoEditedId,
    (state, action): VideoState => {
      return {
        ...state,
        currentVideoEditedId: action.videoId
      }
    }
  ),
  on(
    VideoPageActions.setSortingSelectedTags,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedTags: action.tags
      }
    }
  ),
  on(
    VideoPageActions.setSortingSelectedRatings,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedRatings: action.ratings
      }
    }
  ),
  on(
    VideoPageActions.setSortingSelectedNew,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedNew: action.isNew
      }
    }
  ),



  on(VideoApiActions.loadVideosSuccess,
    (state, action): VideoState => {
      return {
        ...state,
        videos: action.videos,
        error: ''
      }
    }
  ),
  on(VideoApiActions.loadVideosFailure,
    (state, action): VideoState => {
      return {
        ...state,
        videos: [],
        error: action.error
      }
    }
  ),



  on(VideoApiActions.updateVideoSuccess,
    (state, action): VideoState => {
      const updatedVideos = state.videos.map(
        item => {
          return action.video.youtubeId === item.youtubeId ? action.video : item;
        }
      )

      return {
        ...state,
        videos: updatedVideos,
        error: ''
      }
    }
  ),
  on(VideoApiActions.updateVideoFailure,
    (state, action): VideoState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),



  
  on(VideoPageActions.updateVideoTag,
    (state, action): VideoState => {
      const updatedVideos = state.videos.map(
        item => {
          const updatedTags =  item.tags.map( t => t.id === action.tag.id ? action.tag : t);
          const reorderedTags = orderTagsAlphabetically(updatedTags);

          return {
            ...item,
            tags: reorderedTags
          }
        }
      );
     
      return {
        ...state,
        videos: updatedVideos,
        error: ''
      }
    }
  ),
  on(VideoPageActions.deleteVideoTag,
    (state, action): VideoState => {
      const updatedVideos = state.videos.map(
        item => {
          const findDeletedTag = item.tags.findIndex( t => t.id === action.tagId );
          let updatedItem = item;

          if (findDeletedTag > -1) {
            updatedItem = {
              ...item,
              tags: item.tags.splice(findDeletedTag, 1)
            }
          }
          return updatedItem;
        }
      );
      
      return {
        ...state,
        videos: updatedVideos,
        error: ''
      }
    }
  ),

  on(VideoPageActions.initializeFilters,
    (state): VideoState => {
      return {
        ...state,
        sortingSelectedTags: [],
        sortingSelectedRatings: [],
        sortingSelectedNew: false
      }
    }
  )
  

)