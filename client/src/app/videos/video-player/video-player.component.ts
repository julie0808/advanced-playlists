import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VideoService } from '../video.service';
import { IVideo, VideoPlayerFormats } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getCurrentVideo } from '../state/video.reducer';

import { ActionCode, StatusCode } from 'src/app/shared/global-model';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class VideoPlayerComponent implements OnInit {

  apiLoaded = false;
  currentVideoList!: IVideo[];
  videoPlayerStatus: VideoPlayerFormats = VideoPlayerFormats.hidden;
  videoIsPlaying: boolean = false;
  videoPlayer: any;

  selectedVideo: IVideo = new IVideo();

  playerConfig = {
    controls: 1
  } 

  public get videoPlayerFormats(): typeof VideoPlayerFormats {
    return VideoPlayerFormats; 
  }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  

  video$ = this.videoService.videoPlaying$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  videoList$ = this.videoService.videosSorted$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(
    private store: Store<State>,
    private videoService: VideoService) { }

  ngOnInit(): void {
    
    if (!this.apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

    this.videoList$.subscribe( (videos: IVideo[]) => {
      this.currentVideoList = videos;
    });

    this.store.select(getCurrentVideo).subscribe(
      currentVideo => {
        this.selectedVideo = currentVideo;
        if ( this.videoIsValid(this.selectedVideo) && this.videoPlayerStatus === VideoPlayerFormats.hidden ) {
          this.videoPlayerStatus = VideoPlayerFormats.tiny
        }
      }
    );

  }

  videoReady(event: any) {
    this.videoPlayer = event.target;
  }

  videoIsValid(video: IVideo) {
    return video.status !== StatusCode.invalid;
  }

  setPlayerFormat(selectedFormat: VideoPlayerFormats) {
    this.videoPlayerStatus = selectedFormat;
  }

  playPreviousVideo() {
    this.videoService.playVideoAction(this.currentVideoList, ActionCode.previous);
  }

  playNextVideo() {
    this.videoService.playVideoAction(this.currentVideoList, ActionCode.next);
  }

  pauseVideo() {
    this.videoIsPlaying = false;
    this.videoPlayer.pauseVideo();
  }

  playVideo() {
    this.videoIsPlaying = true;
    this.videoPlayer.playVideo();
  }

  followState(event: any) {
    // https://developers.google.com/youtube/iframe_api_reference#Events
    switch(event.data) {
      case 0:
        // video has ended
        this.videoService.playVideoAction(this.currentVideoList, ActionCode.next);
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
