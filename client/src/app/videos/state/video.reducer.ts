import { createReducer, on } from "@ngrx/store";

import { VideoApiActions, VideoPageActions } from "./actions";

import { Video, VideoRating } from "../video.model";
import { Tag } from "../../tags/tag.model";
import { orderTagsAlphabetically } from "../../tags/state/tag-helper-func";



export interface VideoState {
  currentVideoPlayingId: string;
  currentVideoEditedId: string;
  videos: Video[];
  sortingIncludedTags: Tag[];
  sortingExcludedTags: Tag[];
  sortingSelectedRatings: VideoRating[];
  sortingNeedsReview: boolean;
  sortingOldestFirst: boolean;
  settingRepeatOn: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: VideoState = {
  currentVideoPlayingId: '',
  currentVideoEditedId: '',
  videos: [],
  sortingIncludedTags: [],
  sortingExcludedTags: [],
  sortingSelectedRatings: [],
  sortingNeedsReview: false,
  sortingOldestFirst: false,
  settingRepeatOn: false,
  isLoading: false,
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
  on(VideoPageActions.loadVideos,
    (state): VideoState => {
      return {
        ...state,
        isLoading: true,
        error: ''
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
    VideoPageActions.setSortingIncludedTags,
    (state, action): VideoState => {
      return {
        ...state,
        sortingIncludedTags: action.tags,
        sortingExcludedTags: action.excludedTags
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
    VideoPageActions.setSortingNeedsReview,
    (state, action): VideoState => {
      return {
        ...state,
        sortingNeedsReview: action.needsReview
      }
    }
  ),
  on(
    VideoPageActions.setSortingOldestFirst,
    (state, action): VideoState => {
      return {
        ...state,
        sortingOldestFirst: action.isOldestFirst
      }
    }
  ),
  on(
    VideoPageActions.setSettingRepeatOn,
    (state, action): VideoState => {
      return {
        ...state,
        settingRepeatOn: action.settingRepeatOn
      }
    }
  ),



  on(
    VideoApiActions.loadVideosSuccess,
    VideoPageActions.refreshVideos,
    (state, action): VideoState => {
      return {
        ...state,
        videos: action.videos,
        isLoading: false,
        error: ''
      }
    }
  ),
  on(VideoApiActions.loadVideosFailure,
    (state, action): VideoState => {
      return {
        ...state,
        videos: [],
        isLoading: false,
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
        sortingIncludedTags: [],
        sortingExcludedTags: [],
        sortingSelectedRatings: [],
        sortingNeedsReview: false
      }
    }
  )
  

)