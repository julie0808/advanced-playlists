import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as AppState from "../../state/app.state";

import { VideoState } from "./video.reducer";

import { Video, VideoRating, VideoRatings } from "../video.model";
import { Tag } from "../../tags/tag.model";


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

      if (state.sortingNeedsReview) {
        sortedVideos = sortedVideos.filter((video: Video) => {
          return video.needsReview;
        });
      }

      // Rating
      if (state.sortingSelectedRatings.length){
        sortedVideos = sortedVideos.filter((video: Video) => {
          return state.sortingSelectedRatings.some((rating: VideoRating) => {
            return rating === video.rating;
          });
        });
      }

      // Included and excluded tags
      if (state.sortingExcludedTags.length) {
        sortedVideos = sortedVideos.filter( (video: Video) => {
          let combineTagTypes = video.tags.concat(video.artists);
          let videoTags = combineTagTypes || [];

          return !videoTags.some(videoTag => {
            return state.sortingExcludedTags.some(excludedTag => {
              return excludedTag.id === videoTag.id
            });
          });        
        });
      }   

      if (state.sortingIncludedTags.length) {
        sortedVideos = sortedVideos.filter( (video: Video) => {
          let combineTagTypes = video.tags.concat(video.artists);
          let videoTags = combineTagTypes || [];

          if (videoTags.length){
            return videoTags.some(videoTag => {
              return state.sortingIncludedTags.some(includedTag => {
                return includedTag.id === videoTag.id;
              });
            })
          }
          return false;
        });
      }   
      
      // Order by latest
      if (state.sortingOldestFirst === true){
        const reversed = [...sortedVideos].reverse();
        sortedVideos = reversed;
      }

    }

    return sortedVideos;
  }
)

export const getCurrentVideo = createSelector(
  getVideoFeatureState,
  getCurrentVideoId,
  (state, getCurrentVideoId) => {
    const currentVideo = state.videos.find((v: Video) => v.youtubeId === getCurrentVideoId) || new Video();
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




/*********** SORTING AND FILTERS ***************/

export const getSortingFullIncludedTags = createSelector(
  getVideoFeatureState,
  state => state.sortingIncludedTags
)

export const getSortingIncludedTags = createSelector(
  getVideoFeatureState,
  state => {
    const allTags: Tag[] = state.sortingIncludedTags;
    const includedTags: Tag[] = allTags.filter(t => t.parent_unique_code !== 'artist');
    return includedTags;
  }
)

export const getSortingIncludedArtistTags = createSelector(
  getVideoFeatureState,
  state => {
    const allTags: Tag[] = state.sortingIncludedTags;
    const includedArtistTags: Tag[] = allTags.filter(t => t.parent_unique_code === 'artist');
    return includedArtistTags;
  }
)

export const getSortingExcludedTags = createSelector(
  getVideoFeatureState,
  state => state.sortingExcludedTags
)

export const getSortingSelectedRatings = createSelector(
  getVideoFeatureState,
  state => state.sortingSelectedRatings
)

export const getSortingNeedsReview = createSelector(
  getVideoFeatureState,
  state => state.sortingNeedsReview
)

export const getSortingOldestFirst = createSelector(
  getVideoFeatureState,
  state => state.sortingOldestFirst
)