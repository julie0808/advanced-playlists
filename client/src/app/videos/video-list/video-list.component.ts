import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject, EMPTY } from 'rxjs';

import { VideoService } from '../video-service';
import { IVideo } from '../video.model';
import { ITag } from 'src/app/tags/tag-model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent {

  currentVideo!: IVideo;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  videos$ = this.videoService.videosSorted$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedVideo$ = this.videoService.selectedVideo$
    .pipe(
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
        map( ([videos, selectedVideo]) =>
        ({videos, selectedVideo}))
      );

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  ngOnInit(){
    this.selectedVideo$.subscribe(selecteVideo => {
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
