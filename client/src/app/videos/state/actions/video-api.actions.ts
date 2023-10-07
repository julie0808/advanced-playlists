import { createAction, props } from "@ngrx/store";

import { Video } from "../../video.model";

export const loadVideosSuccess = createAction(
  '[Video] Load Success',
  props<{ videos: Video[] }>() 
);

export const loadVideosFailure = createAction(
  '[Video] Load Failure',
  props<{ error: string }>() 
);

export const updateVideoSuccess = createAction(
  '[Video] Update Video Success',
  props<{ video: Video }>()
);

export const updateVideoFailure = createAction(
  '[Video] Update Video Failure',
  props<{ error: string }>()
);