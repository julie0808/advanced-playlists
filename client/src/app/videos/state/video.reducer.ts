import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

import * as AppState from "../../state/app.state";
import * as VideoActions from "./video.action";

import { Video } from "../video.model";
import { Tag } from "src/app/tags/tag.model";



// init
export interface State extends AppState.State {
  videos: VideoState;
}

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



// selectors
const getVideoFeatureState = createFeatureSelector<VideoState>('videos');

export const getCurrentVideoId = createSelector(
  getVideoFeatureState,
  state => state.currentVideoPlayingId
)

export const getVideos = createSelector(
  getVideoFeatureState,
  state => state.videos
)

export const getCurrentVideoEditedId = createSelector(
  getVideoFeatureState,
  state => state.currentVideoEditedId
)

export const getCurrentVideoEdited = createSelector(
  getVideoFeatureState,
  getCurrentVideoEditedId, 
  (state, currentVideoEditedId) => {
    if (currentVideoEditedId !== ''){
      let searchForVideo = state.videos.find(v => v.youtubeId === currentVideoEditedId) || new Video();

      if (searchForVideo.youtubeId !== '') {
        return searchForVideo;
      }    else {
        return new Video();
      }   
    } else {
      return new Video();
    }

  }
)

export const getSortedVideos = createSelector(
  getVideoFeatureState,
  state => {
    let sortedVideos: Video[] = state.videos;

    if(sortedVideos.length){

      // New tags
      if (state.sortingSelectedNew === true) {
        sortedVideos = sortedVideos.filter((video: Video) => {
          return video.rating === 0;
        });
      }

      // Rating
      if (state.sortingSelectedRatings.length){
        sortedVideos = sortedVideos.filter((video: Video) => {
          return state.sortingSelectedRatings.some(rating => {
            return rating === video.rating;
          });
        });
      }

      // Selected tags
      if (state.sortingSelectedTags.length) {
        
        sortedVideos = sortedVideos.filter( (video: Video) => {
          const combineTagTypes = video.tags.concat(video.artists);
          const videoTags = combineTagTypes || [];

          if (videoTags.length){
            return videoTags.some(videoTag => {
              return state.sortingSelectedTags.some(selectedTag => {
                return selectedTag.id === videoTag.id;
              });
            })
          }
          return false;
        });
      }       

    }

    return sortedVideos;
  }
)

export const getCurrentVideo = createSelector(
  getVideoFeatureState,
  getCurrentVideoId,
  (state, getCurrentVideoId) => {
    const currentVideo = state.videos.find(v => v.youtubeId === getCurrentVideoId) || new Video();
    return currentVideo;
  }
)





// functions
export const videoReducer = createReducer<VideoState>(
  initialState,
  on(
    VideoActions.setCurrentVideo,
    (state, action): VideoState => {
      return {
        ...state,
        currentVideoPlayingId: action.videoId
      }
    }
  ),
  on(
    VideoActions.setCurrentVideoEditedId,
    (state, action): VideoState => {
      return {
        ...state,
        currentVideoEditedId: action.videoId
      }
    }
  ),
  on(
    VideoActions.setSortingSelectedTags,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedTags: action.tags
      }
    }
  ),
  on(
    VideoActions.setSortingSelectedRatings,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedRatings: action.ratings
      }
    }
  ),
  on(
    VideoActions.setSortingSelectedNew,
    (state, action): VideoState => {
      return {
        ...state,
        sortingSelectedNew: action.isNew
      }
    }
  ),



  on(VideoActions.loadVideosSuccess,
    (state, action): VideoState => {
      return {
        ...state,
        videos: action.videos,
        error: ''
      }
    }
  ),
  on(VideoActions.loadVideosFailure,
    (state, action): VideoState => {
      return {
        ...state,
        videos: [],
        error: action.error
      }
    }
  ),



  on(VideoActions.updateVideoSuccess,
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
  on(VideoActions.updateVideoFailure,
    (state, action): VideoState => {
      return {
        ...state,
        error: action.error
      }
    }
  ),
)