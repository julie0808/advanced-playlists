import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject, EMPTY } from 'rxjs';

import { VideoService } from '../video-service';
import { IVideo } from '../video.model';
import { ITag } from 'src/app/tags/tag-model';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html'
})
export class VideoListComponent {

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  videos$ = this.videoService.videosSorted$
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
    this.videos$.subscribe(videoList=>{
      this.videoService.updateNewVideos(videoList);
    })
    
  }

  editTags(objectId: string) {
    this.router.navigate([objectId, 'edit-tag'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }

  /*sortByTags(tags: ITag[]): void {
    this.tagsSelectedSubject.next(tags);
  }*/


}
