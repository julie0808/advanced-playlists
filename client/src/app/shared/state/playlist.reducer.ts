import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

import * as AppState from "../../state/app.state";
import * as PlaylistActions from "./playlist.action";

import { IPlaylist } from "src/app/videos/playlist.model";



export interface State extends AppState.State {
  playlists: PlaylistState;
}

export interface PlaylistState {
  playlists: IPlaylist[];
  currentPlaylistId: string | null;
  error: string;
}

const initialState: PlaylistState = {
  playlists: [],
  currentPlaylistId: null,
  error: ''
}



const getPlaylistFeatureState = createFeatureSelector<PlaylistState>('playlists');

export const getPlaylists = createSelector(
  getPlaylistFeatureState,
  state => state.playlists
)

export const getCurrentPlaylistId = createSelector(
  getPlaylistFeatureState,
  state => state.currentPlaylistId
)

export const getCurrentPlaylist = createSelector(
  getPlaylistFeatureState,
  getCurrentPlaylistId, 
  (state, currentPlaylistId) => {
    if (currentPlaylistId) {
      return state.playlists.find(i => i.id === currentPlaylistId);
    } else {
      return null;
    }
  }
)



export const playlistReducer = createReducer<PlaylistState>(
  initialState,
  on(
    PlaylistActions.setCurrentPlaylist,
    (state, action): PlaylistState => {
      return {
        ...state,
        currentPlaylistId: action.playlistId
      }
    }
  ),
  on(
    PlaylistActions.initializeCurrentPlaylist,
    (state): PlaylistState => {
      return {
        ...state,
        currentPlaylistId: ''
      }
    }
  ),
  on(
    PlaylistActions.clearCurrentPlaylist,
    (state): PlaylistState => {
      return {
        ...state,
        currentPlaylistId: ''
      }
    }
  ),



  // CRUD
  on(PlaylistActions.loadPlaylistsSuccess,
    (state, action): PlaylistState => {
      return {
        ...state,
        playlists: action.playlists,
        error: ''
      }
    }
  ),
  on(PlaylistActions.loadPlaylistsFailure,
    (state, action): PlaylistState => {
      return {
        ...state,
        playlists: [],
        error: action.error
      }
    }
  ),

)