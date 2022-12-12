import { Component, OnInit } from '@angular/core';
import { EMPTY, Subject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VideoService } from '../video-service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html'
})
export class VideoPlayerComponent implements OnInit {

  apiLoaded = false;

  playerConfig = {
    controls: 1
  }

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  video$ = this.videoService.selectedVideo$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    if (!this.apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }

  followState(event: any) {
    // https://developers.google.com/youtube/iframe_api_reference#Events
    switch(event.data) {
      case 0:
        // video has ended
        this.videoService.playNextVideo();
        break;
      case -1:
        // video is unstarted
        // console.log('unstarted');
        // event.target.playVideo();
        break;
      case 5:
        // video is cued
        // console.log('cued');
        // event.target.playVideo();
        break;
      default:
        // not every state needs an action
    }
  }

}
