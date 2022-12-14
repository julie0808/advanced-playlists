import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, Subscription } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';

import { TagService } from 'src/app/tags/tag-service';
import { VideoService } from '../video-service';
import { ITag } from '../../tags/tag-model';
import { IVideo, IVideoClass, IVideoForm } from '../video.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-video-tag-edit',
  templateUrl: './video-tag-edit.component.html'
})
export class VideoTagEditComponent implements OnInit, OnDestroy {

  idSub!: Subscription;
  videoId!: string;
  currentlyEditedVideo!: IVideo;

  videoTagForm: IVideoForm = this.fb.group({
    tags: this.fb.control( [] as ITag[]),
    rating: this.fb.control(1)
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private videoSelectedSubject = new BehaviorSubject<number>(0); 
  videoSelectedAction$ = this.videoSelectedSubject.asObservable();

  video$ = this.videoService.selectedVideo$
    .pipe(
      map(video => {
        return video;
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    
  tags$ = this.tagService.tagsFormatedForGrouping$;

  constructor(private tagService: TagService,
              private videoService: VideoService,
              private route: ActivatedRoute,
              private fb: NonNullableFormBuilder) { }

  ngOnInit() {
    
    this.idSub = this.route.params 
      .subscribe(
        (params: Params) => {
          this.videoId = params['id'];
          this.videoService.selectedVideoIdChanged(params['id']);
        }
      )

    this.video$.subscribe( (video: IVideo) => {
      this.currentlyEditedVideo = video;
      this.videoTagForm.patchValue({
        tags:  video?.tags || [],
        rating: video.rating
      })
    });

  } 

  updateVideo(){
    if (this.videoTagForm.valid){
      this.currentlyEditedVideo.tags = this.videoTagForm.get('tags')?.value!;
      this.currentlyEditedVideo.rating = this.videoTagForm.get('rating')?.value!;

      this.videoService.updateVideo(this.currentlyEditedVideo);
    }
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }

}
