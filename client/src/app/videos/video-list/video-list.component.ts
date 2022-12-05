import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { combineLatest, Subject, EMPTY } from 'rxjs';

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
        //console.info('emitting + videos lengnth', videos.length);
        this.playlistCount = videos.length;
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedVideo$ = this.videoService.selectedVideo$
    .pipe(
      //tap(() => console.info('video selected')),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  allVideoData$ = combineLatest([
      this.videos$,
      this.selectedVideo$,
    ])
      .pipe(
        filter( ([videos]) => Boolean(videos)), 
        map( ([videos, selectedVideo]) => ({videos, selectedVideo}))
        //,tap(() => console.info(`Final emit`))
      );

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit(){
    this.selectedVideo$.subscribe( (selecteVideo: IVideo) => {
      this.currentVideo = selecteVideo
    });
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: IVideo) {
    this.videoService.selectedVideoIdChanged(video.youtubeId);
  }

}
