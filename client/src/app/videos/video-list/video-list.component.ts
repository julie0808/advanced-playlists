import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Subject, EMPTY } from 'rxjs';

import { VideoService } from '../video-service';
import { IVideo } from '../video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent {

  currentVideo!: IVideo;
  playlistCount = 0;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  videos$ = this.videoService.videosSorted$
    .pipe(
      tap(videos => {
        this.playlistCount = videos.length;
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  videoPlaying$ = this.videoService.videoPlaying$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit(){
    this.videoPlaying$.subscribe( (selectedVideo: IVideo) => {
      this.currentVideo = selectedVideo
    });
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: IVideo) {
    this.videoService.videoPlayingIdChanged(video.youtubeId);
  }

}
