import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject, combineLatest, Observable } from 'rxjs';

import { VideoService } from '../video-service';
import { IVideo } from '../video.model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent {

  currentlyPlayingVideoPosition: number = 0;

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  videos$ = this.videoService.videosSorted$;
  allVideos$ = this.videoService.videoTagsModified$;
  videoPlaying$ = this.videoService.videoPlaying$;

  isLoading$ = this.videoService.isLoadingAction$;

  currentlyPlayingVideoPosition$: Observable<number> = combineLatest([
      this.videos$,
      this.videoPlaying$
    ])
    .pipe(
      map( ([videoList, currentVideoPlaying]) => {
        const videoPositionInList: number = videoList.indexOf(currentVideoPlaying);
        return videoPositionInList + 1;
      })
    );

  vm$ = combineLatest([
    this.videos$,
    this.allVideos$,
    this.videoPlaying$
  ]).pipe(
    map(([sortedVideos, allVideos, videoPlaying]) =>
        ({ sortedVideos, allVideos, videoPlaying }))
  )  

  constructor(private route: ActivatedRoute,
              private router: Router,
              private videoService: VideoService) { }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  playVideo(video: IVideo) {
    this.videoService.videoPlayingIdChanged(video.youtubeId);
  }

}
