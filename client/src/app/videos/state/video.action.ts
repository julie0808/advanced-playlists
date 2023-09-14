import { createAction, props } from "@ngrx/store";

import { IVideo } from "../video.model";

export const setCurrentVideo = createAction(
  '[Video] Set current video',
  props<{ video: IVideo }>() 
);