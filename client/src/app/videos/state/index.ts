import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as AppState from "../../state/app.state";

import { VideoState } from "src/app/videos/state/video.reducer";

import { Video } from "../video.model";



export interface State extends AppState.State {
  videos: VideoState;
}



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
            return rating.rating === video.rating;
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

export const getFirstVideoId = createSelector(
  getSortedVideos,
  sortedVideos => {
    const firstVideo = sortedVideos.length ? sortedVideos[0].youtubeId : "";
    return firstVideo;
  }
)

export const getNextVideoId = createSelector(
  getCurrentVideoId,
  getSortedVideos,
  (currentId, sortedVideos) => {
    if (sortedVideos.length){
      const currentVideoPosition = sortedVideos.findIndex( (v: Video) => {
        return v.youtubeId === currentId;
      });

      if(currentVideoPosition !== -1) {
        const videosSortedLength = sortedVideos.length;
        let newVideoPosition = 0;
        let newVideo;

        newVideoPosition = videosSortedLength - 1 === currentVideoPosition ? 0 : currentVideoPosition + 1;
        newVideo = sortedVideos[newVideoPosition].youtubeId;

        return newVideo;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
)

export const getPreviousVideoId = createSelector(
  getCurrentVideoId,
  getSortedVideos,
  (currentId, sortedVideos) => {
    if (sortedVideos.length){
      const currentVideoPosition = sortedVideos.findIndex( (v: Video) => {
        return v.youtubeId === currentId;
      });

      if(currentVideoPosition !== -1) {
        const videosSortedLength = sortedVideos.length;
        let newVideoPosition = 0;
        let newVideo;

        newVideoPosition = currentVideoPosition === 0 ? videosSortedLength - 1 : currentVideoPosition - 1;

        newVideo = sortedVideos[newVideoPosition].youtubeId;

        return newVideo;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
)

export const getCurrentVideoPosition = createSelector(
  getCurrentVideoId,
  getSortedVideos,
  (currentId, sortedVideos) => {
    return sortedVideos.findIndex( (v: Video) => {
      return v.youtubeId === currentId;
    }) + 1 || 0;
  }
)



export const getSortingSelectedTags = createSelector(
  getVideoFeatureState,
  state => state.sortingSelectedTags
)

export const getSortingSelectedRatings = createSelector(
  getVideoFeatureState,
  state => state.sortingSelectedRatings
)

export const getSortingSelectedNew = createSelector(
  getVideoFeatureState,
  state => state.sortingSelectedNew
)