import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Video, VideoPlayerFormats } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getCurrentVideo, getNextVideoId, getPreviousVideoId, getFirstVideoId } from '../state';
import { VideoPageActions } from "../state/actions";
import { YouTubePlayer } from '@angular/youtube-player';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('player') player: any;

  apiLoaded = false;
  videoPlayerStatus: VideoPlayerFormats = VideoPlayerFormats.tiny;
  videoIsPlaying: boolean = false;
  settingRepeatOn: boolean = false;
  isFirstVideoAfterInit: boolean = true;

  selectedVideo$: Observable<Video> = this.store.select(getCurrentVideo);
  previousVideo$ = this.store.select(getPreviousVideoId);
  nextVideo$ = this.store.select(getNextVideoId);
  firstVideo$ = this.store.select(getFirstVideoId);

  vm$ = combineLatest([
    this.selectedVideo$,
    this.previousVideo$,
    this.nextVideo$,
    this.firstVideo$
  ])
    .pipe(
      map(([selectedVideo, previousVideo, nextVideo, firstVideo]) =>
          ({ selectedVideo, previousVideo, nextVideo, firstVideo}))
    ) 

  playerConfig = {
    controls: 1,
    autoplay: 0
  } 

  public get videoPlayerFormats(): typeof VideoPlayerFormats {
    return VideoPlayerFormats; 
  }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();
  
  constructor(
    private store: Store<State>) { }

  ngOnInit(): void {

    if (!this.apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

  }

  playerError(event: any){
    console.log('player error', event);
  }

  toggleSettingRepeat() {
    this.settingRepeatOn = !this.settingRepeatOn;
    this.store.dispatch(VideoPageActions.setSettingRepeatOn({ settingRepeatOn: this.settingRepeatOn }));
  }

  setPlayerFormat(selectedFormat: VideoPlayerFormats) {
    this.videoPlayerStatus = selectedFormat;
  }

  switchToVideo(videoId: string) {
    this.store.dispatch(VideoPageActions.setCurrentVideo({ videoId }));
  }

  pauseVideo() {
    this.player.pauseVideo();
    this.videoIsPlaying = false;
  }

  playVideo() {
    this.player.playVideo();
    this.videoIsPlaying = true;
  }

  userPlayVideo() {
    this.isFirstVideoAfterInit = false;
    this.playVideo();
  }

  followState(event: any, nextVideo: string) {
    // https://developers.google.com/youtube/iframe_api_reference#Events
    switch(event.data) {
      case 0:
        // video has ended
        if (this.settingRepeatOn) {
          this.playVideo();
        } else {
          this.switchToVideo(nextVideo);
        }
        this.videoIsPlaying = false;
        break;
      case -1:
        // video is unstarted
        if (!this.isFirstVideoAfterInit){
         this.playVideo();
        }
        break;
      case 1:
        // video is playing

        // technical debt hack to "listen" to user click
        if (this.isFirstVideoAfterInit){
          this.isFirstVideoAfterInit = false;
        }
        this.videoIsPlaying = true;
        break;
      case 2:
        // video is paused
        this.videoIsPlaying = false;
        break;
      case 5:
        // video is loaded (cued)
        if (!this.isFirstVideoAfterInit){
          this.playVideo();
        }
        break;
      default:
        // not every state requires an action
    }
  }

}
