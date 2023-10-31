import { createFeatureSelector, createSelector } from "@ngrx/store";

import * as AppState from "../../state/app.state";

import { SharedState } from "./shared.reducer";



export interface State extends AppState.State {
  shared: SharedState;
}



const getSharedFeatureState = createFeatureSelector<SharedState>('shared');

export const getPlaylists = createSelector(
  getSharedFeatureState,
  state => state.playlists
)

export const getCurrentPlaylistId = createSelector(
  getSharedFeatureState,
  state => state.currentPlaylistId
)

export const getCurrentPlaylist = createSelector(
  getSharedFeatureState,
  getCurrentPlaylistId, 
  (state, currentPlaylistId) => {
    if (currentPlaylistId) {
      let searchForPlaylist = state.playlists.find(i => i.id === currentPlaylistId) || null;
      return searchForPlaylist;
    } else {
      return null;
    }
  }
)