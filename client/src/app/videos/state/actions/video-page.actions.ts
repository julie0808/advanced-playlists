import { createAction, props } from "@ngrx/store";

import { Video } from "../../video.model";
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

export const updateVideo = createAction(
  '[Video] Update Video',
  props<{ video: Video }>()
);

export const updateVideoTag = createAction(
 '[Video (from tag)] Update Video tag',
 props<{ tag: Tag }>()
)

export const deleteVideoTag = createAction(
  '[Video (from tag)] Delete Video tag',
  props<{ tagId: number }>()
 )

