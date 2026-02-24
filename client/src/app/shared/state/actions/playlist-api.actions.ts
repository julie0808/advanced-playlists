import { createAction, props } from "@ngrx/store";

import { Playlist } from "src/app/playlists/playlist.model";



export const loadPlaylistsSuccess = createAction(
  '[Playlist API] Load Success',
  props<{ playlists: Playlist[], customPlaylists: Playlist[] }>() 
);

export const loadPlaylistsFailure = createAction(
  '[Playlist API] Load Failure',
  props<{ error: string }>() 
);