import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, EMPTY, Subject, Subscription } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';

import { TagService } from 'src/app/tags/tag.service';
import { VideoService } from '../video.service';
import { ITag } from '../../tags/tag.model';
import { IVideo, IVideoForm } from '../video.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-video-tag-edit',
  templateUrl: './video-tag-edit.component.html',
  styleUrls: ['video-tag-edit.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class VideoTagEditComponent implements OnInit, OnDestroy {

  idSub!: Subscription;
  videoId!: string;
  currentlyEditedVideo!: IVideo;

  videoTagForm: IVideoForm = this.fb.group({
    artists: this.fb.control( [] as ITag[]),
    tags: this.fb.control( [] as ITag[]),
    rating: this.fb.control(1)
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  video$ = this.videoService.editedVideo$
    .pipe(
      map(video => {
        return video;
      }),
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )
    
  tags$ = this.tagService.tagsFormatedForGrouping$
    .pipe(
      map(tags => {
        return tags.filter(tag => tag.id !== 55);
      })
    );

  artistsTags$ = this.tagService.tagsModified$
    .pipe(
      map(tags => {
        return tags.filter(tag => tag.parent_tag_id === 55);
      })
    );

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
        artists:  video?.artists || [],
        tags:  video?.tags || [],
        rating: video.rating
      })
    });

  } 

  updateVideo(): void {
    if (this.videoTagForm.valid){
      this.currentlyEditedVideo.artists = this.videoTagForm.get('artists')?.value!;
      this.currentlyEditedVideo.tags = this.videoTagForm.get('tags')?.value!;
      this.currentlyEditedVideo.rating = this.videoTagForm.get('rating')?.value!;

      this.videoService.updateVideo(this.currentlyEditedVideo);
    }
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }

}
