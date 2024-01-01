import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { NonNullableFormBuilder } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';

import { VideoService } from '../video.service';
import { Tag } from '../../tags/tag.model';
import { Video, VideoForm } from '../video.model';

import { Store } from '@ngrx/store';
import { State, getArtistTags, getOtherTagsForPrimeNg } from '../../tags/state';
import { VideoPageActions } from '../state/actions';
import { getCurrentVideoEdited } from '../state';

@Component({
  selector: 'app-video-tag-edit',
  templateUrl: './video-tag-edit.component.html',
  styleUrls: ['video-tag-edit.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class VideoTagEditComponent implements OnInit, OnDestroy {

  idSub!: Subscription;
  videoId!: string;
  currentlyEditedVideo!: Video;

  videoTagForm: VideoForm = this.fb.group({
    artists: this.fb.control( [] as Tag[]),
    tags: this.fb.control( [] as Tag[]),
    rating: this.fb.control(1)
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  video$ = this.store.select(getCurrentVideoEdited);
  tagList$ = this.store.select(getOtherTagsForPrimeNg);
  artistTagList$ = this.store.select(getArtistTags);
    
  constructor(
    private videoService: VideoService,
    private store: Store<State>,
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder) { }

  ngOnInit() {
    
    this.idSub = this.route.params 
      .subscribe(
        (params: Params) => {
          this.videoId = params['id'];
          this.store.dispatch(VideoPageActions.setCurrentVideoEditedId({ videoId: params['id'] }))
        }
      )

    this.video$.subscribe( (video: Video) => {
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

      const updatedVideo = {
        ...this.currentlyEditedVideo,
        artists: this.videoTagForm.get('artists')?.value!,
        tags: this.videoTagForm.get('tags')?.value!,
        rating: this.videoTagForm.get('rating')?.value!
      }

      this.currentlyEditedVideo = updatedVideo;

      this.store.dispatch(VideoPageActions.updateVideo({ video: this.currentlyEditedVideo }));
    }
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }

}
