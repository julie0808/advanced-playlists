import { createAction, props } from "@ngrx/store";

import { Playlist } from "src/app/shared/model/playlist.model";



export const loadPlaylistsSuccess = createAction(
  '[Playlist API] Load Success',
  props<{ playlists: Playlist[] }>() 
);

export const loadPlaylistsFailure = createAction(
  '[Playlist API] Load Failure',
  props<{ error: string }>() 
);