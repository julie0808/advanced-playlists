import { createReducer, on } from "@ngrx/store";

import { PlaylistApiActions, PlaylistPageActions } from "./actions";

import { Playlist } from "src/app/playlists/playlist.model";



export interface SharedState {
  appInitialized: boolean;
  playlists: Playlist[];
  customPlaylists: Playlist[];
  currentPlaylistId: string;
  error: string;
}

const initialState: SharedState = {
  appInitialized: false,
  playlists: [],
  customPlaylists: [],
  currentPlaylistId: '',
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
        customPlaylists: action.customPlaylists,
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