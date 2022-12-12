import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, Subscription } from 'rxjs';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { MultiSelectFilterOptions } from 'primeng/multiselect';

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

  videoTagForm: IVideoForm = this.fb.group({
    tags: this.fb.control( [] as ITag[], Validators.required)
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
      this.videoTagForm.patchValue({
        tags:  video?.tags || []
      })
    });

  } 

  updateVideoTag(){
    if (this.videoTagForm.valid){
      let updatedVideo: IVideo = new IVideoClass();

///////////////// is this necessary%      
      this.video$.subscribe( (video: IVideo) => updatedVideo = video);
      updatedVideo.tags =this.videoTagForm.get('tags')?.value!;
      this.videoService.updateVideo(updatedVideo);
    }
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }

}
