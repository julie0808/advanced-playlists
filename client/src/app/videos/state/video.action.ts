import { createAction, props } from "@ngrx/store";

import { Video } from "../video.model";
import { Tag } from "src/app/tags/tag.model";

export const setCurrentVideo = createAction(
  '[Video] Set current video',
  props<{ videoId: string }>() 
);

export const setCurrentVideoEditedId = createAction(
  '[Video] Set current edited video',
  props<{ videoId: string }>() 
);

export const setSortingSelectedTags = createAction(
  '[Video] Set selected tags for video sorting',
  props<{ tags: Tag[] }>() 
);

export const setSortingSelectedRatings = createAction(
  '[Video] Set selected ratings for video sorting',
  props<{ ratings: Array<number> }>() 
);

export const setSortingSelectedNew = createAction(
  '[Video] Set selected show new for video sorting',
  props<{ isNew: boolean }>() 
);



export const loadVideos = createAction(
  '[Video] Load All '
);

export const loadVideosSuccess = createAction(
  '[Video] Load Success',
  props<{ videos: Video[] }>() 
);

export const loadVideosFailure = createAction(
  '[Video] Load Failure',
  props<{ error: string }>() 
);



export const updateVideo = createAction(
  '[Video] Update Video',
  props<{ video: Video }>()
);

export const updateVideoSuccess = createAction(
  '[Video] Update Video Success',
  props<{ video: Video }>()
);

export const updateVideoFailure = createAction(
  '[Video] Update Video Failure',
  props<{ error: string }>()
);