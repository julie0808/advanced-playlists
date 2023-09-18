import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Video, VideoPlayerFormats } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getCurrentVideo } from '../state/video.reducer';
import * as VideoActions from "../state/video.action";


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class VideoPlayerComponent implements OnInit {

  apiLoaded = false;
  videoPlayerStatus: VideoPlayerFormats = VideoPlayerFormats.hidden;
  videoIsPlaying: boolean = false;
  videoPlayer: any;

  selectedVideo$: Observable<Video> = this.store.select(getCurrentVideo);

  playerConfig = {
    controls: 1
  } 

  public get videoPlayerFormats(): typeof VideoPlayerFormats {
    return VideoPlayerFormats; 
  }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  
  constructor(
    private store: Store<State>) { }

  ngOnInit(): void {

    this.store.dispatch(VideoActions.loadVideos());
    
    if (!this.apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

    this.selectedVideo$.subscribe(
      video => {
        if ( this.videoIsValid(video) && this.videoPlayerStatus === VideoPlayerFormats.hidden ) {
          this.videoPlayerStatus = VideoPlayerFormats.tiny
        }
      }
    )

  }

  videoReady(event: any) {
    this.videoPlayer = event.target;
    this.playVideo();
  }

  videoIsValid(video: Video) {
    // disabled; à voir si encore utile après avoir retiré videoModified
    // return video.status !== StatusCode.invalid;
    return true;
  }

  setPlayerFormat(selectedFormat: VideoPlayerFormats) {
    this.videoPlayerStatus = selectedFormat;
  }

  playPreviousVideo() {
    //this.videoService.playVideoAction(this.currentVideoList, ActionCode.previous);
  }

  playNextVideo() {
    //this.videoService.playVideoAction(this.currentVideoList, ActionCode.next);
  }

  pauseVideo() {
    this.videoIsPlaying = false;
    this.videoPlayer.pauseVideo();
  }

  playVideo() {
    console.log('playyyyy');
    this.videoIsPlaying = true;
    this.videoPlayer.playVideo();
  }

  followState(event: any) {
    // https://developers.google.com/youtube/iframe_api_reference#Events
    switch(event.data) {
      case 0:
        // video has ended
        //this.videoService.playVideoAction(this.currentVideoList, ActionCode.next);
        this.videoIsPlaying = false;
        break;
      case -1:
        // video is unstarted
        this.playVideo();
        break;
      case 2:
        // video is paused
        break;
      case 5:
        // video is cued
        // event.target.playVideo();
        break;
      default:
        // not every state requires an action
    }
  }

}
