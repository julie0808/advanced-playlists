import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { Tag } from '../../tags/tag.model';
import { Video, VideoForm } from '../video.model';
import { Playlist } from '../../playlists/playlist.model';

import { Store } from '@ngrx/store';
import { State, getArtistTags, getOtherTagsForPrimeNg } from '../../tags/state';
import { VideoPageActions } from '../state/actions';
import { getCurrentVideoEdited } from '../state';
import { getCustomPlaylists } from '../../shared/state';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-video-tag-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectModule, SelectModule, RatingModule, ToastModule],
  templateUrl: './video-tag-edit.component.html',
  styleUrls: ['video-tag-edit.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [MessageService]
})
export class VideoTagEditComponent implements OnInit, OnDestroy {

  idSub!: Subscription;
  videoId!: string;
  currentlyEditedVideo!: Video;

  videoTagForm: VideoForm = this.fb.group({
    artists: this.fb.control( [] as Tag[]),
    tags: this.fb.control( [] as Tag[]),
    rating: this.fb.control(1),
    customPlaylists: this.fb.control( [] as Playlist[]),
  });

  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  video$ = this.store.select(getCurrentVideoEdited);
  tagList$ = this.store.select(getOtherTagsForPrimeNg);
  artistTagList$ = this.store.select(getArtistTags);
  customPlaylists$ = this.store.select(getCustomPlaylists);
    
  constructor(
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
        rating: video.rating,
        customPlaylists: video.customPlaylists
      })
    });

  } 

  updateVideo(): void {
    if (this.videoTagForm.valid){

      const updatedVideo = {
        ...this.currentlyEditedVideo,
        artists: this.videoTagForm.get('artists')?.value!,
        tags: this.videoTagForm.get('tags')?.value!,
        rating: this.videoTagForm.get('rating')?.value!,
        customPlaylists: this.videoTagForm.get('customPlaylists')?.value!,
      }

      this.currentlyEditedVideo = updatedVideo;

      this.store.dispatch(VideoPageActions.updateVideo({ video: this.currentlyEditedVideo }));
    }
  }

  ngOnDestroy(): void {
    this.idSub.unsubscribe();
  }

}
