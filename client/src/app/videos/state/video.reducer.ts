import { createReducer, on } from "@ngrx/store";

import { VideoApiActions, VideoPageActions } from "./actions";

import { Video } from "../video.model";
import { Tag } from "src/app/tags/tag.model";



export interface VideoState {
  currentVideoPlayingId: string;
  currentVideoEditedId: string;
  videos: Video[];
  sortingSelectedTags: Tag[];
  sortingSelectedRatings: Array<number>;
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
      const updatedProducts = state.videos.map(
        item => {
          return action.video.youtubeId === item.youtubeId ? action.video : item;
        }
      )

      return {
        ...state,
        videos: updatedProducts,
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
)