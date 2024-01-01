import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Video, VideoPlayerFormats } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getCurrentVideo, getNextVideoId, getPreviousVideoId, getFirstVideoId } from '../state';
import { VideoPageActions } from "../state/actions";


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  encapsulation : ViewEncapsulation.None

})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('player') player: any;

  apiLoaded = false;
  videoPlayerStatus: VideoPlayerFormats = VideoPlayerFormats.hidden;
  videoIsPlaying: boolean = false;

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
    
    if (!this.apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }

  }

  videoReady(event: any, video: string) {
    if ( video !== "12345678910" && this.videoPlayerStatus === VideoPlayerFormats.hidden ) {
      this.switchToVideo(video);
      this.videoPlayerStatus = VideoPlayerFormats.tiny
      this.playVideo();
    }
  }

  playerError(event: any){
    console.log('player error', event);
  }

  setPlayerFormat(selectedFormat: VideoPlayerFormats) {
    this.videoPlayerStatus = selectedFormat;
  }

  switchToVideo(videoId: string) {
    this.store.dispatch(VideoPageActions.setCurrentVideo({ videoId }));
  }

  pauseVideo() {
    this.videoIsPlaying = false;
    this.player.pauseVideo();
  }

  playVideo() {
    console.log('play bitch');
    this.videoIsPlaying = true;
    this.player.playVideo();
  }

  followState(event: any, nextVideo: string) {
    console.log('follow', event.data);
    // https://developers.google.com/youtube/iframe_api_reference#Events
    switch(event.data) {
      case 0:
        // video has ended
        this.switchToVideo(nextVideo);
        this.videoIsPlaying = false;
        break;
      case -1:
        // video is unstarted
        this.playVideo();
        break;
      case 2:
        // video is paused
        this.videoIsPlaying = false;
        break;
      case 5:
        // video is loaded (cued)
        this.playVideo();
        break;
      default:
        // not every state requires an action
    }
  }

}
