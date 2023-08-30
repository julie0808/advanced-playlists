import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

import * as AppState from "../../state/app.state";
import * as VideoActions from "./video.action";

import { IVideo } from "../video.model";



// init
export interface State extends AppState.State {
  videos: VideoState;
}

export interface VideoState {
  currentVideoPlaying: IVideo; //STORER LE ID À LA PLACE (éviter à avoir à modifier plusieurs endroits si update) TODO
  //// videoList: IVideo[]; TODO
}

const initialState: VideoState = {
  currentVideoPlaying: new IVideo()
}





// selectors
const getVideoFeatureState = createFeatureSelector<VideoState>('videos');

export const getCurrentVideo = createSelector(
  getVideoFeatureState,
  state => state.currentVideoPlaying
)





// functions
export const videoReducer = createReducer<VideoState>(
  initialState,
  on(
    VideoActions.setCurrentVideo,
    // "action" below corresponds to the Actions data (props)
    (state, action): VideoState => {
      return {
        ...state,
        currentVideoPlaying: action.video
      }
    }
  )
)