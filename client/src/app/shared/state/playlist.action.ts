import { createAction, props } from "@ngrx/store";

import { IPlaylist } from "src/app/videos/playlist.model";

export const setCurrentPlaylist = createAction(
  '[Playlist] Set current Playlist',
  props<{ playlistId: string }>() 
);

export const clearCurrentPlaylist = createAction(
  '[Playlist] Clear current Playlist'
);

export const initializeCurrentPlaylist = createAction(
  '[Playlist] Initialize current Playlist'
);



//////////// CRUD

export const loadPlaylists = createAction(
  '[Playlist] Load'
);

export const loadPlaylistsSuccess = createAction(
  '[Playlist] Load Success',
  props<{ playlists: IPlaylist[] }>() 
);

export const loadPlaylistsFailure = createAction(
  '[Playlist] Load Failure',
  props<{ error: string }>() 
);