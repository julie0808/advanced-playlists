import { createAction, props } from "@ngrx/store";



export const setCurrentPlaylist = createAction(
  '[Playlist Page] Set current Playlist',
  props<{ playlistId: string }>() 
);

export const clearCurrentPlaylist = createAction(
  '[Playlist Page] Clear current Playlist'
);

export const initializeCurrentPlaylist = createAction(
  '[Playlist Page] Initialize current Playlist'
);

export const loadPlaylists = createAction(
  '[Playlist Page] Load'
);