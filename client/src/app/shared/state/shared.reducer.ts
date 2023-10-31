import { createReducer, on } from "@ngrx/store";

import { PlaylistApiActions, PlaylistPageActions } from "./actions";

import { Playlist } from "src/app/shared/model/playlist.model";



export interface SharedState {
  playlists: Playlist[];
  currentPlaylistId: string;
  error: string;
}

const initialState: SharedState = {
  playlists: [],
  currentPlaylistId: 'PLwgftAdEcD4rXHmDdFTFI8Hch3BfWBQIt',
  error: ''
}



export const sharedReducer = createReducer<SharedState>(
  initialState,
  on(
    PlaylistPageActions.setCurrentPlaylist,
    (state, action): SharedState => {
      return {
        ...state,
        currentPlaylistId: action.playlistId
      }
    }
  ),
  on(
    PlaylistPageActions.initializeCurrentPlaylist,
    (state): SharedState => {
      return {
        ...state,
        currentPlaylistId: ''
      }
    }
  ),
  on(
    PlaylistPageActions.clearCurrentPlaylist,
    (state): SharedState => {
      return {
        ...state,
        currentPlaylistId: ''
      }
    }
  ),



  // CRUD
  on(PlaylistApiActions.loadPlaylistsSuccess,
    (state, action): SharedState => {
      return {
        ...state,
        playlists: action.playlists,
        error: ''
      }
    }
  ),
  on(PlaylistApiActions.loadPlaylistsFailure,
    (state, action): SharedState => {
      return {
        ...state,
        playlists: [],
        error: action.error
      }
    }
  ),

)