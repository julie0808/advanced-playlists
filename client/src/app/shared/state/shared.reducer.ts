import { createReducer, on } from "@ngrx/store";

import { PlaylistApiActions, PlaylistPageActions, AuthApiActions, AuthPageActions } from "./actions";
import { SocialUser } from "@abacritt/angularx-social-login";

import { Playlist } from "src/app/playlists/playlist.model";



export interface SharedState {
  appInitialized: boolean;
  playlists: Playlist[];
  customPlaylists: Playlist[];
  currentPlaylistId: string;
  error: string;
  user: SocialUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const initialState: SharedState = {
  appInitialized: false,
  playlists: [],
  customPlaylists: [],
  currentPlaylistId: '',
  error: '',
  user: null,
  isAuthenticated: false,
  isAuthLoading: false
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

  // Auth
  on(AuthPageActions.initializeAuth,
    (state): SharedState => {
      return {
        ...state,
        isAuthLoading: true
      }
    }
  ),
  on(AuthApiActions.loginSuccess,
    (state, action): SharedState => {
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        isAuthLoading: false,
        error: ''
      }
    }
  ),
  on(AuthApiActions.loginFailure,
    (state, action): SharedState => {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAuthLoading: false,
        error: action.error
      }
    }
  ),
  on(AuthApiActions.logoutSuccess,
    (state): SharedState => {
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAuthLoading: false,
        error: ''
      }
    }
  ),

)