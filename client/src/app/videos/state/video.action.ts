import { createAction, props } from "@ngrx/store";

import { IVideo } from "../video.model";

export const setCurrentVideo = createAction(
  '[Video] Set current video',
  // the value to receive from user action so the Action can send it to Reducer, 
  // that will in turn process it to modify store
  props<{ video: IVideo }>() 
);